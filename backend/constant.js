require('dotenv').config()
const session = require('express-session');

const sessionMaxAge = 15 * 60 * 1000
const API_ROUTE_IP = "/api"

const dev = {
    API_BASE_IP : "0.0.0.0",
    API_PORT : 3000,
    CLIENT_IP : "http://140.116.214.154:8080",
    DJANGO_REST_IP : "http://140.116.214.154:3847/api",
    FINANCIALDATA_PATH : "/home/cosbi/桌面/financialData/gmailData/data/",
    FINANCIALDATAOTHER_PATH : "/home/cosbi/桌面/financialData/gmailDataOther/data/",
    FINANCIALDATAINDUSTRY_PATH : "/home/cosbi/桌面/financialData/gmailDataIndustry/data/",
    POST_BOARD_MEMO_PATH : "/home/cosbi/桌面/financialData/post_board_data/",
    LINE_MEMO_PATH : "/home/cosbi/桌面/financialData/lineMemo_data/",
    MEETING_DATA_MEMO_PATH : "/home/cosbi/桌面/financialData/meeting_data/",
    INDUSTRY_ANALYSIS_PATH : "/home/cosbi/桌面/financialData/Industry_analysis/",
    TWSE_CHPDF_PATH : "/home/cosbi/桌面/financialData/twseData/data/ch/",
    TWSE_ENPDF_PATH : "/home/cosbi/桌面/financialData/twseData/data/en/",
    CSV_PATH : "/home/cosbi/桌面/financialData/",
    RECOMMEND_JSON_PATH : "/home/cosbi/financialSite/recommend.json",
    DB_HOST : process.env.DB_HOST,
    DB_USER : process.env.DB_USER,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_DATABASE_FINANCIAL : process.env.DB_DATABASE_FINANCIAL,
    DB_DATABASE_TWSTOCK : process.env.DB_DATABASE_TWSTOCK
}

const prod = {
    API_BASE_IP : "127.0.0.1",
    API_PORT : 3000,
    CLIENT_IP : "http://cosbi5.ee.ncku.edu.tw",
    DJANGO_REST_IP : "http://140.116.214.134:3847/api",
    FINANCIALDATA_PATH : "/home/uikai/financialData/gmailData/data/",
    FINANCIALDATAOTHER_PATH : "/home/uikai/financialData/gmailDataOther/data/",
    FINANCIALDATAINDUSTRY_PATH : "/home/uikai/financialData/gmailDataIndustry/data/",
    POST_BOARD_MEMO_PATH : "/home/uikai/financialData/post_board_data/",
    LINE_MEMO_PATH : "/home/uikai/financialData/lineMemo_data/",
    MEETING_DATA_MEMO_PATH : "/home/uikai/financialData/meeting_data/",
    INDUSTRY_ANALYSIS_PATH : "/home/uikai/financialData/Industry_analysis/",
    TWSE_CHPDF_PATH : "/home/uikai/financialData/twseData/data/ch/",
    TWSE_ENPDF_PATH : "/home/uikai/financialData/twseData/data/en/",
    CSV_PATH : "/home/uikai/financialData/table_status/data",
    RECOMMEND_JSON_PATH : "/home/uikai/financialSite/recommend.json",
    DB_HOST : process.env.DB_HOST,
    DB_USER : process.env.DB_USER,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_DATABASE_FINANCIAL : process.env.DB_DATABASE_FINANCIAL,
    DB_DATABASE_TWSTOCK : process.env.DB_DATABASE_TWSTOCK
}

const config = process.env.NODE_ENV === "development" ? dev : prod

const sessionMiddleware = session({
    secret: 'secretkey',
    rolling: true,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge : sessionMaxAge,
        secure : false,
        httpOnly : process.env.NODE_ENV === "development" ? false : true,
        sameSite : process.env.NODE_ENV === "development" ? false : "strict"
    }
})

const corsSetting = {
    origin : config["CLIENT_IP"],
    credentials: true,
}

const ioOptions = {
    cors : corsSetting
}

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

const WebSocketMiddlewareHandler = (socket, next) => {
    if (socket.handshake.query.username) {
      next();
    }
}

const init_table_status = [
    { "dbName" : "新聞", "dataQuantity" : 0, "newestDate" : "2023-01-01", "table" : "news" },
    { "dbName" : "法說會", "dataQuantity" : 0, "newestDate" : "2023-01-01", "table" : "calender" },
    { "dbName" : "個股研究報告", "dataQuantity" : 0, "newestDate" : "2023-01-01", "table" : "financialData" },
    { "dbName" : "其他研究報告", "dataQuantity" : 0, "newestDate" : "2023-01-01", "table" : "financialOther" },
    { "dbName" : "產業研究報告", "dataQuantity" : 0, "newestDate" : "2023-01-01", "table" : "financialIndustry" },
    { "dbName" : "linememo", "dataQuantity" : 0, "newestDate" : "2023-01-01", "table" : "lineMemo" },
    { "dbName" : "個股推薦", "dataQuantity" : 0, "newestDate" : "2023-01-01", "table" : "post_board_memo" },
]

module.exports = { 
    sessionMaxAge, 
    API_ROUTE_IP,
    sessionMiddleware, 
    corsSetting, 
    ioOptions, 
    wrap, 
    WebSocketMiddlewareHandler, 
    config,
    init_table_status
}