const { HandleNotifyQuantity, HandleSessionExpired, HandleRealTimePrice, HandleDisconnect, HandleIntervalID, HandleSubList, HandleRealTime } = require("./WebSocketHandler")

exports.WebSocketManager = (socket) => {
    console.log("socket ID: " + socket.id)
    console.log("socket handshake by: " + socket.handshake.query.username)

    HandleIntervalID(socket)
    HandleSessionExpired(socket)
    HandleNotifyQuantity(socket)
    HandleRealTimePrice(socket)
    HandleSubList(socket)
    HandleRealTime(socket)

    HandleDisconnect(socket)
}