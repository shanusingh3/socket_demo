const registerChatEvents = require("./events/chat.event");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    registerChatEvents(io, socket);

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