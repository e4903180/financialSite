const { sessionMaxAge } = require('../constant');
const con = require('../Model/connectMySQL');
const { HandleNotifyQuantityTimeInterval, HandleRealTimePriceInterval, HandleSubListInterval } = require('./WebSocketConstant');
let { PythonShell } = require('python-shell')

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

exports.HandleSubList = (socket) => {
    const SubListID = setInterval(async () => {
        let sql = "SELECT * FROM subscribe WHERE `username`= " + `"${socket.handshake.query.username}"`

        try {
            const [rows, fields] = await con.promise().query(sql);

            socket.emit("REGISTER_SUBSCRIBE_LIST", rows)
        } catch (error) {
            console.log(error)
        }
    }, HandleSubListInterval)
    IntervalID[socket.handshake.query.username].push(SubListID)
}

exports.HandleSessionExpired = (socket) => {
    const SessionID = setTimeout(() => {
        socket.disconnect(true)
    }, sessionMaxAge)

    IntervalID[socket.handshake.query.username].push(SessionID)
}

exports.HandleRealTimePrice = (socket) => {
    socket.on("REQUEST_REAL_TIME_PRICE", (arg) => {
        arg["args"] = arg["args"].toString()

        const RealTimePriceID = setInterval(async () => {
            const result = await new Promise((resolve, reject) => {
                PythonShell.run('/home/cosbi/financialSite/backend/PythonTool/RealTimePrice.py', arg, (err, data) => {
                    if (err) reject(err)
                    
                    const parsedString = JSON.parse(data)
                    return resolve(parsedString);
                })
            })
            socket.emit("REGISTER_REAL_TIME_PRICE", result)
        }, HandleRealTimePriceInterval)

        IntervalID[socket.handshake.query.username].push(RealTimePriceID)
    })
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