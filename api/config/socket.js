const { Server } = require("socket.io");

const socketHandler = require("../sockets/socketHandler");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  socketHandler(io);
}

module.exports = initializeSocket;