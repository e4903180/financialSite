const con = require('../../Model/connectFinancial')
var Today = new Date();
const fs = require('fs');
const { config } = require('../../constant');
const { createCSV } = require('./createCsvController');

exports.lineMemo_upload = async function(req, res){
    /*
        #swagger.tags = ['File upload']
        #swagger.description = 'Upload line memo.',

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Line memo research parameter.',
            required: true,
            type: 'object',
            schema: {
                $date: "2023-04-19",
                $stock_num_name: "2330 台積電",
                $content: "line memo 內容",
            }
        }
    */
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

    query = "INSERT INTO `lineMemo` (`ticker_id`, `date`, `filename`, \
            `inputTime`, `username`) VALUES (?, ?, ?, ?, ?)"
    param = [key, date, filename,
            inputTime, username]

    fs.writeFileSync(config["LINE_MEMO_PATH"] + filename, content);

    try {
        const [rows, fields] = await con.promise().query(query, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    query = "SELECT ticker_list.stock_num, ticker_list.stock_name, lineMemo.date, \
            lineMemo.filename, lineMemo.inputTime, lineMemo.username FROM lineMemo \
            INNER JOIN ticker_list ON lineMemo.ticker_id=ticker_list.ID ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query);
        createCSV(config["CSV_PATH"] + "linememo.csv", rows)

        return res.status(200).send("success");
    } catch (error) {
        return res.status(400).send("error")
    }
};