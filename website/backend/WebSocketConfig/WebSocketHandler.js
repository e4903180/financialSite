const { sessionMaxAge } = require('../constant');
const con = require('../Model/connectFinancial');
const { HandleNotifyQuantityTimeInterval } = require('./WebSocketConstant');

//Define a dict to record user timer
var IntervalID = {}

exports.HandleIntervalID = (socket) => {
    IntervalID[socket.handshake.query.username] = []
}

exports.HandleNotifyQuantity = (socket) => {
    const NotifyQuantityID = setInterval(async () => {
        let sql = "SELECT COUNT(*) FROM notify WHERE `username`= " + `"${socket.handshake.query.username}"` + "AND `read`=0"

        try {
            const [rows, fields] = await con.promise().query(sql);

            socket.emit("REGISTER_NOTIFY_QUANTITY", rows[0]['COUNT(*)'].toString())
        } catch (error) {
            console.log(error)
        }
    }, HandleNotifyQuantityTimeInterval)
    
    IntervalID[socket.handshake.query.username].push(NotifyQuantityID)
}

exports.HandleSessionExpired = (socket) => {
    const SessionID = setTimeout(() => {
        socket.disconnect(true)
    }, sessionMaxAge)

    IntervalID[socket.handshake.query.username].push(SessionID)
}

exports.HandleDisconnect = (socket) => {
    socket.on("disconnect", () => {
        
        for(let i = 0; i < IntervalID[socket.handshake.query.username].length; i++){
            clearInterval(IntervalID[socket.handshake.query.username][i])

            if(i ===  IntervalID[socket.handshake.query.username].length - 1){
                IntervalID[socket.handshake.query.username] = []
                console.log("Client disconnect")
            }
        }
    })
}