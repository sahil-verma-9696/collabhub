import React from "react";
import { SOCKET_EVENTS } from "@/socket.events.constants";
import { useSocketContext } from "@/contexts/socket.context";
import { useMessanger } from "./use-messanger";
import chalk from "chalk";

export type OnlineUser = {
  userId: string;
  lastSeen: number;
  devices: number;
};

export default function useAppData() {
  const [onlineUsers, setOnlineUsers] = React.useState<OnlineUser[]>([]);

  const { socket } = useSocketContext();

  useMessanger();

  const handleOnlineUsers = (payload: OnlineUser[]) => {
    console.log(chalk.green(`[on::${SOCKET_EVENTS.ONLINE_USERS}]`), payload);

    setOnlineUsers(payload);
  };

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
  };
}
