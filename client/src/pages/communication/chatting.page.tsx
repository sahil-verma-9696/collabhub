import { useChattingPageContext } from "./_chatting-page.context";
import { ChatHeader } from "./components/chat-header";
import { ChatInput } from "./components/chat-input";
import { ChatMessages } from "./components/chat-messages";

export default function Page() {
  useChattingPageContext();
  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
