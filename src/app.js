import http from "http";
import express from "express";
import cors from "cors";
import io from "socket.io";
import config from "../config/config.json";
import path from "path";

// setup server
const app = express();
const server = http.createServer(app);

const socketIo = io(server);
let messages = [];
// Allow CORS
app.use(cors());

// Render a API index page
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

// Start listening
server.listen(process.env.PORT || config.port);
console.log(`Started on port ${config.port}`);

// Setup socket.io
socketIo.on("connection", (socket) => {
  const username = socket.handshake.query.username;
  const socketID = socket.id;
  console.log(`${username} connected`);

  socket.on("client:message", (data) => {
    console.log(`${data.username}: ${data.message}`);

    // message received from client, now broadcast it to everyone else
    socket.broadcast.emit("server:message", data);
  });

  socket.on("client:getAllMessages", (data) => {
    console.log(`${data.username} wants to get all messages`);

    // socketIo.sockets.socket(socketID).emit("server:allMessage", messages);
    socketIo.to(socketID).emit("server:check", "hello from server");
    socket.emit("server:check2", "can you hear me?");
  });

  socket.on("disconnect", () => {
    console.log(`${username} disconnected`);
  });
});

export default app;
