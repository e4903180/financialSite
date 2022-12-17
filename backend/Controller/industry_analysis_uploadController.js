var multer  = require('multer')
var Today = new Date();
const con = require('../Model/connectMySQL')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '/home/cosbi/桌面/financialData/Industry_analysis')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
})

var multer_object = multer({ storage: storage })

exports.industry_analysis_middleWare = function(req, res, next){
    const upload = multer_object.fields([{ name : 'selectFile' }])
    upload(req, res, function(err){
        if(err){
            console.log(`multer errors:${err}`)
            return res.status(400).send("multer error")
        }
        next()
    })
}

exports.industry_analysis_upload = async function(req, res){
    let filename = "NULL"
    if(req.body.filename !== "") filename = req.body.filename

    let sql = 'INSERT INTO `industry_analysis` (`title`, `date`, `filename`, `username`) VALUES (?, ?, ?, ?)'
    let param = [
                    req.body.title,
                    Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0'),
                    filename,
                    req.session.userName
    ]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send("success");
    } catch (error) {
        return res.status(400).send("error")
    }
};