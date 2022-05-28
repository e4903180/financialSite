const con = require('../Model/connectMySQL')

exports.retrnUsername = async function(req, res){
    return res.status(200).send(req.session.userName)
}

exports.newest15 = async function(req, res){
    con.query("SELECT * FROM financialData ORDER BY `date` DESC Limit 15", function(err, result, field){
        if(err === null){
            return res.status(200).json(result)
        }else{
            return res.status(400).send("error")
        }
    });
};

exports.allData = async function(req, res){
    con.query("select count( * ) as dataQuantity from financialData; select max(date) as newestDate from financialData;select count( * ) as dataQuantity from post_board_memo;select max(date) as newestDate from post_board_memo;select count( * ) as dataQuantity from lineMemo;select max(date) as newestDate from lineMemo;", function(err, result, field){
        if(err === null){
            return res.status(200).json([Object.assign({ "dbName" : "個股研究資料" }, result[0][0], result[1][0], {"downloadUrl" : "http://140.116.214.154:3000/api/data/download/financialData"}),
                                        Object.assign({ "dbName" : "個股推薦" }, result[2][0], result[3][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/post_board_memo" }),
                                        Object.assign({ "dbName" : "Line memo" }, result[4][0], result[5][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/lineMemo" })])
        }else{
            return res.status(400).send("error")
        }
    });
};

exports.dbsearch = async function(req, res){
    if(req.body.dbTable == "") return res.status(400).json({})

    if(req.body.stockName_or_Num.length == 0 && req.body.startDate == "" && req.body.endDate == "" && req.body.investmentCompany == ""){
        let sql = `SELECT * FROM ${req.body.dbTable}`

        con.query(sql,function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).send("error")
            }
        });
    }else{
        var pattern = new RegExp(/\d{4}/)
        let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`
    
        if(req.body.stockName_or_Num.length !== 0) sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
    
        if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
        if(req.body.investmentCompany !== "") sql += ` AND investmentCompany='${req.body.investmentCompany}'`
    
        con.query(sql,function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).json({})
            }
        });
    }
};

exports.autoCom = function(req, res){
    con.query("select * from autocompletedSearch", function(err, result, field){
        if(err === null){
            return res.status(200).json(result)
        }else{
            return res.status(400).send("error")
        }
    });
};

exports.post_board_state = function(req, res){
    con.query("select count( * ) as dataQuantity from post_board_memo;select max(date) as newestDate from post_board_memo;", function(err, result, field){
        if(err === null){
            return res.status(200).json(Object.assign(result[0][0], result[1][0]))
        }else{
            return res.status(400).send("error")
        }
    })
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

