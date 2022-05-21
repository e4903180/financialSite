var mysql2 = require('mysql2');

var con = mysql2.createConnection({
  host : "localhost",
  user : "debian-sys-maint",
  password : "CEMj8ptYHraxNxFt",
  database : "financial",
  charset : "utf8",
  multipleStatements : true
});

exports.first = async function(req, res){
    con.connect(function(err){
        if (err) throw err
        con.query("SELECT * FROM `financialData` Limit 15", function(err, result, field){
            if(result){
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
        con.query("select count( * ) as dataQuantity from financialData; select max(date) as newestDate from financialData; select * from financialData;", function(err, result, field){
            if(result != undefined){
                return res.status(200).json([Object.assign({ "dbName" : "個股研究資料" }, result[0][0], result[1][0], {"allData" : result[2]})])
            }else{
                return res.status(400).send("error")
            }
        });
    });
};

exports.download = function(req, res){
    res.download(req.query.filePath)
};