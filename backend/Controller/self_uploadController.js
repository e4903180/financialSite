var multer  = require('multer')
const fs = require('fs')
var Today = new Date();
const con = require('../Model/connectMySQL')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let temp = req.body.ticker.split(" ")
        let dir = `/home/cosbi/桌面/financialData/gmailData/data/${temp[0]}`

        if(!fs.existsSync(dir)) fs.mkdirSync(dir)

        callBack(null, `/home/cosbi/桌面/financialData/gmailData/data/${temp[0]}`)
    },
    filename: (req, file, callBack) => {
        let temp = req.body.ticker.split(" ")

        callBack(null, `${temp[0]}-${temp[1]}-${req.body.provider}-${req.body.evaluate}-${req.body.filename}`)
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

    let sql = "INSERT INTO `financialData` (`stockNum`, `stockName`, `date`, `investmentCompany`, `filename`, `recommend`) VALUES (?, ?, ?, ?, ?, ?)"
    let param = [
        temp[0],
        temp[1],
        req.body.date,
        req.body.provider,
        `${temp[0]}-${temp[1]}-${req.body.provider}-${req.body.evaluate}-${req.body.filename}`,
        req.body.evaluate
    ]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send("success");
    } catch (error) {
        return res.status(400).send("error")
    }
};