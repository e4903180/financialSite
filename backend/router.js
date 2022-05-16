var express = require('express')
var router = express.Router();
var homeRouter = express.Router();
var userRouter = express.Router();
const User = require('./Controller/userController');

router.use("/user", userRouter)
router.use('/home', homeRouter)

userRouter.post('/login', User.login)
userRouter.post('/register', User.register)

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