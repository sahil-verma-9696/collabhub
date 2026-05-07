import { useRef, useEffect, useMemo } from "react";
import { MessageBubble } from "./message-bubble";
import localSpace from "@/services/local-space";
import { useChattingPageContext } from "../_chatting-page.context";
import type { User } from "@/services/auth";

export function ChatMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, members } = useChattingPageContext();

  const messageWithSender = useMemo(() => {
    if (!messages || !members) return [];
    return messages.map((message) => {
      return {
        ...message,
        sender: members.find((member) => member.user._id === message.sender),
      };
    });
  }, [messages, members]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages || messages.length === 0)
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-center">
          No messages yet. Start the conversation!
        </p>
      </div>
    );

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-4 bg-transparent p-4"
    >
      {messageWithSender.map((message) => (
        <div key={message._id}>
          <MessageBubble
            content={message.content}
            timestamp={message.createdAt}
            isOwn={isOwn(message.sender?.user._id as string)}
            sender={message.sender?.user as User | undefined}
          />
        </div>
      ))}
    </div>
  );
}

function isOwn(senderId: string) {
  return localSpace.getUser()?._id === senderId;
}
