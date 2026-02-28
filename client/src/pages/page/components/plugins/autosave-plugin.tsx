import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import * as idb from "@/lib/editorDB";
import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";

const EMPTY_EDITOR_STATE = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;

export function AutoSavePlugin() {
  const [editor] = useLexicalComposerContext();
  const params = useParams();

  const clientId = params["client-id"];

  // 👉 debounced server sync (30s)
  const uploadToServer = useMemo(
    () =>
      debounce(async (content: object) => {
        console.log(
          "🚀 ~ file: AutoSavePlugin.tsx:27 ~ uploadToServer ~ content",
          content,
        );
      }, 30000),
    [],
  );

  // Load from IndexedDB on mount
  useEffect(() => {
    (async () => {
      if (!clientId) return;

      const payload = await idb.getPage(clientId);

      const savedState = payload.content ? payload.content : EMPTY_EDITOR_STATE;

      const parsed = editor.parseEditorState(savedState);
      editor.setEditorState(parsed);
    })();
  }, [editor, clientId]);

  return (
    <OnChangePlugin
      onChange={async (editorState) => {
        if (!clientId) return;

        const json = editorState.toJSON();

        // ✅ Save instantly to IndexedDB
        idb.setPage(clientId, json);

        const payload = await idb.getPageMeta(clientId);

        idb.setPageMeta(clientId, {
          ...payload,
          updatedAt: Date.now().toString(),
        });

        // ✅ Upload throttled
        uploadToServer(json);
      }}
    />
  );
}
