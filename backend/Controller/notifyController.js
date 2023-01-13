const con = require('../Model/connectFinancial')

exports.notify_all = async function(req, res){
    let sql = "SELECT * FROM notify WHERE username=?"
    let param = [req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.notify_read = async function(req, res){
    let sql = "SELECT * FROM notify WHERE username=? AND `read`=?"
    let param = [req.session.userName, 1]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.notify_handle_read = async function(req, res){
    let sql = "UPDATE notify SET `read`=? WHERE notifyTime=? AND username=?"
    let param = [1, req.body.time, req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.notify_handle_unread = async function(req, res){
    let sql = "UPDATE notify SET `read`=? WHERE notifyTime=? AND username=?"
    let param = [0, req.body.time, req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.get_notify_quantity = async function(req, res){
    let sql = "SELECT COUNT(*) FROM notify WHERE username=? AND `read`=?"
    let param = [req.session.userName, 0]

    try {
        const [rows, fields] = await con.promise().query(sql, param);
        return res.status(200).send(rows[0]['COUNT(*)'].toString())
    } catch (error) {
        return res.status(400).send("error")
    }
}