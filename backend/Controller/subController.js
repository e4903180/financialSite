const con = require('../Model/connectMySQL')
let { PythonShell } = require('python-shell')

exports.handle_support_resistance_sub = async function(req, res){
    var userName = req.session.userName
    var stock_num = req.body.stockNum
    var startDate = req.body.startDate
    var endDate = req.body.endDate
    var maLen = req.body.maLen
    var maType = req.body.maType
    var method = req.body.method
    var subType = req.body.subType
    var Today = new Date();

    var year = Today.getFullYear().toString()
    var month = (Today.getMonth() + 1).toString().padStart(2, '0');
    var day = Today.getDate().toString().padStart(2, '0');
    var hours = Today.getHours().toString().padStart(2, '0');
    var minutes = Today.getMinutes().toString().padStart(2, '0');
    var seconds = Today.getSeconds().toString().padStart(2, '0');
    var Time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds

    let sql = `SELECT * FROM subscribe WHERE username = "${userName}" AND endTime = "${endDate}" AND ticker = "${stock_num}" AND subType = "${subType}" AND content = "天花板地板線_歷史資料起始日${startDate}_${maLen}${maType}_方法${method[6]}"`
    try {
        const [rows, fields] = await con.promise().query(sql);

        if(rows.length != 0){
            return res.status(401).send("same")
        }
    } catch (error) {
        return res.status(400).send("error")
    }

    sql = `SELECT * FROM user_sub WHERE username = "${userName}"`
    try {
        const [rows, fields] = await con.promise().query(sql);

        if(rows.length == 0){
            sql = `INSERT INTO user_sub (username, quantity) VALUES ("${userName}", 1)`
        }else{
            sql = `UPDATE user_sub SET quantity = ${rows[0]["quantity"] + 1} WHERE username = "${userName}"`
        }

        const [rows1, fields1] = await con.promise().query(sql);
    } catch (error) {
        return res.status(400).send("error")
    }

    sql = `INSERT INTO subscribe (username, subTime, endTime, ticker, subType, content) VALUES ("${userName}", "${Time}", "${endDate}", "${stock_num}", "${subType}", "天花板地板線_歷史資料起始日${startDate}_${maLen}${maType}_方法${method[6]}")`
    try {
        const [rows, fields] = await con.promise().query(sql);
    } catch (error) {
        return res.status(400).send("error")
    }

    res.status(200).send("success")
}


exports.get_support_resistance_sub = async function(req, res){
    var userName = req.session.userName

    let sql = `SELECT * FROM subscribe`
    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.delete_sub = async function(req, res){
    var userName = req.session.userName
    var subTime = req.body.subTime

    let sql = `DELETE FROM subscribe WHERE username = "${userName}" AND subTime = "${subTime}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        sql = `SELECT * FROM user_sub WHERE username = "${userName}"`
        const [rows1, fields1] = await con.promise().query(sql);

        if(rows1[0]["quantity"] == 1){
            sql = `DELETE FROM user_sub WHERE username = "${userName}"`
        }else{
            sql = `UPDATE user_sub SET quantity = ${rows1[0]["quantity"] - 1} WHERE username = "${userName}"`
        }

        const [rows2, fields2] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {

        return res.status(400).send("error")
    }
}