const { HandleNotifyQuantity, HandleSessionExpired } = require("./WebSocketHandler")

exports.WebSocketManager = (socket) => {
    console.log("socket ID: " + socket.id)
    console.log("socket hanshake query username: " + socket.handshake.query.username)

    HandleSessionExpired(socket)
    HandleNotifyQuantity(socket)

    socket.on("disconnect", () => {
        console.log("Client disconnect")
    })
}