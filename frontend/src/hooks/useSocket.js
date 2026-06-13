import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] =
    useState(false);

  useEffect(() => {
    const socketInstance = io(
      SOCKET_URL,
      {
        transports: ["websocket"],
      }
    );

    socketInstance.on(
      "connect",
      () => {
        console.log(
          "Socket Connected:",
          socketInstance.id
        );

        setConnected(true);
      }
    );

    socketInstance.on(
      "disconnect",
      () => {
        console.log(
          "Socket Disconnected"
        );

        setConnected(false);
      }
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return {
    socket,
    connected,
  };
};

export default useSocket;