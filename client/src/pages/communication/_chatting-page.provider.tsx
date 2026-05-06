import Context from "./_chatting-page.context";
import Page from "./chatting.page";
import { useChattingPageLogic } from "./use-chatting-page.logic";

export default function ChattingPageProvider() {
  return (
    <Context.Provider value={useChattingPageLogic()}>
      <Page />
    </Context.Provider>
  );
}
