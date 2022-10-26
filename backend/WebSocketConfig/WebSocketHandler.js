const { sessionMaxAge } = require('../constant');
const con = require('../Model/connectMySQL');
const { HandleNotifyQuantityTimeInterval } = require('./WebSocketConstant');

exports.HandleNotifyQuantity = (socket) => {
    setInterval(async () => {
        let sql = "SELECT * FROM notify WHERE `username`= " + `"${socket.handshake.query.username}"` + "AND `read`=0"

        try {
            const [rows, fields] = await con.promise().query(sql);

            socket.emit("REGISTER_NOTIFY_QUANTITY", rows.length)
        } catch (error) {
            console.log(error)
        }
    }, HandleNotifyQuantityTimeInterval)
}

exports.HandleSessionExpired = (socket) => {
    setTimeout(() => {
        socket.disconnect(true)
    }, sessionMaxAge)
}