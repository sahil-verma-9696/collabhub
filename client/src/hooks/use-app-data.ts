import React from "react";
import { SOCKET_EVENTS } from "@/socket.events.constants";
import { useSocketContext } from "@/contexts/socket.context";
import { useMessanger } from "./use-messanger";
import chalk from "chalk";
import * as idb from "@/lib/editorDB";

export type OnlineUser = {
  userId: string;
  lastSeen: number;
  devices: number;
};

export type PageMeta = {
  title: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
};

export default function useAppData() {
  const [onlineUsers, setOnlineUsers] = React.useState<OnlineUser[]>([]);
  const [pagesMeta, setPagesMeta] = React.useState<PageMeta[]>([]);

  const { socket } = useSocketContext();

  useMessanger();

  const handleOnlineUsers = (payload: OnlineUser[]) => {
    console.log(chalk.green(`[on::${SOCKET_EVENTS.ONLINE_USERS}]`), payload);

    setOnlineUsers(payload);
  };

  const handleCreateNewPage = (e: React.MouseEvent) => {
    e.stopPropagation();

    const meta = {
      _id: "",
      clientId: crypto.randomUUID(),
      title: "New Page",
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    };

    idb.createPageMetaWithPage(meta);

    setPagesMeta((prev) => [...prev, meta]);
  };

  // GET Pages meta from idb
  React.useEffect(() => {
    (async () => {
      const pageMetas = await idb.getPageMetas();

      setPagesMeta(pageMetas);
    })();
  }, []);


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

  return {
    onlineUsers,
    pagesMeta,
    setPagesMeta,
    handleCreateNewPage,
  };
}
