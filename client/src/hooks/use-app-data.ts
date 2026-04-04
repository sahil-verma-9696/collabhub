import React from "react";
import chalk from "chalk";
import { SOCKET_EVENTS } from "@/socket.events.constants";
import { useSocketContext } from "@/contexts/socket.context";
import { useMessanger } from "./use-messanger";
import { processQueue } from "@/lib/processQueue";
import { useLoaderData, useParams } from "react-router";
import type { LoaderData } from "@/loaders/project.loader";
import postPage, { type PageMeta } from "@/services/post-page";
import { EMPTY_EDITOR_STATE } from "@/pages/page/use-autosave";
import getPageMetas from "@/services/get-page-mets";
import deletePage from "@/services/delete-page";

export type OnlineUser = {
  userId: string;
  lastSeen: number;
  devices: number;
};

export default function useAppData() {
  const { projectId } = useParams();
  const [onlineUsers, setOnlineUsers] = React.useState<OnlineUser[]>([]);
  const [pagesMeta, setPagesMeta] = React.useState<PageMeta[]>([]);

  const loaderData = useLoaderData() as LoaderData;

  const { socket } = useSocketContext();

  useMessanger();

  const pagesMetaSortByUpdatedAt = React.useMemo(() => {
    return [...pagesMeta].sort(
      (a, b) => Number(b.updatedAt) - Number(a.updatedAt),
    );
  }, [pagesMeta]);

  const handleOnlineUsers = (payload: OnlineUser[]) => {
    console.log(chalk.green(`[on::${SOCKET_EVENTS.ONLINE_USERS}]`), payload);

    setOnlineUsers(payload);
  };

  const handleCreateNewPage = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!projectId) return;

    const res = await postPage(projectId, {
      meta: {
        title: "New Page",
      },
      page: {
        content: EMPTY_EDITOR_STATE,
      },
    });

    setPagesMeta((prev) => [...prev, res.meta]);
  };

  const handleDeletePage = (pageId: string) => async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!projectId || !pageId) return;

    try {
      await deletePage(projectId, pageId);

      setPagesMeta((prev) => prev.filter((p) => p.page !== pageId));
    } catch (error) {
      console.log(error);
    }
  };

  // GET Pages meta from network
  React.useEffect(() => {
    (async () => {
      if (!projectId) return;

      try {
        const pageMetas = await getPageMetas(projectId);

        setPagesMeta(pageMetas as PageMeta[]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [projectId]);

  // GET ONLINE FRIENDS
  React.useEffect(() => {
    if (socket) {
      socket.on(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);
    }

    return () => {
      if (socket) {
        socket.off(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);
      }
    };
  }, [socket]);

  React.useEffect(() => {
    window.addEventListener("online", processQueue);

    processQueue(); // try on app load

    return () => {
      window.removeEventListener("online", processQueue);
    };
  }, []);

  return {
    onlineUsers,
    pagesMeta,
    pagesMetaSortByUpdatedAt,
    loaderData,
    setPagesMeta,
    handleCreateNewPage,
    handleDeletePage,
  };
}
