const con = require('../Model/connectFinancial');
const { init_table_status } = require('../constant');

exports.newestResearch20 = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get newest 20 ticker research.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT financialData.*, ticker_list.stock_name \
                FROM financialData INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID ORDER BY \
                financialData.date DESC, ticker_list.stock_name ASC, financialData.investmentCompany DESC, \
                financialData.recommend ASC, ticker_list.stock_name ASC Limit 20;\
                SELECT * FROM financialDataIndustry ORDER BY `date` DESC Limit 20;"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows)
    } catch (error) {
        console.log(error)
        return res.status(400).send("error")
    }
};

exports.newestNews20 = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get newest 20 news.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `SELECT date, title, link FROM news WHERE category LIKE "%工商時報%" ORDER BY date DESC LIMIT 20;\
                SELECT date, title, link FROM news WHERE category LIKE "%MoneyDj%" ORDER BY date DESC LIMIT 20;\
                SELECT date, title, link FROM news WHERE category LIKE "%經濟日報%" ORDER BY date DESC LIMIT 20;\
                SELECT date, title, link FROM news WHERE category="財報狗" ORDER BY date DESC LIMIT 20;`
    let result = []

    try {
        const [rows, fields] = await con.promise().query(query);
        
        for(let i = 0; i < 20; i++){
            let temp = { 
                "ID" : i,
                "cteeDate" : "", 
                "cteeTitle" : ["", ""], 
                "moneyDjDate" : "", 
                "moneyDjTitle" : ["", ""], 
                "moneyDate" : "", 
                "moneyTitle" : ["", ""],
                "statementdogDate" : "", 
                "statementdogTitle" : ["", ""],
            }

            if(i < rows[0].length){
                temp["cteeDate"] = rows[0][i]["date"]
                temp["cteeTitle"] = [rows[0][i]["title"], rows[0][i]["link"]]
            }

            if(i < rows[1].length){
                temp["moneyDjDate"] = rows[1][i]["date"]
                temp["moneyDjTitle"] = [rows[1][i]["title"], rows[1][i]["link"]]
            }

            if(i < rows[2].length){
                temp["moneyDate"] = rows[2][i]["date"]
                temp["moneyTitle"] = [rows[2][i]["title"], rows[2][i]["link"]]
            }

            if(i < rows[3].length){
                temp["statementdogDate"] = rows[3][i]["date"]
                temp["statementdogTitle"] = [rows[3][i]["title"], rows[3][i]["link"]]
            }

            result.push(temp)
        }

        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send("error")
    } 
}

exports.table_status = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get table status.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT COUNT(*) as dataQuantity, MAX(date) as newestDate FROM news;\
                SELECT COUNT(*) as dataQuantity, MAX(date) as newestDate FROM calender;\
                SELECT COUNT(*) as dataQuantity, MAX(date) as newestDate FROM financialData;\
                SELECT COUNT(*) as dataQuantity, MAX(date) as newestDate FROM financialDataOther;\
                SELECT COUNT(*) as dataQuantity, MAX(date) as newestDate FROM lineMemo;\
                SELECT COUNT(*) as dataQuantity, MAX(date) as newestDate FROM post_board_memo;"

    try {
        const [rows, fields] = await con.promise().query(query);
        
        init_table_status.map((ele, idx) => {            
            if(idx === 1){
                ele["newestDate"] = rows[idx][0]["newestDate"].slice(0, 10)
            }else{
                ele["newestDate"] = rows[idx][0]["newestDate"]
            }

            ele["dataQuantity"] = rows[idx][0]["dataQuantity"]
        })

        return res.status(200).send(init_table_status)
    } catch (error) {
        console.log(error)
        return res.status(400).send("error")
    }
};

exports.post_board_state = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get post board memo table status.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT COUNT( * ) as dataQuantity, MAX(date) as newestDate FROM post_board_memo;"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows[0])
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.lineMemo_state = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get line memo table status.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT COUNT( * ) as dataQuantity, MAX(date) as newestDate FROM lineMemo;"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows[0])
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.superUser = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Check if user is super user.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT superUser FROM user WHERE userName=?"
    let param = [req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.userList = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get user list.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT name, userName, email FROM user"

    try {
        const [rows, fields] = await con.promise().query(query);

        // if(re.length % 8 != 0){
        //     const range = 8 - (re.length % 8)
        //     for(let i = 0; i < range; i++){
        //         re.push({"name" : "", "userName" : "", "email" : ""})
        //     };
        // }

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }  
}

exports.calender = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get twse data and transorm to calender type.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Twse year and month.',
            required: true,
            type: 'object',
            schema: {
                $year: "2023",
                $month: "04",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT stock_name, date, Time FROM calender \
                INNER JOIN ticker_list ON calender.ticker_id=ticker_list.ID WHERE year(date)=? AND month(date)=? ORDER BY date ASC, Time ASC, stock_name ASC;"
    let param = [req.query.year, req.query.month]
    let re = [];

    try {
        const [rows, fields] = await con.promise().query(query, param);

        for(let i = 0; i < rows.length; i++){
            if(rows[i]["date"].includes(" 至 ")){
                const temp = rows[i]["date"].split(" 至 ")
                re.push(Object.assign({"title" : rows[i]["stock_name"], "start" : temp[0], "end" : temp[1], "allDay" : true}))
            }else{
                re.push(Object.assign({"title" : rows[i]["stock_name"], "start" : rows[i]["date"], "end" : rows[i]["date"], "allDay" : true}))
            }
        };

        return res.status(200).send(re)
    } catch (error) {
        console.log(error)
        return res.status(400).send("error")
    }
}

exports.calenderData = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get twse data.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Twse year and month.',
            required: true,
            type: 'object',
            schema: {
                $year: "2023",
                $month: "04",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT calender.*, ticker_list.stock_name\
                FROM calender INNER JOIN ticker_list ON calender.ticker_id=ticker_list.ID \
                WHERE YEAR(date)=? AND MONTH(date)=?"
    let param = [req.body.year, req.body.month]

    query += " ORDER BY date ASC, ticker_list.stock_name ASC"

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.ticker_list = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = '4 number ticker list.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT ID, stock_name as stock_num_name FROM ticker_list WHERE CHAR_LENGTH(stock_num)=4"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    } 
}

exports.username = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get username.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    return res.status(200).send(req.session.userName)
}

exports.ticker_category = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get ticker category.'

        #swagger.parameters['type'] = {
            in: 'query',
            description: 'Type of ticker.',
            required: true,
            type: 'string',
            schema: "上市"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = ""

    if(req.query.type === "上櫃"){
        query = "SELECT class FROM ticker_list WHERE class RLIKE '櫃' AND class NOT IN ('櫃ETN','櫃ETF','櫃公司債','櫃認購','櫃認售') GROUP BY class ORDER BY class"
    }else if(req.query.type === "上市"){
        query = "SELECT class FROM ticker_list WHERE class NOT RLIKE '櫃' AND class NOT IN ('ETN','ETF','市牛證','市熊證','受益證券','市認購','市認售','指數類') GROUP BY class ORDER BY class"
    }else{
        query = "SELECT class FROM ticker_list WHERE class NOT IN ('ETN','ETF','市牛證','市熊證','受益證券','市認購','市認售','指數類','櫃ETN','櫃ETF','櫃公司債','櫃認購','櫃認售') GROUP BY class ORDER BY class"
    }

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    } 
}

exports.popular_ticker = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get popular ticker.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT popular_ticker.*, ticker_list.stock_name, ticker_list.stock_num FROM popular_ticker \
                INNER JOIN ticker_list ON popular_ticker.ticker_id=ticker_list.ID"

    try {
        const [rows, fields] = await con.promise().query(query);

        for(let i = 0; i < rows.length; i++){
            rows[i]["stock_name"] = rows[i]["stock_name"].split(" ")[1]
            rows[i]["financialDataQuantity"] = rows[i]["financialData"].length
            rows[i]["newsQuantity"] = rows[i]["news"].length
        }

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send(error)
    }
}

exports.popular_news = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get popular news.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let result = {"table" : [], "highchart" : []}

    let query = "SELECT popular_news.*, ticker_list.stock_name, ticker_list.stock_num, news.title, news.date, news.link FROM popular_news \
                INNER JOIN ticker_list ON popular_news.ticker_id=ticker_list.ID \
                INNER JOIN news ON popular_news.news_id=news.ID \
                WHERE time_interval=?"
    let param = [req.query.interval]

    try {
        const [rows, fields] = await con.promise().query(query, param)
        
        for(let i = 0; i < rows.length; i++){
            rows[i]["stock_name"] = rows[i]["stock_name"].slice(5,)
        }

        result["table"] = rows
    } catch (error) {
        return res.status(400).send(error)
    }

    query = "SELECT stock_name, COUNT(*) as quantity FROM popular_news \
            INNER JOIN ticker_list ON popular_news.ticker_id=ticker_list.ID WHERE time_interval=? \
            GROUP BY stock_name ORDER BY quantity DESC, stock_name ASC"
    
    try {
        const [rows, fields] = await con.promise().query(query, param)

        let category = []
        let data = []

        for(let i = 0; i < rows.length; i++){
            category.push(rows[i]["stock_name"])
            data.push(rows[i]["quantity"])
        }
        result["highchart"] = {"category" : category, "data" : data}

        return res.status(200).send(result)
    } catch (error) {
        return res.status(400).send(error)
    }
}