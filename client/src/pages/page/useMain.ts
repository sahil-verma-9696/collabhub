import React from "react";
// import * as idb from "@/lib/editorDB";

import { useParams } from "react-router";
import { useAppContext } from "@/contexts/app.context";
import { scheduleSync } from "@/lib/scheduleSync";

import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import type { PageMeta } from "@/services/post-page";
import patchPage from "@/services/patch-page";

export default function useMain() {
  const editorRef = React.useRef<HTMLElement | null>(null);
  const { pageId, projectId } = useParams();
  const ctx = useAppContext();

  const initialConfig: InitialConfigType = {
    namespace: `Editor-${pageId}`,
    onError: console.error,
  };

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!pageId || !projectId) return;

    // const savedMeta = await idb.getPageMeta(pageId);

    const updatedAt = Date.now().toString();

    const payload: Partial<PageMeta> = {
      title: e.target.value,
      updatedAt,
    };

    ctx.setPagesMeta((prev) =>
      prev.map((meta) =>
        meta.page === pageId ? { ...meta, ...payload } : meta,
      ),
    );

    await patchPage(projectId, pageId, {
      meta: {
        title: e.target.value,
      },
      page: {},
    });

    // Schedule sync
    scheduleSync(pageId, "UPDATE_META", {
      pageId,
      ...payload,
    });
  }

  const pageTitle = React.useMemo(
    () => ctx.pagesMeta.find((meta) => meta.page === pageId)?.title,
    [pageId, ctx.pagesMeta],
  );

  return {
    editorRef,
    initialConfig,
    pageTitle,
    handleInputChange,
  };
}
