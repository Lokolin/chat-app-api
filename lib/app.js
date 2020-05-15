/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const _http = require("http");

const _http2 = _interopRequireDefault(_http);

const _express = require("express");

const _express2 = _interopRequireDefault(_express);

const _cors = require("cors");

const _cors2 = _interopRequireDefault(_cors);

const _socket = require("socket.io");

const _socket2 = _interopRequireDefault(_socket);

const _config = require("../config/config.json");

const _config2 = _interopRequireDefault(_config);

const _path = require("path");

const _path2 = _interopRequireDefault(_path);

// setup server
const app = (0, _express2.default)();
const server = _http2.default.createServer(app);

const socketIo = (0, _socket2.default)(server);

// Allow CORS
app.use((0, _cors2.default)());

// Render a API index page
app.get("/", function (req, res) {
  res.sendFile(_path2.default.resolve("public/index.html"));
});

// Start listening
server.listen(process.env.PORT || _config2.default.port);
console.log("Started on port " + _config2.default.port);

// Setup socket.io
socketIo.on("connection", function (socket) {
  const username = socket.handshake.query.username;
  const socketID = socket.id;

  console.log(username + " connected");

  socket.on("client:message", function (data) {
    console.log(data.username + ": " + data.message);

    // message received from client, now broadcast it to everyone else
    socket.broadcast.emit("server:message", data);
  });

  socket.on("getAllMessages", (data) => {
    console.log(`${data.username} wants to get all messages`);

    // socketIo.sockets.socket(socketID).emit("server:allMessage", messages);
    socketIo.to(socketID).emit("server:check", "hello from server");
    socket.emit("server:check2", "can you hear me?");
  });

  socket.on("disconnect", function () {
    console.log(username + " disconnected");
  });
});

exports.default = app;
