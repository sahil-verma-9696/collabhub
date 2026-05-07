import { useSocketContext } from "@/contexts/socket.context";
import { getChannel } from "@/services/get-channel";
import type { Channel } from "@/services/post-channel";
import React from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useMessage } from "./use-message";
import { useGetChannelMembers } from "@/hooks/use-get-channel-members";

export function useChattingPageLogic() {
  const { projectId, channelId } = useParams();
  const { socket } = useSocketContext();

  const [channel, setChannel] = React.useState<Channel | null>(null);
  const [channelLoading, setChannelLoading] = React.useState(false);

  const ctx = useMessage();

  const { members, membersLoading } = useGetChannelMembers();

  React.useEffect(() => {
    (async function () {
      if (!projectId || !channelId) return;
      try {
        setChannelLoading(true);
        const res = await getChannel(projectId, channelId);
        setChannel(res as Channel);
        setChannelLoading(false);
      } catch (error) {
        toast.error((error as Error).message);
        setChannelLoading(false);
        setChannel(null);
      }
    })();
  }, [projectId, channelId]);

  // Emmit Socket events `join-channel`, `leave-channel`, `get-active-users`
  React.useEffect(() => {
    if (!channelId || !socket) return () => {};

    socket.emit("join-channel", { channelId });
    socket.emit("get-active-users", { channelId });

    return () => {
      socket.emit("leave-channel", { channelId });
    };
  }, [channelId, socket]);

  return {
    channel,
    channelLoading,
    members,
    membersLoading,
    ...ctx,
  };
}
