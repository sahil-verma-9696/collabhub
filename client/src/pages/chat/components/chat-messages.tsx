import { useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import type { Message } from "@/services/get-messages";
import localSpace from "@/services/local-space";

interface ChatMessagesProps {
  messages: Message[] | null;
  onReply?: (message: Message) => void;
  replyingTo?: Message | null;
}

export function ChatMessages({ messages, onReply }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages || messages.length === 0)
    return (
      <div className="flex h-full items-center justify-center">
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
      {messages.map((message) => (
        <div key={message._id || message.clientId}>
          <MessageBubble
            content={message.text}
            timestamp={message.createdAt}
            isOwn={isOwn(message)}
            type={message.type}
            onReply={() => onReply?.(message)}
            status={message.status}
            clientId={message.clientId}
            sender={message.sender}
          />
        </div>
      ))}
    </div>
  );
}

function isOwn(message: Message) {
  return localSpace.getUser()?._id === message.sender;
}
