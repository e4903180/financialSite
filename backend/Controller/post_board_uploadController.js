var multer  = require('multer');
const { config } = require('../constant');
var Today = new Date();
const con = require('../Model/connectFinancial')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, config["POST_BOARD_MEMO_PATH"])
    },
    filename: (req, file, callBack) => {
        callBack(null, Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0') + "_" + file.originalname)
    }
})

var multer_object = multer({ storage: storage })

exports.post_board_middleWare = function(req, res, next){
    const upload = multer_object.fields([{ name : 'selectFile' }])
    upload(req, res, function(err){
        if(err){
            console.log(`multer errors:${err}`)
            return res.status(400).send("multer error")
        }
        next()
    })
}

exports.post_board_upload = async function(req, res){
    const temp = req.body.stock_num_name.split(" ")
    let filename = "NULL"
    const date = req.body.date
    const username = req.session.userName
    const stockNum = temp[0]
    const evaluation = req.body.recommend
    const price = req.body.price
    const reason = req.body.reason
    if(req.body.filename !== "") filename = date + "_" + req.body.filename

    let query = `SELECT ID FROM ticker_list WHERE stock_num=?`
    let param = [stockNum]
    let key = -1

    try {
        const [rows, fields] = await con.promise().query(query, param);

        key = rows[0]["ID"]
    } catch (error) {
        console.log("error")
    }
    
    query = "INSERT INTO `post_board_memo` (`ticker_id`, `username`, `date`, `evaluation`, `price`, `reason`, `filename`) VALUES (?, ?, ?, ?, ?, ?, ?)"
    param = [
        key,
        username,
        date,
        evaluation,
        price,
        reason,
        filename
    ]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success");
    } catch (error) {
        return res.status(400).send("error")
    }
};