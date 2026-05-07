import { type Message } from "@/services/get-messages";
import React from "react";
import { useParams } from "react-router";
import { useGetMessagesViaREST } from "./use-getMessagesViaREST";
import { useSocketContext } from "@/contexts/socket.context";

export function useMessage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = React.useState(false);
  const { socket } = useSocketContext();
  const { projectId, channelId } = useParams();

  // Get messages via REST
  useGetMessagesViaREST(setMessages, setMessagesLoading);

  React.useEffect(() => {
    if (!socket) return () => {};

    socket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message] as Message[]);
    });
  }, [socket]);

  function sendMessage(message: string) {
    if (!projectId || !channelId || !socket) return;
    socket.emit("message", { channel: channelId, content: message } as Message);
  }

  return { messages, messagesLoading, setMessages, sendMessage };
}
