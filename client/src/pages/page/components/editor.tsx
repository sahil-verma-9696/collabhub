import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import * as Y from "yjs";
import { useCallback } from "react";
import { LexicalCollaboration } from "@lexical/react/LexicalCollaborationContext";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { SocketIOProvider } from "y-socket.io";
import type { Provider } from "@lexical/yjs";
import { useParams } from "react-router";

export const Editor = function Editor() {
  const { pageId } = useParams();

  const initialConfig = {
    // NOTE: This is critical for collaboration plugin to set editor state to null. It
    // would indicate that the editor should not try to set any default state
    // (not even empty one), and let collaboration plugin do it instead
    editorState: null,
    namespace: "Demo",
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
    theme: {},
  };

  const getDocFromMap = (id: string, yjsDocMap: Map<string, Y.Doc>): Y.Doc => {
    let doc = yjsDocMap.get(id);

    if (doc === undefined) {
      doc = new Y.Doc();
      yjsDocMap.set(id, doc);
    } else {
      doc.load();
    }

    return doc;
  };

  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Y.Doc>) => {
      const doc = getDocFromMap(id, yjsDocMap);

      console.log(id);

      return new SocketIOProvider(
        "ws://localhost:3000",
        id,
        doc,
        {},
      ) as unknown as Provider;
    },
    [],
  );

  return (
    <>
      <LexicalCollaboration>
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none" />}
            placeholder={<div>Start collaborating...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <CollaborationPlugin
            id={pageId!}
            providerFactory={providerFactory}
            shouldBootstrap={true}
          />
        </LexicalComposer>
      </LexicalCollaboration>
    </>
  );
};
