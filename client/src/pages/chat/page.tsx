import { ChatHeader } from "./components/chat-header";
import { ChatMessages } from "./components/chat-messages";
import { ChatInput } from "./components/chat-input";
import { usePageContext } from "./_context";

export default function ChatPanel() {
  const ctx = usePageContext();

  if (ctx.chatResError) return <div>{ctx.chatResError}</div>;

  if (!ctx.chatRes) return <div>Data not found</div>;

  if (ctx.chatResLoading) return <div>Loading...</div>;

  const { participant } = ctx.chatRes[0];

  return (
    <div
      data-slot="chat-panel"
      className="flex h-[calc(100vh-16px)] flex-col bg-background"
    >
      <ChatHeader user={participant.user} />
      <ChatMessages messages={ctx.messageHistory} />
      <ChatInput />
    </div>
  );
}
