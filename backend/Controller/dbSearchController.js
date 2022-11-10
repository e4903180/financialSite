const con = require('../Model/connectMySQL')
let { PythonShell } = require('python-shell')

exports.DbFinancialSearch = async function(req, res){
    let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`

    if(req.body.stockName_or_Num.length !== 0){
        var pattern = new RegExp(/\d{4}/)
        sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
    }

    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
    if(req.body.investmentCompany !== "") sql += ` AND investmentCompany='${req.body.investmentCompany}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.Db_post_board_memoSearch = async function(req, res){
    let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`

    if(req.body.stockName_or_Num.length !== 0){
        var pattern = new RegExp(/\d{4}/)
        sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
    }

    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.DbLineMemoSearch = async function(req, res){
    let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`

    if(req.body.stockName_or_Num.length !== 0){
        var pattern = new RegExp(/\d{4}/)
        sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
    }

    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.DbCalenderSearch = async function(req, res){
    let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`

    if(req.body.stockName_or_Num.length !== 0){
        var pattern = new RegExp(/\d{4}/)
        sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
    }

    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate)}' AND '${(req.body.endDate)}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.post_board_search = function(req, res){
    if(req.body.stockName_or_Num == "" && req.body.startDate == "" && req.body.endDate == "" && req.body.recommend == "" && req.body.provider == ""){
        let sql = `SELECT * FROM post_board_memo`

        con.query(sql,function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).send("error")
            }
        });
    }else{
        var pattern = new RegExp(/\d{4}/)
        let sql = `SELECT * FROM post_board_memo WHERE 1=1`

        if(req.body.stockName_or_Num.length !== 0)sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
        if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
        if(req.body.recommend !== "") sql += ` AND evaluation='${req.body.recommend}'`
        if(req.body.provider !== "") sql += ` AND username='${req.body.provider}'`
    
        con.query(sql,function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).json({})
            }
        });

    }
}

exports.lineMemo_search = function(req, res){
    if(req.body.stock_num_name.length == 0 && req.body.startDate == "" && req.body.endDate == "" && req.body.recommend == "" && req.body.provider == ""){
        let sql = `SELECT * FROM lineMemo`

        con.query(sql, function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).send("error")
            }
        });
    }else{
        let sql = `SELECT * FROM lineMemo WHERE 1=1`

        if(req.body.stock_num_name.length != 0)sql += ` AND stockNum='${req.body.stock_num_name[0].stock_num_name.slice(0, 4)}'`
        if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
    
        con.query(sql, function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).json({})
            }
        });

    }
}