var multer  = require('multer')
const fs = require('fs')
const con = require('../../Model/connectFinancial')
const { config } = require('../../constant')
const { createCSV } = require('./createCsvController')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let temp = req.body.ticker.split(" ")
        let dir = `${config["FINANCIALDATA_PATH"]}${temp[0]}`

        if(!fs.existsSync(dir)) fs.mkdirSync(dir)

        callBack(null, dir)
    },
    filename: (req, file, callBack) => {
        let temp = req.body.ticker.split(" ")

        callBack(null, `${temp[0]}_${temp[1]}_${req.body.date.replace("-", "")}_${req.body.provider}_${req.body.evaluate}_NULL.pdf`)
    }
})

var multer_object = multer({ storage: storage })

exports.self_upload_middleWare = function(req, res, next){
    const upload = multer_object.fields([{ name : 'selectFile' }])

    upload(req, res, function(err){
        if(err){
            console.log(`multer errors:${err}`)
            return res.status(400).send("multer error")
        }
        next()
    })
}

exports.self_upload = async function(req, res){
    let temp = req.body.ticker.split(" ")
    let key = -1

    let query = "SELECT ID FROM ticker_list WHERE stock_num=?"
    let param = [temp[0]]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        key = rows[0]["ID"]
    } catch (error) {
        console.log("error")
    }

    query = "INSERT INTO `financialData` (`ticker_id`, `date`, `investmentCompany`, `filename`, \
            `recommend`, remark) VALUES (?, ?, ?, ?, ?, ?)"
    param = [key, req.body.date, req.body.provider,
            `${temp[0]}_${temp[1]}_${req.body.date.replace("-", "")}_${req.body.provider}_${req.body.evaluate}_NULL.pdf`,
            req.body.evaluate, "NULL"]

    try {
        const [rows, fields] = await con.promise().query(query, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    query = "SELECT ticker_list.stock_num, ticker_list.stock_name, financialData.date, \
            financialData.investmentComapany, financialData.filename, financialData.recommend, \
            financialData.remark INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID \
            ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query);
        createCSV(config["CSV_PATH"] + "financialData.csv", rows)

        return res.status(200).send("success");
    } catch (error) {
        return res.status(400).send("error")
    }
};