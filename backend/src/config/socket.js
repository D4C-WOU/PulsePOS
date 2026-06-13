const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);
  });

  return io;
};

const getIO = () => io;

module.exports = {
  initSocket,
  getIO,
};
