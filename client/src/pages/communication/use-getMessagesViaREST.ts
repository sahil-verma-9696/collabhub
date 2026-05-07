import { getMessages, type Message } from "@/services/get-messages";
import React from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

export function useGetMessagesViaREST(
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setMessagesLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const { projectId, channelId } = useParams();

  React.useEffect(() => {
    (async function () {
      if (!projectId || !channelId) return;
      try {
        setMessagesLoading(true);
        const res = await getMessages(projectId, channelId);

        setMessages((res as Message[]) || []);
        setMessagesLoading(false);
      } catch (error) {
        toast.error((error as Error).message);
        setMessagesLoading(false);
        setMessages([]);
      }
    })();
  }, [projectId, channelId, setMessagesLoading, setMessages]);
}
