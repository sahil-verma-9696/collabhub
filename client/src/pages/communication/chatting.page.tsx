import { useChattingPageContext } from "./_chatting-page.context";
import { ChatHeader } from "./components/chat-header";

export default function Page() {
  useChattingPageContext();
  return (
    <div>
      <ChatHeader />
    </div>
  );
}
