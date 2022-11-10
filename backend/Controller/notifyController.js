const con = require('../Model/connectMySQL')
let { PythonShell } = require('python-shell')


exports.notify_all = async function(req, res){
    var userName = req.session.userName

    let sql = `SELECT * FROM notify WHERE username="${userName}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.notify_read = async function(req, res){
    var userName = req.session.userName

    let sql = "SELECT * FROM notify WHERE `username`= " + `"${userName}"` + " AND `read`=1" 

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.notify_handle_read = async function(req, res){
    var userName = req.session.userName
    const time = req.body.time

    let sql = "UPDATE notify SET " + "`read`=1" + ` WHERE notifyTime="${time}" AND username=` + `"${userName}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.notify_handle_unread = async function(req, res){
    var userName = req.session.userName
    const time = req.body.time

    let sql = "UPDATE notify SET " + "`read`=0" + ` WHERE notifyTime="${time}" AND username=` + `"${userName}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.get_notify_quantity = async function(req, res){
    var userName = req.session.userName

    let sql = "SELECT COUNT(*) FROM notify WHERE `username`= " + `"${userName}"` + "AND `read`=0"

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows[0]['COUNT(*)'].toString())
    } catch (error) {
        return res.status(400).send("error")
    }
}