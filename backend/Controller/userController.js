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
            if(result.length !== 0){
                if(bcrypt.compareSync(password, result[0].password)){
                    req.session.userName = userName;
    
                    res.status(200).send("success");
                }else{
                    res.status(400).send("Username or password error");
                }
            }else{
                res.status(400).send("Username or password error");
            }
        });
    });
}

exports.logout = async function(req, res){
    try {
        req.session.destroy();
        res.status(200).send("success");
    } catch (error) {
        res.status(400).send("error");
    }
}

exports.register = async function(req, res){
    var name = req.body.name
    var userName = req.body.userName
    var email = req.body.email
    const hash_password = bcrypt.hashSync(req.body.password, 10);

    con.connect(function(err){
        if (err) throw err
        con.query("INSERT INTO `user` (`name`, `userName`, `password`, `superUser`, `email`) VALUES (?, ?, ?, ?, ?)", [ name, userName, hash_password, 0, email ], function(err, result, field){
            if(result){
                res.status(200).send("success");
            }else{
                res.status(400).send("error");
            }
        });
    });
}