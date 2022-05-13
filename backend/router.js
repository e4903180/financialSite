var express = require('express')
var router = express.Router();
var homeRouter = express.Router();
const User = require('./Controller/userController');

router.post('/login', User.login)
router.use('/homePage', homeRouter)

homeRouter.use(function (req, res, next) {
    if(req.session.user){
        console.log("session is valid")
        res.status(200).send('success')
    }else{
        console.log("session expired")
        req.session.destroy();

        res.status(400).send('error')
        next()
    }
})

module.exports = {router};