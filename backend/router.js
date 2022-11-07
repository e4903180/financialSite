var express = require('express')
var router = express.Router();
var multer  = require('multer')
const rateLimit = require("express-rate-limit")
var dataRouter = express.Router();
var userRouter = express.Router();
const User = require('./Controller/userController');
const Data = require('./Controller/dataController');
const meetingDataUp = require('./Controller/meeting_data_uploadController');
const PostUp = require('./Controller/post_board_uploadController');
const industry_analysisUp = require('./Controller/industry_analysis_uploadController')
const LineMemoUp = require('./Controller/lineMemo_uploadController')
const Download = require('./Controller/downloadController');

const Limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3
});

router.use("/user", userRouter)
router.use('/data', dataRouter)

userRouter.post('/login', User.login)
userRouter.post('/register', User.register)
userRouter.get("/logout", User.logout)

dataRouter.use(function (req, res, next) {
    if(!req.session.userName){
        req.session.destroy();

        return res.status(400).send('Session expired')
    }
    next()
})

dataRouter.get("/isAuth", function(req, res){
    res.status(200).send(req.session.userName)
})

/* Download files router */
dataRouter.get("/download/single_financialData", Download.single_financialData_download)
dataRouter.get("/download/single_post_board_memo", Download.single_post_board_memo_download)
dataRouter.get("/download/single_line_memo", Download.single_line_memo_download)
dataRouter.get("/download/single_meetingData", Download.single_meetingData_memo_download)
dataRouter.get("/download/single_industry_analysis", Download.single_industry_analysis_download)
dataRouter.get("/download/single_twse_chPDF_download", Download.single_twse_chPDF_download)
dataRouter.get("/download/single_twse_enPDF_download", Download.single_twse_enPDF_download)

/* Download table router */
dataRouter.get("/download/financialData", Download.financialData2csv_download)
dataRouter.get("/download/post_board_memo", Download.post_board_memo2csv_download)
dataRouter.get("/download/lineMemo", Download.lineMemo2csv_download)
dataRouter.get("/download/calender", Download.calender2csv_download)

/* Upload files router */
dataRouter.post("/upload/post_board_upload", PostUp.post_board_middleWare, PostUp.post_board_upload)
dataRouter.post("/upload/meeting_data_upload", meetingDataUp.meetingData_middleWare, meetingDataUp.meetingData_upload)
dataRouter.post("/upload/industry_analysis_upload", industry_analysisUp.industry_analysis_middleWare, industry_analysisUp.industry_analysis_upload)
dataRouter.post("/upload/line_memo_upload", LineMemoUp.lineMemo_upload)

dataRouter.get("/newest15", Data.newest15)
dataRouter.get("/allData", Data.allData)
dataRouter.get("/post_board_state", Data.post_board_state)
dataRouter.get("/lineMemo_state", Data.lineMemo_state)
dataRouter.get("/superUser", Data.superUser)
dataRouter.get("/meetingData", Data.meetingData)
dataRouter.get("/industry_analysis", Data.industry_analysis)
dataRouter.get("/userList", Data.userList)
dataRouter.post("/calender", Data.calender)
dataRouter.post("/calenderData", Data.calenderData)

dataRouter.post("/DbFinancialSearch", Data.DbFinancialSearch)
dataRouter.post("/Db_post_board_memoSearch", Data.Db_post_board_memoSearch)
dataRouter.post("/DbLineMemoSearch", Data.DbLineMemoSearch)
dataRouter.post("/DbCalenderSearch", Data.DbCalenderSearch)
dataRouter.post("/post_board_search", Data.post_board_search)
dataRouter.post("/lineMemo_search", Data.lineMemo_search)

dataRouter.post("/pricing", Data.pricingData)
dataRouter.post("/PER_River", Data.PER_river_Data)
dataRouter.post("/support_resistance", Data.support_resistance_data)

dataRouter.get("/get_support_resistance_sub", Data.get_support_resistance_sub)
dataRouter.delete("/cancel_sub", Data.delete_sub)
dataRouter.post("/handle_support_resistance_sub", Data.handle_support_resistance_sub)

dataRouter.get("/notify_all", Data.notify_all)
dataRouter.get("/notify_read", Data.notify_read)

dataRouter.patch("/notify_handle_read", Data.notify_handle_read)
dataRouter.patch("/notify_handle_unread", Data.notify_handle_unread)

/* Realtime price router */
dataRouter.get("/realtime_price", Data.get_realtime_price)

/* Notify quantity router */
dataRouter.get("/get_notify_quantity", Data.get_notify_quantity)

module.exports = {router};