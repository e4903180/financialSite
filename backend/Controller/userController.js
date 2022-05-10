const bcrypt = require('bcrypt');

exports.login = async function(req, res){
    var userName = req.body.userName
    var password = req.body.password

    //encrypt the password
    const hash_password = bcrypt.hashSync(password, 10);
    console.log(hash_password)

    res.status(200).send('success')
}