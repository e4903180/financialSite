const con = require('../Model/connectMySQL')

exports.financial_search = async function(req, res){
    let sql = `SELECT * FROM financialData WHERE 1=1`

    if(req.body.stock_num_name !== "") sql += ` AND stockNum='${req.body.stock_num_name.split(" ")[0]}'`
    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
    if(req.body.investmentCompany !== "") sql += ` AND investmentCompany='${req.body.investmentCompany}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.post_board_search = async function(req, res){
    let sql = `SELECT * FROM post_board_memo WHERE 1=1`

    if(req.body.stock_num_name !== "") sql += ` AND stockNum='${req.body.stock_num_name.split(" ")[0]}'`
    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
    if(req.body.recommend !== "") sql += ` AND evaluation='${req.body.recommend}'`
    if(req.body.provider !== "") sql += ` AND username='${req.body.provider}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}

exports.lineMemo_search = async function(req, res){
    let sql = `SELECT * FROM lineMemo WHERE 1=1`

    if(req.body.stock_num_name !== "") sql += ` AND stockNum='${req.body.stock_num_name.split(" ")[0]}'`
    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}

exports.calender_search = async function(req, res){
    let sql = `SELECT * FROM calender WHERE 1=1`

    if(req.body.stock_num_name !== "") sql += ` AND stockNum='${req.body.stock_num_name.split(" ")[0]}'`
    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate)}' AND '${(req.body.endDate)}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.ticker_search = async function(req, res){
    if(req.body.pattern === ""){
        res.status(200).json({})
    }

    let sql = `SELECT stock_name FROM ticker_list WHERE stock_name LIKE "%${req.body.pattern}%"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}