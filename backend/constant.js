require('dotenv').config()
const session = require('express-session');

const sessionMaxAge = 15 * 60 * 1000
const API_BASE_IP = "0.0.0.0"
const API_ROUTE_IP = "/api"
const API_PORT = 3000

const dev = {
    CLIENT_IP : "http://140.116.214.154:8080",
    DJANGO_REST_IP : "http://140.116.214.154:3847/api",
    FINANCIALDATA_PATH : "/home/cosbi/桌面/financialData/gmailData/data/",
    FINANCIALDATAINDUSTRY_PATH : "/home/cosbi/桌面/financialData/gmailDataIndustry/data/",
    POST_BOARD_MEMO_PATH : "/home/cosbi/桌面/financialData/post_board_data/",
    LINE_MEMO_PATH : "/home/cosbi/桌面/financialData/lineMemo_data/",
    MEETING_DATA_MEMO_PATH : "/home/cosbi/桌面/financialData/meeting_data/",
    INDUSTRY_ANALYSIS_PATH : "/home/cosbi/桌面/financialData/Industry_analysis/",
    TWSE_CHPDF_PATH : "/home/cosbi/桌面/financialData/twseData/data/ch/",
    TWSE_ENPDF_PATH : "/home/cosbi/桌面/financialData/twseData/data/en/",
    CSV_PATH : "/home/cosbi/桌面/financialData/",
    DB_HOST : "140.116.214.134",
    DB_USER : "financialSite",
    DB_PASSWORD : "624001479",
    DB_DATABASE_FINANCIAL : "financial",
    DB_DATABASE_TWSTOCK : "twStock"
}

const prod = {
    CLIENT_IP : "http://140.116.214.134:8080",
    DJANGO_REST_IP : "http://140.116.214.134:3847/api",
    FINANCIALDATA_PATH : "/home/uikai/financialData/gmailData/data/",
    FINANCIALDATAINDUSTRY_PATH : "/home/uikai/financialData/gmailDataIndustry/data/",
    POST_BOARD_MEMO_PATH : "/home/uikai/financialData/post_board_data/",
    LINE_MEMO_PATH : "/home/uikai/financialData/lineMemo_data/",
    MEETING_DATA_MEMO_PATH : "/home/uikai/financialData/meeting_data/",
    INDUSTRY_ANALYSIS_PATH : "/home/uikai/financialData/Industry_analysis/",
    TWSE_CHPDF_PATH : "/home/uikai/financialData/twseData/data/ch/",
    TWSE_ENPDF_PATH : "/home/uikai/financialData/twseData/data/en/",
    CSV_PATH : "/home/uikai/financialData/",
    DB_HOST : "140.116.214.134",
    DB_USER : "financialSite",
    DB_PASSWORD : "624001479",
    DB_DATABASE_FINANCIAL : "financial",
    DB_DATABASE_TWSTOCK : "twStock"
}

const config = process.env.NODE_ENV === "development" ? dev : prod

const sessionMiddleware = session({
    secret: 'secretkey',
    rolling: true,
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge : sessionMaxAge,
        secure : false
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

module.exports = { 
    sessionMaxAge, 
    API_BASE_IP,
    API_ROUTE_IP,
    API_PORT,
    sessionMiddleware, 
    corsSetting, 
    ioOptions, 
    wrap, 
    WebSocketMiddlewareHandler, 
    config
}