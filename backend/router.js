var express = require('express')
var router = express.Router();
var multer  = require('multer')
var dataRouter = express.Router();
var userRouter = express.Router();
const User = require('./Controller/userController');
const Data = require('./Controller/dataController');
const PostUp = require('./Controller/post_board_uploadController');
const Download = require('./Controller/downloadController');

router.use("/user", userRouter)
router.use('/data', dataRouter)

userRouter.post('/login', User.login)
userRouter.post('/register', User.register)
userRouter.get("/logout", User.logout)

dataRouter.use(function (req, res, next) {
    if(!req.session.userName){
        req.session.destroy();

        return res.status(400).send('error')
    }
    next()
})

dataRouter.get("/isAuth", function(req, res){
    res.status(200).send('success')
})

dataRouter.get("/download/single_financialData", Download.single_financialData_download)
dataRouter.get("/download/single_post_board_memo", Download.single_post_board_memo_download)
dataRouter.get("/download/single_line_memo", Download.single_line_memo_download)

dataRouter.get("/download/financialData", Download.financialData2csv_download)
dataRouter.get("/download/post_board_memo", Download.post_board_memo2csv_download)
dataRouter.get("/download/lineMemo", Download.lineMemo2csv_download)

dataRouter.post("/upload/post_board_upload", PostUp.post_board_middleWare, PostUp.post_board_upload)

dataRouter.get("/newest15", Data.newest15)
dataRouter.get("/allData", Data.allData)
dataRouter.get("/autoCom", Data.autoCom)
dataRouter.get("/username", Data.retrnUsername)
dataRouter.get("/post_board_state", Data.post_board_state)

dataRouter.post("/dbsearch", Data.dbsearch)
dataRouter.post("/post_board_search", Data.post_board_search)

module.exports = {router};