import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import * as idb from "@/lib/editorDB";

import React from "react";
import { useParams } from "react-router";
import { useAppContext } from "@/contexts/app.context";

export default function useMain() {
  const editorRef = React.useRef<HTMLElement | null>(null);
  const params = useParams();
  const ctx = useAppContext();

  const clientId = params["client-id"];

  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    onError: console.error,
  };

  const pageTitle = React.useMemo(() => {
    if (!clientId) return;

    return ctx.pagesMeta.find((page) => page.clientId === clientId)?.title;
  }, [ctx.pagesMeta, clientId]);

  async function handleUpdateTitle(title: string) {
    if (!clientId) return;

    const payload = await idb.getPageMeta(clientId);

    await idb.setPageMeta(clientId, {
      ...payload,
      title,
      updatedAt: Date.now().toString(),
    });
  }

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    ctx.setPagesMeta((prev) => {
      return prev.map((page) => {
        if (page.clientId === clientId) {
          return { ...page, title: e.target.value };
        }
        return page;
      });
    });

    await handleUpdateTitle(e.target.value);
  }

  return {
    editorRef,
    initialConfig,
    pageTitle,
    handleInputChange,
  };
}
