import React from "react";
import { useParams } from "react-router";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { EditorState } from "lexical";
import getPage from "@/services/get-page";

export const EMPTY_EDITOR_STATE = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;

export function useAutosave() {
  // Editor state
  const [editor] = useLexicalComposerContext();

  const { projectId, pageId } = useParams();

  // Load from IndexedDB on mount
  React.useEffect(() => {
    (async () => {
      if (!pageId || !projectId) return;

      const page = await getPage(projectId, pageId);

      const content = JSON.parse(page.content || EMPTY_EDITOR_STATE);

      const parsed = editor.parseEditorState(content);

      editor.setEditorState(parsed);
    })();
  }, [editor, pageId, projectId]);

  const handleEditorStateChange = async (editorState: EditorState) => {
    if (!pageId) return;

    const json = editorState.toJSON();

    const updatedAt = Date.now().toString();

    console.log(json, updatedAt);
  };

  return {
    handleEditorStateChange,
  };
}
