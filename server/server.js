import {app} from './index.js';
import http from 'http';
import {initializeSocket} from "./socket.js"

const server = http.createServer(app);
initializeSocket(server);

server.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
