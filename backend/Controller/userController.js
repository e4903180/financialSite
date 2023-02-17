const bcrypt = require('bcrypt');
const con = require('../Model/connectFinancial')

exports.login = async function(req, res){
    var userName = req.body.userName
    var password = req.body.password
    let query = `SELECT password FROM user WHERE userName=?`
    let param = [userName]

    try {
        const [row, field] = await con.promise().query(query, param)

        if(bcrypt.compareSync(password, row[0].password)){
            req.session.userName = userName;
            let time = new Date()
            console.log("Login time: ", time.toString())
            return res.status(200).send("success");
        }else{
            return res.status(400).send("Username or password error");
        }
    } catch (error) {
        return res.status(400).send("error");
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

    let query = `SELECT * FROM user WHERE userName=?`
    let param = [userName]
    try {
        const [rows, fields] = await con.promise().query(query, param);

        if(rows.length !== 0){
            return res.status(401).send("Username duplicate please try another")
        }
    } catch (error) {
        return res.status(400).send("error")
    }

    query = `INSERT INTO user (name, userName, password, superUser, email) VALUES (?, ?, ?, ?, ?)`
    param = [name, userName, hash_password, 0, email]

    try {
        const [rows, fields] = await con.promise().query(query, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    res.status(200).send("success")
}