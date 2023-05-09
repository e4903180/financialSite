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
const dbUpdate = require('./Controller/dbUpdateController');
const FilterTicker = require('./Controller/filterTickerController');
const StockTool = require('./Controller/stockToolContrtoller');
const PostUp = require('./Controller/upload/uploadPostBoardMemoController');
const gmailIndustry_analysisUp = require('./Controller/upload/uploadFinancialDataIndustryController');
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
userRouter.post('/login', User.login)
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

        #swagger.security = [{
            "apiAuth": []
        }]
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
dataRouter.get("/download/single_financialDataIndustry", Download.single_financialDataIndustry_download)
dataRouter.get("/download/table_status", Download.table_status)

/* Download table router */
dataRouter.get("/download/table_status", Download.table_status)

/* Upload files router */
dataRouter.post("/upload/post_board_upload", PostUp.post_board_middleWare, PostUp.post_board_upload)
dataRouter.post("/upload/line_memo_upload", LineMemoUp.lineMemo_upload)
dataRouter.post("/upload/self_upload", SelfUp.self_upload_middleWare, SelfUp.self_upload)
dataRouter.post("/upload/other", OtUp.other_upload_middleWare, OtUp.other_upload)
dataRouter.post("/upload/industry", gmailIndustry_analysisUp.industry_upload_middleWare, gmailIndustry_analysisUp.industry_upload)

/* Get DB data */
dataRouter.get("/newestNews20", Data.newestNews20)
dataRouter.get("/newestResearch20", Data.newestResearch20)
dataRouter.get("/table_status", Data.table_status)
dataRouter.get("/post_board_state", Data.post_board_state)
dataRouter.get("/lineMemo_state", Data.lineMemo_state)
dataRouter.get("/superUser", Data.superUser)
dataRouter.get("/userList", Data.userList)
dataRouter.get("/username", Data.username)
dataRouter.get("/calender", Data.calender)
dataRouter.post("/calenderData", Data.calenderData)
dataRouter.get("/ticker_list", Data.ticker_list)
dataRouter.get("/ticker_category", Data.ticker_category)
dataRouter.get("/popular_ticker", Data.popular_ticker)

/* DB search router */
dataRouter.post("/financial_search", dbSearch.financial_search)
dataRouter.get("/other_search", dbSearch.other_search)
dataRouter.post("/calender_search", dbSearch.calender_search)
dataRouter.post("/post_board_search", dbSearch.post_board_search)
dataRouter.post("/lineMemo_search", dbSearch.lineMemo_search)
dataRouter.post("/ticker_search", dbSearch.ticker_search)
dataRouter.get("/industry_search", dbSearch.industry_search)
dataRouter.get("/news_search_today", dbSearch.news_search_today)
dataRouter.get("/news_search_past", dbSearch.news_search_past)
dataRouter.get("/news_search", dbSearch.news_search)
dataRouter.get("/news_summary", dbSearch.news_summary)
dataRouter.get("/twse_recommend_search", dbSearch.twse_recommend_search)

/* DB edit router */
dataRouter.patch("/financial_recommend", dbUpdate.financial_recommend_update)
dataRouter.delete("/financial", dbUpdate.financial_delete)
dataRouter.patch("/financialDataIndustry_title", dbUpdate.financialDataOther_title_update)
dataRouter.delete("/financialDataIndustry", dbUpdate.financialDataOther_delete)

/* StockTool router */
dataRouter.get("/PricingStrategy", StockTool.pricingData)
dataRouter.get("/PER_River", StockTool.PER_river_Data)
dataRouter.get("/support_resistance", StockTool.support_resistance_data)
dataRouter.get("/inflation", StockTool.inflation)
dataRouter.get("/cpi_ppi", StockTool.cpi_ppi)
dataRouter.get("/top_ticker", StockTool.top_ticker)

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
dataRouter.get("/all_notify", Notify.get_all_notify)
dataRouter.get("/readed_notify", Notify.get_readed_notify)
dataRouter.patch("/notify_handle_read", Notify.notify_handle_read)
dataRouter.patch("/notify_handle_unread", Notify.notify_handle_unread)
dataRouter.get("/unread_notify", Notify.get_unread_notify)

/* Filter ticker */
dataRouter.get("/filter_ticker", FilterTicker.filter_ticker)

module.exports = {router};