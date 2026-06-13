import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const createSocket = () => {
  return io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
  });
};