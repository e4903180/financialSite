const con = require('../Model/connectMySQL')

exports.choose_ticker = async function(req, res){
    let sql = `SELECT ticker FROM ticker_list WHERE class="${req.body.class}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        res.status(200).send(rows)
    } catch (error) {

        res.status(400).send("error")
    }
}