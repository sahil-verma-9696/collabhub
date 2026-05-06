import React from "react";
import type { useChattingPageLogic } from "./use-chatting-page.logic";

/****************************************************
 * ****************** Types *************************
 *****************************************************/
export type TContext = ReturnType<typeof useChattingPageLogic>;

/****************************************************
 * ****************** Context ************************
 * *****************************************************/
const Context = React.createContext<TContext | null>(null);

export default Context;

export const useChattingPageContext = () => {
  const ctx = React.useContext(Context);
  if (!ctx)
    throw new Error("useChattingPageContext must be used inside ChattingPage");
  return ctx;
};
