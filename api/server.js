const http = require("http");
const app = require("./app");

const initializeSocket = require("./config/socket");

const server = http.createServer(app);

initializeSocket(server);

server.listen(3000, () => {
  console.log("Server started");
});