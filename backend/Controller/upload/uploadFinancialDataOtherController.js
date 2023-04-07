var multer  = require('multer')
const fs = require('fs')
const con = require('../../Model/connectFinancial')
const { config } = require('../../constant')
const { createCSV } = require('./createCsvController')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let dir = config["FINANCIALDATAOTHER_PATH"]

        if(!fs.existsSync(dir)) fs.mkdirSync(dir)

        callBack(null, dir)
    },
    filename: (req, file, callBack) => {
        callBack(null, req.body.filename)
    }
})

var multer_object = multer({ storage: storage })

exports.other_upload_middleWare = function(req, res, next){
    const upload = multer_object.fields([{ name : 'selectFile' }])

    upload(req, res, function(err){
        if(err){
            console.log(`multer errors:${err}`)
            return res.status(400).send("multer error")
        }
        next()
    })
}

exports.other_upload = async function(req, res){
    let query = "INSERT INTO `financialDataOther` (`date`, `title`, `investmentCompany`, \
                `filename`) VALUES (?, ?, ?, ?)"
    let param = [req.body.date, req.body.title,
                req.body.investmentCompany, req.body.filename]

    try {
        const [rows, fields] = await con.promise().query(query, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    query = "SELECT * FROM financialDataOther ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query);
        createCSV(config["CSV_PATH"] + "financialDataOther.csv", rows)

        return res.status(200).send("success");
    } catch (error) {
        return res.status(400).send("error")
    }
};