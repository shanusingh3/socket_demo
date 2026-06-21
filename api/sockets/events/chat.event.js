const EVENTS = require("../../constants/socketEvents");

const ChatService = require("../../services/chat.service");

function registerChatEvents(io, socket) {
  socket.on(EVENTS.SEND_MESSAGE, (payload) => {
    const response = ChatService.createMessage(
      socket.id,
      payload.message
    );

    socket.on(
      "send_message",
      payload => {
        const {
          toUserId,
          message,
        } = payload;

        const fromUserId =
          socket.handshake.auth.userId;

        io.to(toUserId).emit(
          "receive_message",
          {
            fromUserId,
            message,
          }
        );
      }
    );


  });
}

module.exports = registerChatEvents;