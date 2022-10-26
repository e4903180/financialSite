const session = require('express-session');

const sessionMaxAge = 15 * 60 * 1000
const API_BASE_IP = "0.0.0.0"
const API_ROUTE_IP = "/api"
const API_PORT = 3000
const CLIENT_IP = "http://140.116.214.154:8080"

const sessionMiddleware = session({
    secret: 'secretkey',
    rolling: true,
    saveUninitialized: false,
    resave: true, 
    cookie: {
        maxAge : sessionMaxAge,
        secure : false
    }
})

const corsSetting = {
    origin : CLIENT_IP,
    credentials: true,
}

const ioOptions = {
    cors : corsSetting
}

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

const WebSocketMiddlewareHandler = (socket, next) => {
    if (socket.handshake.query.username) {
      next();
    }
}

module.exports = { sessionMaxAge, API_BASE_IP, API_ROUTE_IP, API_PORT, CLIENT_IP, sessionMiddleware, corsSetting, ioOptions, wrap, WebSocketMiddlewareHandler }