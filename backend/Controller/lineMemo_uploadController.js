const con = require('../Model/connectFinancial')
var Today = new Date();
const fs = require('fs');
const { config } = require('../constant');

exports.lineMemo_upload = async function(req, res){
    const temp = req.body.stock_num_name.split(" ")
    const stockNum = temp[0]
    const stockName = temp[1]
    const date = req.body.date
    const inputTime = String(Today.getHours()).padStart(2, '0') + ":" + String(Today.getMinutes()).padStart(2, '0') + ":" + String(Today.getSeconds()).padStart(2, '0')
    const filename = stockNum + "_" + stockName + "_" + date + "_" + inputTime + ".txt"
    const username = req.session.userName
    const content = req.body.content

    let query = `SELECT ID FROM ticker_list WHERE stock_num=?`
    let param = [stockNum]
    let key = -1

    try {
        const [rows, fields] = await con.promise().query(query, param);

        key = rows[0]["ID"]
    } catch (error) {
        console.log("error")
    }

    query = "INSERT INTO `lineMemo` (`ticker_id`, `date`, `filename`, `inputTime`, `username`) VALUES (?, ?, ?, ?, ?)"
    param = [
        key,
        date,
        filename,
        inputTime,
        username
    ]

    fs.writeFileSync(config["LINE_MEMO_PATH"] + filename, content);

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success");
    } catch (error) {
        return res.status(400).send("error")
    }
};