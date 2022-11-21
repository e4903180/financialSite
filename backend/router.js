var express = require('express')
var router = express.Router();
var multer  = require('multer')
const rateLimit = require("express-rate-limit")
var dataRouter = express.Router();
var userRouter = express.Router();
const User = require('./Controller/userController');
const Data = require('./Controller/dataController');
const Notify = require('./Controller/notifyController');
const Sub = require('./Controller/subController');
const dbSearch = require('./Controller/dbSearchController');
const ChooseTicker = require('./Controller/chooseTickerController');
const StockTool = require('./Controller/StockToolContrtoller');
const meetingDataUp = require('./Controller/meeting_data_uploadController');
const PostUp = require('./Controller/post_board_uploadController');
const industry_analysisUp = require('./Controller/industry_analysis_uploadController')
const LineMemoUp = require('./Controller/lineMemo_uploadController');
const SelfUp = require('./Controller/self_uploadController');
const Download = require('./Controller/downloadController');

const Limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3
});

router.use("/user", userRouter)
router.use('/data', dataRouter)

/* User router */
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
dataRouter.post("/upload/self_upload", SelfUp.self_upload_middleWare, SelfUp.self_upload)

dataRouter.get("/newest15", Data.newest15)
dataRouter.get("/allData", Data.allData)
dataRouter.get("/post_board_state", Data.post_board_state)
dataRouter.get("/lineMemo_state", Data.lineMemo_state)
dataRouter.get("/superUser", Data.superUser)
dataRouter.get("/meetingData", Data.meetingData)
dataRouter.get("/industry_analysis", Data.industry_analysis)
dataRouter.get("/userList", Data.userList)
dataRouter.get("/username", Data.username)
dataRouter.post("/calender", Data.calender)
dataRouter.post("/calenderData", Data.calenderData)

/* DB search router */
dataRouter.post("/financial_search", dbSearch.financial_search)
dataRouter.post("/calender_search", dbSearch.calender_search)
dataRouter.post("/post_board_search", dbSearch.post_board_search)
dataRouter.post("/lineMemo_search", dbSearch.lineMemo_search)
dataRouter.post("/ticker_search", dbSearch.ticker_search)

/* StockTool router */
dataRouter.post("/pricing", StockTool.pricingData)
dataRouter.post("/PER_River", StockTool.PER_river_Data)
dataRouter.post("/support_resistance", StockTool.support_resistance_data)
dataRouter.get("/realtime_price", StockTool.get_realtime_price)
dataRouter.get("/cpi_fed", StockTool.cpi_fed)

/* Subscribe router */
dataRouter.get("/get_support_resistance_sub", Sub.get_support_resistance_sub)
dataRouter.delete("/cancel_sub", Sub.delete_sub)
dataRouter.post("/handle_support_resistance_sub", Sub.handle_support_resistance_sub)

/* Notify router */
dataRouter.get("/notify_all", Notify.notify_all)
dataRouter.get("/notify_read", Notify.notify_read)
dataRouter.patch("/notify_handle_read", Notify.notify_handle_read)
dataRouter.patch("/notify_handle_unread", Notify.notify_handle_unread)
dataRouter.get("/get_notify_quantity", Notify.get_notify_quantity)

module.exports = {router};