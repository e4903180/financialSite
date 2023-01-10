const con = require('../Model/connectMySQL')

exports.financial_search = async function(req, res){
    let sql = `SELECT financialData.ID, ticker_list.stock_name, ticker_list.stock_num, financialData.date, financialData.investmentCompany, \
    financialData.filename, financialData.recommend FROM financialData INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID WHERE 1=1`

    if(req.body.stock_num_name !== "") sql += ` AND stock_num='${req.body.stock_num_name.split(" ")[0]}'`
    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${req.body.startDate}' AND '${req.body.endDate}'`
    if(req.body.investmentCompany !== "") sql += ` AND investmentCompany='${req.body.investmentCompany}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.post_board_search = async function(req, res){
    let sql = `SELECT post_board_memo.ID, post_board_memo.username, ticker_list.stock_name, ticker_list.stock_num, post_board_memo.date, \
    post_board_memo.evaluation, post_board_memo.price, post_board_memo.reason, post_board_memo.filename \
    FROM post_board_memo INNER JOIN ticker_list ON post_board_memo.ticker_id=ticker_list.ID WHERE 1=1`

    if(req.body.stock_num_name !== "") sql += ` AND stock_num='${req.body.stock_num_name.split(" ")[0]}'`
    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${req.body.startDate}' AND '${req.body.endDate}'`
    if(req.body.recommend !== "") sql += ` AND evaluation='${req.body.recommend}'`
    if(req.body.provider !== "") sql += ` AND username='${req.body.provider}'`

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        console.log(error)
        return res.status(400).send({})
    }
}

exports.lineMemo_search = async function(req, res){
    let sql = `SELECT lineMemo.ID, lineMemo.date, lineMemo.filename, lineMemo.inputTime, lineMemo.username, ticker_list.stock_name, ticker_list.stock_num\
    FROM lineMemo INNER JOIN ticker_list ON lineMemo.ticker_id=ticker_list.ID WHERE 1=1`

    if(req.body.stock_num_name !== "") sql += ` AND stock_num='${req.body.stock_num_name.split(" ")[0]}'`
    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${req.body.startDate}' AND '${req.body.endDate}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}

exports.calender_search = async function(req, res){
    let sql = `SELECT calender.ID, calender.date, calender.Time, calender.Form, calender.Message, calender.chPDF,\
    calender.enPDF, calender.More_information, calender.Video_address, calender.Attention, ticker_list.stock_name\
    from calender INNER JOIN ticker_list ON calender.ticker_id=ticker_list.ID WHERE 1=1`

    if(req.body.stock_num_name !== "") sql += ` AND stock_num='${req.body.stock_num_name.split(" ")[0]}'`
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