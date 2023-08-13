const { HandleNotifyQuantity, HandleSessionExpired, HandleDisconnect, HandleIntervalID } = require("./WebSocketHandler")

exports.WebSocketManager = (socket) => {
    console.log("socket ID: " + socket.id)
    console.log("socket handshake by: " + socket.handshake.query.username)

    HandleIntervalID(socket)
    HandleSessionExpired(socket)
    HandleNotifyQuantity(socket)

    HandleDisconnect(socket)
}