const { escape } = require('mysql2')
const con = require('../Model/connectMySQL')

exports.handle_support_resistance_sub = async function(req, res){
    var userName = req.session.userName
    var stock_num = req.body.stockNum
    var startDate = req.body.startDate
    var endDate = req.body.endDate
    var maLen = req.body.maLen
    var maType = req.body.maType
    var method = req.body.method
    var alertCondition = req.body.alertCondition
    var Today = new Date();

    var year = Today.getFullYear().toString()
    var month = (Today.getMonth() + 1).toString().padStart(2, '0');
    var day = Today.getDate().toString().padStart(2, '0');
    var hour = Today.getHours().toString().padStart(2, '0');
    var min = Today.getMinutes().toString().padStart(2, '0');
    var sec = Today.getSeconds().toString().padStart(2, '0');
    var Time = `${year}-${month}-${day} ${hour}:${min}:${sec}`
    let sql = `SELECT * FROM subscribe WHERE username=? AND endTime=? AND ticker=? AND content=? AND strategy=? AND alertCondition=?`
    let param = [userName, endDate, stock_num, "歷史資料起始日" + startDate + "_" + maLen + maType + "_" + method, "天花板地板線", alertCondition]
    
    try {
        const [rows, fields] = await con.promise().query(sql, param);

        if(rows.length != 0){
            return res.status(401).send("same")
        }
    } catch (error) {
        return res.status(400).send("error")
    }
    
    sql = `INSERT INTO subscribe (username, subTime, endTime, ticker, content, strategy, alertCondition) VALUES (?, ?, ?, ?, ?, ?, ?)`
    param = [userName, Time, endDate, stock_num, "歷史資料起始日" + startDate + "_" + maLen + maType + "_" + method, "天花板地板線", alertCondition]

    try {
        const [rows, fields] = await con.promise().query(sql, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    return res.status(200).send("success")
}

exports.handle_pricing_strategy_sub = async function(req, res){
    var userName = req.session.userName
    var stock_num = req.body.stockNum
    var startYear = req.body.startYear
    var endDate = req.body.endDate
    var alertCondition = req.body.alertCondition
    var Today = new Date();

    var year = Today.getFullYear().toString()
    var month = (Today.getMonth() + 1).toString().padStart(2, '0');
    var day = Today.getDate().toString().padStart(2, '0');
    var hour = Today.getHours().toString().padStart(2, '0');
    var min = Today.getMinutes().toString().padStart(2, '0');
    var sec = Today.getSeconds().toString().padStart(2, '0');
    var Time = `${year}-${month}-${day} ${hour}:${min}:${sec}`

    let sql = `SELECT * FROM subscribe WHERE username=? AND endTime=? AND ticker=? AND content=? AND strategy=? AND alertCondition=?`
    let param = [userName, endDate, stock_num, "歷史幾年資料" + startYear, "股票定價策略", alertCondition]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        if(rows.length != 0){
            return res.status(401).send("same")
        }
    } catch (error) {
        return res.status(400).send("error")
    }
    
    sql = `INSERT INTO subscribe (username, subTime, endTime, ticker, content, strategy, alertCondition) VALUES (?, ?, ?, ?, ?, ?, ?)`
    param = [userName, Time, endDate, stock_num, "歷史幾年資料" + startYear, "股票定價策略", alertCondition]
    
    try {
        const [rows, fields] = await con.promise().query(sql, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    return res.status(200).send("success")
}

exports.handle_per_river_sub = async function(req, res){
    var userName = req.session.userName
    var stock_num = req.body.stockNum
    var endDate = req.body.endDate
    var alertCondition = req.body.alertCondition
    var Today = new Date();

    var year = Today.getFullYear().toString()
    var month = (Today.getMonth() + 1).toString().padStart(2, '0');
    var day = Today.getDate().toString().padStart(2, '0');
    var hour = Today.getHours().toString().padStart(2, '0');
    var min = Today.getMinutes().toString().padStart(2, '0');
    var sec = Today.getSeconds().toString().padStart(2, '0');
    var Time = `${year}-${month}-${day} ${hour}:${min}:${sec}`

    let sql = `SELECT * FROM subscribe WHERE username=? AND endTime=? AND ticker=? AND strategy=? AND alertCondition=?`
    let param = [userName, endDate, stock_num, "本益比河流圖", alertCondition]
    
    try {
        const [rows, fields] = await con.promise().query(sql, param);

        if(rows.length != 0){
            return res.status(401).send("same")
        }
    } catch (error) {
        return res.status(400).send("error")
    }
    
    sql = `INSERT INTO subscribe (username, subTime, endTime, ticker, content, strategy, alertCondition) VALUES (?, ?, ?, ?, ?, ?, ?)`
    param = [userName, Time, endDate, stock_num, "", "本益比河流圖", alertCondition]

    try {
        const [rows, fields] = await con.promise().query(sql, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    return res.status(200).send("success")
}

exports.get_sub = async function(req, res){
    let sql = `SELECT * FROM subscribe WHERE username=?`
    let param = [req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(sql, param);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.delete_sub = async function(req, res){
    let sql = `DELETE FROM subscribe WHERE username = ? AND subTime = ?`
    let param = [req.session.userName, req.body.subTime]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send(rows)
    } catch (error) {

        return res.status(400).send("error")
    }
}

exports.get_user_notify_type = async function(req, res){
    let sql = `SELECT lineNotify, emailNotify FROM user WHERE userName=?`
    let param = [req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send(rows)
    } catch (error) {

        return res.status(400).send("error")
    }
}

exports.update_user_lineNotify_type = async function(req, res){
    let sql = `UPDATE user SET lineNotify=? WHERE userName=?`
    let param = [req.body.switch, req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send("success")
    } catch (error) {

        return res.status(400).send("error")
    }
}

exports.update_user_emailNotify_type = async function(req, res){
    let sql = `UPDATE user SET emailNotify=? WHERE userName=?`
    let param = [req.body.switch, req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send("success")
    } catch (error) {

        return res.status(400).send("error")
    }
} 