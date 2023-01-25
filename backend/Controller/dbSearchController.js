const con = require('../Model/connectFinancial')

exports.financial_search = async function(req, res){
    let query = `SELECT financialData.*, ticker_list.stock_name, ticker_list.stock_num \
    FROM financialData INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.body.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.body.stock_num_name.split(" ")[0])
    }

    if(req.body.startDate !== "" && req.body.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.body.startDate, req.body.endDate)
    }

    if(req.body.investmentCompany !== ""){
        query += ` AND investmentCompany=?`
        param.push(req.body.investmentCompany)
    }

    query += " ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.post_board_search = async function(req, res){
    let query = `SELECT post_board_memo.*, ticker_list.stock_name, ticker_list.stock_num \
    FROM post_board_memo INNER JOIN ticker_list ON post_board_memo.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.body.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.body.stock_num_name.split(" ")[0])
    }

    if(req.body.startDate !== "" && req.body.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.body.startDate, req.body.endDate)
    }

    if(req.body.recommend !== ""){
        query += ` AND evaluation=?`
        param.push(req.body.recommend)
    }

    if(req.body.provider !== ""){
        query += ` AND username=?`
        param.push(req.body.provider)
    }

    query += " ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}

exports.lineMemo_search = async function(req, res){
    let query = `SELECT lineMemo.*, ticker_list.stock_name, ticker_list.stock_num\
    FROM lineMemo INNER JOIN ticker_list ON lineMemo.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.body.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.body.stock_num_name.split(" ")[0])
    }
    
    if(req.body.startDate !== "" && req.body.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.body.startDate, req.body.endDate)
    }

    query += " ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}

exports.calender_search = async function(req, res){
    let query = `SELECT calender.*, ticker_list.stock_name\
    from calender INNER JOIN ticker_list ON calender.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.body.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.body.stock_num_name.split(" ")[0])
    }
    if(req.body.startDate !== "" && req.body.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.body.startDate, req.body.endDate)
    }

    query += " ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query, param);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.ticker_search = async function(req, res){
    if(req.body.pattern === ""){
        res.status(200).json({})
    }

    let query = `SELECT stock_name FROM ticker_list WHERE stock_name LIKE ?`
    let param = [`%${req.body.pattern}%`]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}

exports.news_search = async function(req, res){
    let query = `SELECT * FROM news WHERE date>=?`
    let param = [req.body.date]

    if(req.body.pattern !== ""){
        query += " AND ?? LIKE ?"
	param.push(req.body.column, `%${req.body.pattern}%`)
    }

    try {
        const [rows, fields] = await con.promise().query(query, param);

        for(let i = 0; i < rows.length; i++){
            rows[i]["title"] = [rows[i]["title"], rows[i]["link"]]
            delete rows[i]["link"]
        }

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}
