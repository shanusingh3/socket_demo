const EVENTS = require("../../constants/socketEvents");

const ChatService = require("../../services/chat.service");

function registerChatEvents(io, socket) {
  socket.on(EVENTS.SEND_MESSAGE, (payload) => {
    const response = ChatService.createMessage(
      socket.id,
      payload.message
    );

    io.emit(EVENTS.RECEIVE_MESSAGE, response);
  });
}

module.exports = registerChatEvents;