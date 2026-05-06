import { getChannel } from "@/services/get-channel";
import type { Channel } from "@/services/post-channel";
import React from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

export function useChattingPageLogic() {
  const { projectId, channelId } = useParams();

  const [channel, setChannel] = React.useState<Channel | null>(null);
  const [channelLoading, setChannelLoading] = React.useState(false);

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
  }, []);

  console.log(projectId, channelId);
  return {
    channel,
    channelLoading,
  };
}
