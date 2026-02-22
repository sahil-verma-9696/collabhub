import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "@/contexts/auth.contex";
import localSpace from "@/services/local-space";
import { SERVER_URL } from "@/app.constatns";
import getBrowserInfo from "@/services/get-browserInfo";
import getDeviceId from "@/services/get-deviceId";
import chalk from "chalk";

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localSpace.getAccessToken();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket((prev) => {
        if (prev) {
          prev.disconnect();
        }
        return null;
      });

      setIsConnected(false);
      return;
    }

    let socketInstance: Socket | null = null;

    socketInstance = io(SERVER_URL, {
      auth: {
        token: accessToken,
        deviceId: getDeviceId(),
        browserInfo: getBrowserInfo(),
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 5000,
    });

    socketInstance.on("connect", () => {
      console.log(chalk.green("[SOCKET CONNECTED]"));
      setIsConnected(true);
      setError(null);
      setSocket(socketInstance);
    });

    socketInstance.on("connect_error", (err) => {
      console.log(chalk.red("[SOCKET ERROR]"), err.message);
      setError(err.message);
      setIsConnected(false);
      setSocket(null);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(chalk.red("[SOCKET DISCONNECTED]"), reason);
      setIsConnected(false);
      setSocket(null);
    });


    return () => {
      socketInstance.off();
      socketInstance.disconnect();
    };
  }, [isAuthenticated, accessToken]);

  return { socket, isConnected, error };
}
