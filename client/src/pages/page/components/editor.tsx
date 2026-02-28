import {
  LexicalComposer
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoSavePlugin } from "./plugins/autosave-plugin";
import { usePageContext } from "../_context";

export const Editor = function Editor() {
  const ctx = usePageContext();

  return (
    <LexicalComposer initialConfig={ctx.initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="outline-none" />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <AutoSavePlugin />
      <HistoryPlugin />
    </LexicalComposer>
  );
};
