var express = require('express')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
var router = express.Router();
const rateLimit = require("express-rate-limit")
var dataRouter = express.Router();
var userRouter = express.Router();
var swaggerRouter = express.Router();
const User = require('./Controller/userController');
const Data = require('./Controller/dataController');
const Notify = require('./Controller/notifyController');
const Sub = require('./Controller/subController');
const dbSearch = require('./Controller/dbSearchController');
const FilterTicker = require('./Controller/filterTickerController');
const StockTool = require('./Controller/stockToolContrtoller');
const PostUp = require('./Controller/upload/uploadPostBoardMemoController');
const LineMemoUp = require('./Controller/upload/uploadLinememoController');
const SelfUp = require('./Controller/upload/uploadFinancialDataController');
const OtUp = require('./Controller/upload/uploadFinancialDataOtherController');
const Download = require('./Controller/download/downloadController');
const Swagger = require('./Controller/swaggerController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { swagger_password } = require('./constant');

const Limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3
});

router.use("/user", userRouter)
router.use('/data', dataRouter)
router.use("/swagger", swaggerRouter)

/* swagger router */
router.use('/document', swaggerUi.serve)
router.get('/document', swaggerUi.setup(swaggerDocument))
swaggerRouter.get("/token", Swagger.token)

/* User router */
userRouter.get('/login', User.login)
userRouter.post('/register', User.register)
userRouter.get("/logout", User.logout)

dataRouter.use(function (req, res, next) {
    if("swagger_token" in req.headers){
        const decoded = jwt.verify(req.headers["swagger_token"], "secret")

        if((decoded["username"] !== "swagger") ||
            (!bcrypt.compareSync(decoded["password"], swagger_password))){

            return res.status(400).send('Token expired')
        }
        
        next()
    }else{
        if(!req.session.userName){
            req.session.destroy();
    
            return res.status(400).send('Session expired')
        }
        next()
    }
})

dataRouter.get("/isAuth", function(req, res){
    /*
        #swagger.tags = ['Authenticate check']
        #swagger.description = 'Check if user have auth.'
    */
    if("swagger_token" in req.headers){
        return res.status(200).send("Token available")
    }

    return res.status(200).send(req.session.userName)
})

/* Download files router */
dataRouter.get("/download/single_financialData", Download.single_financialData_download)
dataRouter.get("/download/single_post_board_memo", Download.single_post_board_memo_download)
dataRouter.get("/download/single_line_memo", Download.single_line_memo_download)
dataRouter.get("/download/single_twse_chPDF", Download.single_twse_chPDF_download)
dataRouter.get("/download/single_twse_enPDF", Download.single_twse_enPDF_download)
dataRouter.get("/download/single_financialDataOther", Download.single_financialDataOther_download)
dataRouter.get("/download/table_status", Download.table_status)

/* Download table router */
dataRouter.get("/download/table_status", Download.table_status)

/* Upload files router */
dataRouter.post("/upload/post_board_upload", PostUp.post_board_middleWare, PostUp.post_board_upload)
dataRouter.post("/upload/line_memo_upload", LineMemoUp.lineMemo_upload)
dataRouter.post("/upload/self_upload", SelfUp.self_upload_middleWare, SelfUp.self_upload)
dataRouter.post("/upload/other", OtUp.other_upload_middleWare, OtUp.other_upload)

/* Get DB data */
dataRouter.get("/newestNews20", Data.newestNews20)
dataRouter.get("/newestResearch20", Data.newestResearch20)
dataRouter.get("/table_status", Data.table_status)
dataRouter.get("/superUser", Data.superUser)
dataRouter.get("/userList", Data.userList)
dataRouter.get("/username", Data.username)
dataRouter.get("/popular_ticker", Data.popular_ticker)

/* DB search router */
dataRouter.get("/financial_search", dbSearch.financial_search)
dataRouter.get("/other_search", dbSearch.other_search)
dataRouter.get("/calender", dbSearch.calender)
dataRouter.get("/calender_search", dbSearch.calender_search)
dataRouter.get("/post_board_search", dbSearch.post_board_search)
dataRouter.get("/lineMemo_search", dbSearch.lineMemo_search)
dataRouter.get("/ticker_search", dbSearch.ticker_search)
dataRouter.get("/news_search", dbSearch.news_search)
dataRouter.get("/news_summary", dbSearch.news_summary)
dataRouter.get("/ticker_category", dbSearch.ticker_category)
dataRouter.get("/popular_news", dbSearch.popular_news)

/* StockTool router */
dataRouter.get("/PricingStrategy", StockTool.pricingData)
dataRouter.get("/PER_River", StockTool.PER_river_Data)
dataRouter.get("/support_resistance", StockTool.support_resistance_data)
dataRouter.get("/inflation", StockTool.inflation)
dataRouter.get("/cpi_ppi", StockTool.cpi_ppi)
dataRouter.get("/top_ticker", StockTool.top_ticker)
dataRouter.get("/twse_financialData", StockTool.twse_financialData)

/* Subscribe router */
dataRouter.get("/get_sub", Sub.get_sub)
dataRouter.get("/get_user_notify_type", Sub.get_user_notify_type)
dataRouter.put("/update_user_lineNotify_type", Sub.update_user_lineNotify_type)
dataRouter.put("/update_user_emailNotify_type", Sub.update_user_emailNotify_type)
dataRouter.delete("/cancel_sub", Sub.delete_sub)
dataRouter.post("/handle_support_resistance_sub", Sub.handle_support_resistance_sub)
dataRouter.post("/handle_pricing_strategy_sub", Sub.handle_pricing_strategy_sub)
dataRouter.post("/handle_per_river_sub", Sub.handle_per_river_sub)

/* Notify router */
dataRouter.get("/notify", Notify.get_notify)
dataRouter.put("/notify_handle_read", Notify.notify_handle_read)
dataRouter.put("/notify_handle_unread", Notify.notify_handle_unread)
dataRouter.get("/unread_notify", Notify.get_unread_notify)

/* Filter ticker */
dataRouter.get("/filter_ticker", FilterTicker.filter_ticker)

module.exports = {router};