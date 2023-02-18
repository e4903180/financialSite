const { Server } = require("socket.io");
const express = require('express');
const app = express();
const cors = require('cors');
const router = require("./router");
const http = require('http');
const server = http.createServer(app);
const { API_ROUTE_IP, sessionMiddleware, wrap, corsSetting, WebSocketMiddlewareHandler, ioOptions, config } = require('./constant');
const { WebSocketManager } = require("./WebSocketConfig/WebSocketManager");

//<--------------------------------HTTP settings-------------------------------->
// Allow POST, PUT method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP session middleware
app.use(sessionMiddleware);

// HTTP Cors settings
app.use(cors(corsSetting));

// Bind api IP to "0.0.0.0:3000/api"
app.use(API_ROUTE_IP, router.router);

//<--------------------------------Websocket settings-------------------------------->
// Websocket settings
io = new Server(server, ioOptions);

// convert a connect middleware to a Socket.IO middleware
io.use(wrap(sessionMiddleware));

// only allow authenticated users
io.use(WebSocketMiddlewareHandler);

// After client connect do something
io.on("connection", WebSocketManager);

//<--------------------------------Start listen-------------------------------->
server.listen(config["API_PORT"], config["API_BASE_IP"], function () {
    console.log(`Backend listening on port ${config["API_PORT"]}!`);
});