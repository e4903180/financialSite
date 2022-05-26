var mysql2 = require('mysql2');
const { Parser } = require('json2csv');
const iconv = require('iconv-lite');
const fs = require('fs');
const con = require('../Model/connectMySQL')

exports.retrnUsername = async function(req, res){
    return res.status(200).send(req.session.userName)
}

function createCSV(path, data, res){
    const fields = Object.keys(data[0])
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(data);
    var newCsv = iconv.encode(csv, 'BIG5');

    fs.writeFile(path, newCsv, function(err) {
        if (err) throw err;
        res.download(path)
    });
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

    if(req.body.stockName_or_Num == "" && req.body.startDate == "" && req.body.endDate == "" && req.body.investmentCompany == ""){
        let sql = `SELECT * FROM ${req.body.dbTable} LIMIT 100`

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
    
        if(req.body.stockName_or_Num.length !== 0){
            if(pattern.test(req.body.stockName_or_Num[0].stock_num_name)){
                sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
            }else{
                sql += ` AND stockNum='${req.body.stockName_or_Num}'`
            }
        }
    
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

exports.download = function(req, res){
    res.download(req.query.filePath)
};

exports.financialData2csv_download = function(req, res){
    con.query("select * from financialData", function(err, result, field){
        if(err === null){
            createCSV('/home/cosbi/桌面/financialData/financialData.csv', result, res)
        }
    });
};

exports.post_board_memo2csv_download = function(req, res){
    con.query("select * from post_board_memo", function(err, result, field){
        if(err === null){
            createCSV('/home/cosbi/桌面/financialData/post_board_memo.csv', result, res)
        }
    });
};

exports.lineMemo2csv_download = function(req, res){
    con.query("select * from lineMemo", function(err, result, field){
        if(err === null){
            createCSV('/home/cosbi/桌面/financialData/lineMemo.csv', result, res)
        }
    });
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

