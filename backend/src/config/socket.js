const { Server } = require("socket.io");

let io;

const init = (server, corsOptions) => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    socket.on("join:kds", () => {
      socket.join("kds");
    });
    
    socket.on("join:pos", () => {
      socket.join("pos");
    });
    
    socket.on("disconnect", () => {});
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  init,
  getIo,
};
