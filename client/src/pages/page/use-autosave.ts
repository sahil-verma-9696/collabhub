// import React from "react";
import { useParams } from "react-router";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { EditorState } from "lexical";
import patchPage from "@/services/patch-page";
// import { SocketIOProvider } from "y-socket.io";
// import { createBindingV2__EXPERIMENTAL } from "@lexical/yjs";
// import * as Y from "yjs";

export const EMPTY_EDITOR_STATE = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;

export function useAutosave() {
  // const [editor] = useLexicalComposerContext();
  const { projectId, pageId } = useParams();

  // ✅ persist across renders
  // const docMapRef = React.useRef<Map<string, Y.Doc>>(new Map());
  // const bindingRef = React.useRef<{
  //   binding: any;
  //   provider: SocketIOProvider;
  //   doc: Y.Doc;
  // } | null>(null);

  // React.useEffect(() => {
  //   if (!editor || !pageId || !projectId) return;

  //   // ✅ prevent duplicate binding (VERY IMPORTANT)
  //   if (bindingRef.current) return;

  //   const id = `Page-${pageId}-Project-${projectId}`;
  //   const docMap = docMapRef.current;

  //   // ✅ reuse doc
  //   let doc = docMap.get(id);
  //   if (!doc) {
  //     doc = new Y.Doc();
  //     docMap.set(id, doc);
  //   }

  //   // ✅ create provider
  //   const provider = new SocketIOProvider("ws://localhost:3000", id, doc, {});

  //   // ✅ awareness (user identity)
  //   provider.awareness.setLocalStateField("user", {
  //     name: "User-" + Math.floor(Math.random() * 1000),
  //     color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  //   });

  //   // ✅ create binding (with type cast fix)
  //   const binding = createBindingV2__EXPERIMENTAL(editor, id, doc, docMap);

  //   bindingRef.current = { binding, provider, doc };

  //   // ✅ connect
  //   provider.connect();

  //   console.log("🔥 Collaboration initialized:", id);

  //   // 🔍 debug
  //   editor.registerUpdateListener(({ editorState }) => {
  //     console.log("📝 Local editor change");
  //   });

  //   doc.on("update", () => {
  //     console.log("🧠 Yjs update fired");
  //   });
  //   // 🔥 connect provider manually
  //   provider.on("sync", (isSynced) => {
  //     console.log("🔄 synced:", isSynced);
  //   });

  //   provider.on("update", () => {
  //     console.log("🌐 network update");
  //   });
  //   return () => {
  //     console.log("🧹 cleanup:", id);

  //     // binding.destroy();
  //     provider.disconnect();
  //     provider.destroy();
  //     doc.destroy();

  //     bindingRef.current = null;
  //   };
  // }, [editor, pageId, projectId]);

  // ✅ autosave only (no loading here!)
  const handleEditorStateChange = async (editorState: EditorState) => {
    if (!pageId || !projectId) return;

    const json = editorState.toJSON();

    try {
      await patchPage(projectId, pageId, {
        meta: {
          updatedAt: Date.now().toString(),
        },
        page: {
          content: JSON.stringify(json),
        },
      });
    } catch (err) {
      console.error("❌ Autosave failed", err);
    }
  };

  return {
    handleEditorStateChange,
  };
}
