const registerChatEvents = require("./events/chat.event");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    registerChatEvents(io, socket);

    const userId =
      socket.handshake.auth.userId;

    socket.join(userId);

    console.log(
      `User ${userId} connected`
    );

    console.log(
      `Joined room ${userId}`
    );

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });

    socket.onAny((event, ...args) => {
      console.log("📥 EVENT:", event);
      console.log("📦 PAYLOAD:", args);
    });
  });
}

module.exports = socketHandler;