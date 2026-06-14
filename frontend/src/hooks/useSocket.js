import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:5000";

// Single shared socket instance
const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

export const useSocket = (room) => {
  useEffect(() => {
    const onConnect = () => {
      if (room) {
        socket.emit(`join:${room}`);
      }
    };

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, [room]);

  return socket;
};

export default useSocket;
