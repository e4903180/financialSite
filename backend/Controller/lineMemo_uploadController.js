const con = require('../Model/connectMySQL')
var Today = new Date();
const fs = require('fs');

exports.lineMemo_upload = async function(req, res){
    const temp = req.body.stock_num_name.split(" ")
    const stockName = temp[1]
    const stockNum = temp[0]
    const date = req.body.date
    const inputTime = String(Today.getHours()).padStart(2, '0') + ":" + String(Today.getMinutes()).padStart(2, '0') + ":" + String(Today.getSeconds()).padStart(2, '0')
    const filename = stockNum + "_" + stockName + "_" + date + "_" + inputTime + ".txt"
    const username = req.session.userName
    const content = req.body.content

    let sql = "INSERT INTO `lineMemo` (`stockNum`, `stockName`, `date`, `filename`, `inputTime`, `username`) VALUES (?, ?, ?, ?, ?, ?)"
    let param = [
        stockNum,
        stockName,
        date,
        filename,
        inputTime,
        username
    ]

    fs.writeFileSync("/home/cosbi/桌面/financialData/lineMemo_data/" + filename, content);

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send("success");
    } catch (error) {
        return res.status(400).send("error")
    }
};