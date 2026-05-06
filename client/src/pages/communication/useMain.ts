import { getChannels } from "@/services/get-channel";
import type { Channel } from "@/services/post-channel";
import React from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

export default function useMain() {
  const { projectId } = useParams();

  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [channelsLoading, setChannelsLoading] = React.useState(false);

  React.useEffect(() => {
    (async function () {
      if (!projectId) return;

      try {
        setChannelsLoading(true);
        const res = await getChannels(projectId);

        setChannels(res as Channel[]);
        setChannelsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(error as string);
      }
    })();
  }, [projectId]);

  return {
    channels,
    channelsLoading,
    setChannels,
  };
}
