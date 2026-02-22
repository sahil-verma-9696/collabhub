import { useSocketContext } from "@/contexts/socket.context";
import { messageQueue } from "../services/message-queue";
import React from "react";
import { SOCKET_EVENTS } from "@/socket.events.constants";
import chalk from "chalk";

export function useMessanger() {
  const { socket, isConnected } = useSocketContext();

  function messanger() {
    if (isConnected && socket) {
      let isEmpty = messageQueue.isEmpty();

      while (!isEmpty) {
        if (isEmpty) return;

        const message = messageQueue.dequeue();

        socket.emit(SOCKET_EVENTS.MESSAGE, message);

        console.log(chalk.magenta(`[emit::${SOCKET_EVENTS.MESSAGE}]`), message);

        isEmpty = messageQueue.isEmpty();
      }
    }
  }

  React.useEffect(() => {
    window.addEventListener("message-queue-change", messanger);

    return () => window.removeEventListener("message-queue-change", messanger);
  }, [socket]);

  React.useEffect(() => {
    if (isConnected) {
      messanger();
    }
  }, [isConnected]);
}
