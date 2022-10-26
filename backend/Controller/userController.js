const bcrypt = require('bcrypt');
const con = require('../Model/connectMySQL')

exports.login = async function(req, res){
    var userName = req.body.userName
    var password = req.body.password
    let sql = `SELECT password FROM user WHERE userName = "${userName}"`

    try {
        const [row, field] = await con.promise().query(sql)

        if(bcrypt.compareSync(password, row[0].password)){
            req.session.userName = userName;
            
            res.status(200).send("success");
        }else{
            res.status(400).send("Username or password error");
        }
    } catch (error) {
        res.status(400).send("error");
    }
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

    let sql = `SELECT * FROM user WHERE userName="${userName}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        if(rows.length !== 0){
            return res.status(401).send("Username duplicate please try another")
        }
    } catch (error) {
        return res.status(400).send("error")
    }

    try {
        sql = `INSERT INTO user (name, userName, password, superUser, email) VALUES ("${name}", "${userName}", "${hash_password}", 0, "${email}")`
        const [rows, fields] = await con.promise().query(sql);
    } catch (error) {
        return res.status(400).send("error")
    }

    res.status(200).send("success")
}