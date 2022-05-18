var mysql2 = require('mysql2');

var con = mysql2.createConnection({
  host : "localhost",
  user : "debian-sys-maint",
  password : "CEMj8ptYHraxNxFt",
  database : "financial",
  charset : "utf8"
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

exports.download = function(req, res){
    res.download(req.query.filePath)
};