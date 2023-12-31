require('dotenv').config()
const session = require('express-session');

const sessionMaxAge = 15 * 60 * 1000
const API_ROUTE_IP = "/api"

const dev = {
    API_BASE_IP : "127.0.0.1",
    API_PORT : 3000,
    CORS_ORIGIN : ["http://127.0.0.1:8080", "http://127.0.0.1:3000"],
    SWAGGER_HOST : "127.0.0.1:3000",
    CLIENT_IP : "http://127.0.0.1:8080",
    DJANGO_REST_IP : "http://127.0.0.1:3847/api",
    FINANCIALDATA_PATH : "/home/cosbi/桌面/financialData/gmailData/data/",
    FINANCIALDATAOTHER_PATH : "/home/cosbi/桌面/financialData/gmailDataOther/data/",
    POST_BOARD_MEMO_PATH : "/home/cosbi/桌面/financialData/post_board_data/",
    LINE_MEMO_PATH : "/home/cosbi/桌面/financialData/lineMemo_data/",
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
    CORS_ORIGIN : ["https://cosbi5.ee.ncku.edu.tw"],
    SWAGGER_HOST : "cosbi5.ee.ncku.edu.tw",
    CLIENT_IP : "https://cosbi5.ee.ncku.edu.tw",
    DJANGO_REST_IP : "http://127.0.0.1:3847/api",
    FINANCIALDATA_PATH : "/home/uikai/financialData/gmailData/data/",
    FINANCIALDATAOTHER_PATH : "/home/uikai/financialData/gmailDataOther/data/",
    POST_BOARD_MEMO_PATH : "/home/uikai/financialData/post_board_data/",
    LINE_MEMO_PATH : "/home/uikai/financialData/lineMemo_data/",
    TWSE_CHPDF_PATH : "/home/uikai/financialData/twseData/data/ch/",
    TWSE_ENPDF_PATH : "/home/uikai/financialData/twseData/data/en/",
    CSV_PATH : "/home/uikai/financialData/table_status/data/",
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
    origin : config["CORS_ORIGIN"],
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
    { "dbName" : "linememo", "dataQuantity" : 0, "newestDate" : "2023-01-01", "table" : "lineMemo" },
    { "dbName" : "個股推薦", "dataQuantity" : 0, "newestDate" : "2023-01-01", "table" : "post_board_memo" },
]

const swagger_password = "$2a$12$AtdRyQQhgx4BWCmXJGuhcerNUmCObgi42rzluiQ1OD1Sl2ZrBlYGi"

module.exports = { 
    sessionMaxAge, 
    API_ROUTE_IP,
    sessionMiddleware, 
    corsSetting, 
    ioOptions, 
    wrap, 
    WebSocketMiddlewareHandler, 
    config,
    init_table_status,
    swagger_password
}