import React from "react";
import * as idb from "@/lib/editorDB";

import { useParams } from "react-router";
import { useAppContext } from "@/contexts/app.context";
import { scheduleSync } from "@/lib/scheduleSync";

import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import type { PageMeta } from "@/services/post-page";

export default function useMain() {
  const editorRef = React.useRef<HTMLElement | null>(null);
  const params = useParams();
  const ctx = useAppContext();
  const pageId = params["pageId"];

  const initialConfig: InitialConfigType = {
    namespace: `Editor-${pageId}`,
    onError: console.error,
  };

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!pageId) return;

    const savedMeta = await idb.getPageMeta(pageId);

    const updatedAt = Date.now().toString();

    const payload: Partial<PageMeta> = {
      title: e.target.value,
      updatedAt,
    };

    ctx.setPagesMeta((prev) =>
      prev.map((page) =>
        page._id === pageId ? { ...page, ...payload } : page,
      ),
    );

    // Save locally
    await idb.setPageMeta(pageId, { ...savedMeta, ...payload });

    // Schedule sync
    scheduleSync(pageId, "UPDATE_META", {
      pageId,
      ...payload,
    });
  }

  const pageTitle = React.useMemo(
    () => ctx.pagesMeta.find((page) => page._id === pageId)?.title,
    [pageId, ctx.pagesMeta],
  );

  return {
    editorRef,
    initialConfig,
    pageTitle,
    handleInputChange,
  };
}
