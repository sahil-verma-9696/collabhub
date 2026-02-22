import type useSocket from "@/hooks/use-socket";
import React from "react";

const SocketContext = React.createContext<ReturnType<typeof useSocket> | null>(
  null,
);

export default SocketContext;

export function useSocketContext() {
  const ctx = React.useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
}
