function createMessage(senderId, message) {
  return {
    senderId,
    message,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  createMessage,
};