var mysql2 = require('mysql2');
var csvwriter = require('csv-writer')
  
var createCsvWriter = csvwriter.createObjectCsvWriter

var con = mysql2.createConnection({
  host : "localhost",
  user : "debian-sys-maint",
  password : "CEMj8ptYHraxNxFt",
  database : "financial",
  charset : "utf8",
  multipleStatements : true
});

exports.newest15 = async function(req, res){
    con.connect(function(err){
        if (err) throw err
        con.query("SELECT * FROM financialData ORDER BY `date` DESC Limit 15", function(err, result, field){
            if(result != undefined){
                return res.status(200).json(result)
            }else{
                return res.status(400).send("error")
            }
        });
    });
};

exports.allData = async function(req, res){
    con.connect(function(err){
        if (err) throw err
        con.query("select count( * ) as dataQuantity from financialData; select max(date) as newestDate from financialData;select count( * ) as dataQuantity from post_board_memo;select max(date) as newestDate from post_board_memo;select count( * ) as dataQuantity from lineMemo;select max(date) as newestDate from lineMemo;", function(err, result, field){
            if(result != undefined){
                return res.status(200).json([Object.assign({ "dbName" : "個股研究資料" }, result[0][0], result[1][0], {"downloadUrl" : "http://140.116.214.154:3000/api/data/download/financialData"}),
                                            Object.assign({ "dbName" : "個股推薦" }, result[2][0], result[3][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/post_board_memo" }),
                                            Object.assign({ "dbName" : "Line memo" }, result[4][0], result[5][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/lineMemo" })])
            }else{
                return res.status(400).send("error")
            }
        });
    });
};

exports.dbsearch = async function(req, res){
    if(req.body.dbTable == "") return res.status(400)

    if(req.body.stockName_or_Num == "" && req.body.startDate == "" && req.body.endDate == "" && req.body.investmentCompany == ""){
        let sql = `SELECT * FROM ${req.body.dbTable} LIMIT 100`

        con.connect(function(err){
            if (err) throw err
            con.query(sql,function(err, result, field){
                if(result != undefined){
                    return res.status(200).json(result)
                }else{
                    return res.status(400).send("error")
                }
            });
        });
    }else{
        var pattern = new RegExp(/\d{4}/)
        let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`
    
        if(req.body.stockName_or_Num.length !== 0){
            if(pattern.test(req.body.stockName_or_Num[0])){
                sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0])[0]}'`
            }else{
                sql += ` AND stockNum='${req.body.stockName_or_Num}'`
            }
        }
    
        if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
        if(req.body.investmentCompany !== "") sql += ` AND investmentCompany='${req.body.investmentCompany}'`
    
        con.connect(function(err){
            if (err) throw err
            con.query(sql,function(err, result, field){
                if(result != undefined){
                    return res.status(200).json(result)
                }else{
                    return res.status(400).send("error")
                }
            });
        });
    }
};

exports.download = function(req, res){
    res.download(req.query.filePath)
};

exports.financialData2csv_download = function(req, res){
    con.query("select * from financialData", function(err, result, field){
        if(result !== undefined){
            const csvWriter = createCsvWriter({
  
                path: '/home/cosbi/桌面/financialData.csv',
                header: [
                    {id: 'stockNum', title: '股票代號'},
                    {id: 'stockName', title: '股票名稱'},
                    {id: 'date', title: '日期'},
                    {id: 'investmentCompany', title: '投顧公司'},
                    {id: 'filePath', title: '檔案路徑'},
                    {id: 'recommend', title: '推薦'},
                ]
            });

            csvWriter
                .writeRecords(result)
                .then(()=> res.download("/home/cosbi/桌面/financialData.csv"));
        }
    });
};

exports.post_board_memo2csv_download = function(req, res){
    con.query("select * from post_board_memo", function(err, result, field){
        if(result !== undefined){
            const csvWriter = createCsvWriter({

                path: '/home/cosbi/桌面/post_board_memo.csv',
                header: [
                    {id: 'date', title: '日期'},
                    {id: 'username', title: 'Username'},
                    {id: 'stockName', title: '股票名稱'},
                    {id: 'stockNum', title: '股票代號'},
                    {id: 'evaluation', title: '評價'},
                    {id: 'price', title: '目標價'},
                    {id: 'reason', title: '原因'},
                    {id: 'filePath', title: '檔案路徑'},
                ]
            });

            csvWriter
                .writeRecords(result)
                .then(()=> res.download("/home/cosbi/桌面/post_board_memo.csv"));
        }
    });
};

exports.lineMemo2csv_download = function(req, res){
    con.query("select * from lineMemo", function(err, result, field){
        if(result !== undefined){
            const csvWriter = createCsvWriter({

                path: '/home/cosbi/桌面/lineMemo.csv',
                header: [
                    {id: 'stockNum', title: '股票代號'},
                    {id: 'stockName', title: '股票名稱'},
                    {id: 'date', title: '日期'},
                    {id: 'filePath', title: '檔案路徑'},
                    {id: 'inputTime', title: '輸入時間'},
                    {id: 'username', title: 'Username'},
                ]
            });

            csvWriter
                .writeRecords(result)
                .then(()=> res.download("/home/cosbi/桌面/lineMemo.csv"));
        }
    });
};

exports.autoCom = function(req, res){
    con.query("select * from autocompletedSearch", function(err, result, field){
        if(result != undefined){
            return res.status(200).json(result)
        }else{
            return res.status(400).send("error")
        }
    });
};

