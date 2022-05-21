var express = require('express')
var router = express.Router();
var dataRouter = express.Router();
var userRouter = express.Router();
const User = require('./Controller/userController');
const Data = require('./Controller/dataController');

router.use("/user", userRouter)
router.use('/data', dataRouter)

userRouter.post('/login', User.login)
userRouter.post('/register', User.register)
userRouter.get("/logout", User.logout)

dataRouter.use(function (req, res, next) {
    if(!req.session.user){
        req.session.destroy();

        return res.status(400).send('error')
    }
    next()
})


dataRouter.get("/isAuth", function(req, res){
    res.status(200).send('success')
})

dataRouter.get("/first", Data.first)

dataRouter.get("/download", Data.download)

dataRouter.get("/allData", Data.allData)

module.exports = {router};