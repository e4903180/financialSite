const bcrypt = require('bcrypt');
var mysql2 = require('mysql2');

var con = mysql2.createConnection({
  host : "localhost",
  user : "debian-sys-maint",
  password : "CEMj8ptYHraxNxFt",
  database : "financial",
  charset : "utf8"
});

exports.login = async function(req, res){
    var userName = req.body.userName
    var password = req.body.password

    con.connect(function(err){
        if (err) throw err
        con.query("SELECT `password` FROM `user` WHERE `userName` = ?", [userName], function(err, result, field){
            if(bcrypt.compareSync(password, result[0].password)){
                req.session.user = userName;

                res.status(200).send("success");
            }else{
                res.status(400).send("Username or password error");
            };
        });
    });
}