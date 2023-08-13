const con = require('../Model/connectFinancial')

exports.financial_search = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Search financialData table.'

        #swagger.parameters['stock_num_name'] = {
            in: 'query',
            description: 'Stock num and name.',
            required: true,
            type: 'string',
            schema: "2330 台積電"
        }

        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Start date.',
            required: true,
            type: 'string',
            schema: "2023-01-01"
        }

        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'End date.',
            required: true,
            type: 'string',
            schema: "2023-04-30"
        }

        #swagger.parameters['investmentCompany'] = {
            in: 'query',
            description: 'Investment company.',
            required: true,
            type: 'string',
            schema: "all"
        }

        #swagger.parameters['recommend'] = {
            in: 'query',
            description: 'Recommend.',
            required: true,
            type: 'string',
            schema: "all"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `SELECT financialData.*, ticker_list.stock_name, ticker_list.stock_num \
                FROM financialData INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID \
                WHERE 1=1`
    let param = []

    if(req.query.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.query.stock_num_name.split(" ")[0])
    }

    if(req.query.startDate !== "" && req.query.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.query.startDate, req.query.endDate)
    }

    if(req.query.investmentCompany !== "all"){
        query += ` AND investmentCompany=?`
        param.push(req.query.investmentCompany)
    }

    if(req.query.recommend !== "all"){
        switch(req.query.recommend){
            case "buy":
                query += ` AND recommend IN ("增加持股", "中立轉買進", "買進", "買進–維持買進", "買入",\
                "強力買進", "維持買進", "強力買進/買進", "優於大盤", "buy",\
                "Buy", "BUY", "overweight", "Overweight", "OVERWEIGHT",\
                "增加持股(Overweight)", "買進(Buy)", "買進 (維持評等)", "買進 (調升評等)", "買進 (重新納入研究範圍)",\
                "買進 (研究員異動)", "買進  (初次報告)", "買進 (初次報告)", "買進（調升）", "區間→買進",\
                "買進（維持）", "買 進", "買進(調升評等)", "買進(維持評等)", "強力買進(調升評等)",\
                "強力買進(維持評等)", "強力買進(上調評等)", "買進(初次評等)", "買進(調降目標價)", "強力買進(初次評等)",\
                "Upgrade to BUY", "評等買進", "UPGRADE TO BUY", "Upgrade To BUY", "買進轉強力買進",\
                "維持強力買進", "STRONG BUY", "Upgarde to BUY", "Trading Buy", "買進買進",\
                "買進(維持)", "逢低買進(維持)", "買進(初次)", "買進 – 維持買進", "買進– 維持買進",\
                "逢低買進", "買進(首次評等)", "買進 (首次評等)", "買進-維持", "逢低買進-首次", "買進 – 中立轉買進",\
                "逢低買進-維持", "買進-首次", "Maintain OUTPERFORM", "OUTPERFORM", "outperform",\
                "Outperform", "買進(初次報告)", "買進 ", "強力買進/買進 ", " 買進", "增加持股(OW)", "買進(研究員異動)", "買進 – 初次評等",\
                "Maintain UNDERPERFORM")`
                break
            
            case "sell":
                query += ` AND recommend IN ("賣出", "劣於大盤", "sell", "Sell", "SELL",\
                "Underweight", "underweight", "UNDERWEIGHT", "REDUCE", "reduce",\
                "Reduce", "賣出(Sell)", "降低持股", "降低持股(Underweight)", "賣出 (維持評等)",\
                "賣 出","降低持股(調降評等)", "賣出(調降評等)", "Underperform", "underperform",\
                "UNDERPERFORM", "MAINTAIN REDUCE", "More volatile than peers ")`
                break
            
            case "neutral":
                query += ` AND recommend IN ("維持中立", "中立", "買進轉中立", "持有-超越同業(維持評等)", "hold",\
                "Hold", "HOLD", "Neutral", "neutral", "NEUTRAL",\
                "中立(Neutral)", "持有-落後同業", "持有-落後同業 (維持評等)", "持有-超越同業 (調降評等)", "持有-超越同業",\
                "持有-落後同業(維持評等)", "持有-超越大盤(維持評等)", "持有-超越大盤 (維持評等)", "持有-落後大盤", "中立（調降）",\
                "長期持有", "中立(維持評等)", "中立(調降評等)", "中立(初次評等)", "中立 (維持評等)",\
                "中立(降低評等)", "中立(調升評等)", "中立(下修評等)", "中立 (調降評等)", "評等中立",\
                "Downgrade to HOLD", "持有", "中立中立", "中立 – 維持中立", "中立 – 初次評等中立",\
                "中立 – 買進轉中立", "中立 – 初次評等", "中性", "中性 (維持評等)", "中 性 (維 持 評 等 )",\
                "中性 (調降評等)", "中立 ", "Equal-weight", "未評等", "未評等 ",\
                " 中立", "Downgrade to NEUTRAL", "持有-超越同業(研究員異動)", "MAINTAIN HOLD", "持有-落後同業(調降評等)",\
                "DOWNGRADE TO HOLD", "中立–維持中立")`
                break

            case "interval":
                    query += ` AND recommend IN ("區間操作", "區間操作（調降）", "區間", "區間操作 ")`
                    break
            default:
                break
        }
        
    }

    query += " ORDER BY financialData.date DESC, ticker_list.stock_name ASC, \
                financialData.investmentCompany DESC, financialData.recommend ASC"

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        console.log(error)
        return res.status(400).send("error")
    }
}

exports.post_board_search = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Search post_board_memo table.'

        #swagger.parameters['stock_num_name'] = {
            in: 'query',
            description: 'Stock num and name.',
            required: true,
            type: 'string',
            schema: "2330 台積電"
        }

        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Start date.',
            required: true,
            type: 'string',
            schema: "2023-01-01"
        }

        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'End date.',
            required: true,
            type: 'string',
            schema: "2023-04-30"
        }

        #swagger.parameters['provider'] = {
            in: 'query',
            description: 'Provider.',
            required: true,
            type: 'string',
            schema: ""
        }

        #swagger.parameters['recommend'] = {
            in: 'query',
            description: 'Recommend.',
            required: true,
            type: 'string',
            schema: ""
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `SELECT post_board_memo.*, ticker_list.stock_name, ticker_list.stock_num \
                FROM post_board_memo INNER JOIN ticker_list ON post_board_memo.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.query.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.query.stock_num_name.split(" ")[0])
    }

    if(req.query.startDate !== "" && req.query.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.query.startDate, req.query.endDate)
    }

    if(req.query.recommend !== ""){
        query += ` AND evaluation=?`
        param.push(req.query.recommend)
    }

    if(req.query.provider !== ""){
        query += ` AND username=?`
        param.push(req.query.provider)
    }

    query += " ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}

exports.lineMemo_search = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Search lineMemo table.'

        #swagger.parameters['stock_num_name'] = {
            in: 'query',
            description: 'Stock num and name.',
            required: true,
            type: 'string',
            schema: "2330 台積電"
        }

        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Start date.',
            required: true,
            type: 'string',
            schema: "2023-01-01"
        }

        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'End date.',
            required: true,
            type: 'string',
            schema: "2023-04-30"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `SELECT lineMemo.*, ticker_list.stock_name, ticker_list.stock_num \
                FROM lineMemo INNER JOIN ticker_list ON lineMemo.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.query.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.query.stock_num_name.split(" ")[0])
    }
    
    if(req.query.startDate !== "" && req.query.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.query.startDate, req.query.endDate)
    }

    query += " ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query, param);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send(error)
    }
}

exports.calender = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Get twse data and transorm to calender type.'

        #swagger.parameters['year'] = {
            in: 'query',
            description: 'Twse year.',
            required: true,
            type: 'string',
            schema: "2023"
        }

        #swagger.parameters['month'] = {
            in: 'query',
            description: 'Twse month.',
            required: true,
            type: 'string',
            schema: "04"
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

exports.calender_search = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Search calender table.'

        #swagger.parameters['stock_num_name'] = {
            in: 'query',
            description: 'Stock num and name.',
            required: true,
            type: 'string',
            schema: "2330 台積電"
        }

        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Start date.',
            required: true,
            type: 'string',
            schema: "2023-01-01"
        }

        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'End date.',
            required: true,
            type: 'string',
            schema: "2023-04-30"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `SELECT calender.*, ticker_list.stock_name\
                from calender INNER JOIN ticker_list ON calender.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.query.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.query.stock_num_name.split(" ")[0])
    }

    if(req.query.startDate !== "" && req.query.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.query.startDate, req.query.endDate)
    }

    query += " ORDER BY date ASC, ticker_list.stock_name ASC, Time ASC"

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.ticker_search = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Search 4 number ticker.'

        #swagger.parameters['pattern'] = {
            in: 'query',
            description: 'Ticker pattern.',
            required: true,
            type: 'string',
            schema: "台積電"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    if(req.query.pattern === ""){
        res.status(200).json({})
    }

    let query = `SELECT stock_name FROM ticker_list WHERE stock_name LIKE ? AND CHAR_LENGTH(stock_num)=4`
    let param = [`%${req.query.pattern}%`]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}

exports.news_search = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Search news table.'

        #swagger.parameters['column'] = {
            in: 'query',
            description: 'News search column.',
            required: true,
            type: 'string',
            schema: "title"
        }

        #swagger.parameters['pattern'] = {
            in: 'query',
            description: 'Search pattern.',
            required: true,
            type: 'string',
            schema: ""
        }

        #swagger.parameters['category'] = {
            in: 'query',
            description: 'News caregory.',
            required: true,
            type: 'string',
            schema: "all"
        }

        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Strat date.',
            required: true,
            type: 'string',
            schema: "2023-01-01"
        }

        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'End date.',
            required: true,
            type: 'string',
            schema: "2023-04-30"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `SELECT * FROM news WHERE 1=1`
    let param = []

    if(req.query.startDate !== "" && req.query.endDate !== ""){
        query += " AND date BETWEEN ? AND ?"
        param.push(req.query.startDate, req.query.endDate)
    }

    if(req.query.pattern !== ""){
        query += " AND ?? LIKE ?"
	    param.push(req.query.column, `%${req.query.pattern}%`)
    }

    if(req.query.category !== "all"){
        query += " AND category=?"
        param.push(req.query.category)
    }

    query += " ORDER BY date DESC, category ASC"

    try {
        const [rows, fields] = await con.promise().query(query, param);
        
        for(let i = 0; i < rows.length; i++){
            rows[i]["title"] = [rows[i]["title"], rows[i]["link"]]
            delete rows[i]["link"]
        }

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.news_summary = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Search news summary.'

        #swagger.parameters['date'] = {
            in: 'query',
            description: 'Date.',
            required: true,
            type: 'string',
            schema: "2023-04-20",
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `SELECT COUNT(*) as todayQuantity FROM news WHERE date=?;\
                SELECT category, COUNT(category) as todayQuantity FROM news WHERE date=? GROUP BY category ORDER BY category;\
                SELECT COUNT(*) as pastQuantity FROM news WHERE date<?;\
                SELECT category, COUNT(category) as pastQuantity FROM news WHERE date<? GROUP BY category ORDER BY category;`
    let param = [req.query.date, req.query.date, req.query.date, req.query.date]
    let result = [
        { "ID" : 0, "category" : "全部", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 1, "category" : "MoneyDj 傳產", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 2, "category" : "MoneyDj 科技", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 3, "category" : "工商時報 產業", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 4, "category" : "工商時報 科技", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 5, "category" : "工商時報 證券", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 6, "category" : "經濟日報 產業 產業熱點", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 7, "category" : "經濟日報 產業 科技產業", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 8, "category" : "經濟日報 產業 綜合產業", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 9, "category" : "經濟日報 產業 產業達人", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 10, "category" : "經濟日報 產業 無感5G時代", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 11, "category" : "經濟日報 證券 市場焦點", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 12, "category" : "經濟日報 證券 集中市場", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 13, "category" : "經濟日報 證券 櫃買動態", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 14, "category" : "經濟日報 證券 權證特區", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 15, "category" : "經濟日報 證券 證券達人", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 16, "category" : "經濟日報 證券 台股擂台", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 17, "category" : "財報狗", "todayQuantity" : 0, "pastQuantity" : 0 },
    ]
    const rowNum = [1, 3]

    try {
        const [rows, fields] = await con.promise().query(query, param)

        result[0]["todayQuantity"] = rows[0][0]["todayQuantity"]
        result[0]["pastQuantity"] = rows[2][0]["pastQuantity"]

        rowNum.forEach((row) => {
            for(let i = 0; i < rows[row].length; i++){
                result.filter(ele => ele["category"] === rows[row][i]["category"])
                .forEach(ele => {
                    if(row == 1) ele["todayQuantity"] = rows[row][i]["todayQuantity"]
                    if(row == 3) ele["pastQuantity"] = rows[row][i]["pastQuantity"]
                })
            }
        })

        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(400).send("error")
    } 
}

exports.other_search = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Search financialDataOther.'

        #swagger.parameters['pattern'] = {
            in: 'query',
            description: 'Search pattern.',
            required: true,
            type: 'string',
            schema: ""
        }

        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Start date.',
            required: true,
            type: 'string',
            schema: "2023-01-01",
        }

        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'End date.',
            required: true,
            type: 'string',
            schema: "2023-04-30",
        }

        #swagger.parameters['investmentCompany'] = {
            in: 'query',
            description: 'Investment company.',
            required: true,
            type: 'string',
            schema: "all",
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT * FROM financialDataOther WHERE 1=1"
    let param = []

    if(req.query.pattern !== ""){
        query += " AND title LIKE ?"
	    param.push(`%${req.query.pattern}%`)
    }

    if((req.query.startDate !== "") && (req.query.endDate !== "")){
        query += " AND date BETWEEN ? AND ?"
        param.push(req.query.startDate, req.query.endDate)
    }

    if(req.query.investmentCompany !== "all"){
        query += " AND investmentCompany=?"
        param.push(req.query.investmentCompany)
    }

    query += " ORDER BY date DESC, investmentCompany DESC"

    try {
        const [rows, fields] = await con.promise().query(query, param)

        return res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        return res.status(400).send("error")
    } 
}

exports.ticker_category = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
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

exports.popular_news = async function(req, res){
    /*
        #swagger.tags = ['Search data from db']
        #swagger.description = 'Get popular news.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let mapping = {
        "3days" : 3,
        "week" : 7,
        "month" : 30
    }
    let result = {"table" : [], "highchart" : []}

    let query = "SELECT popular_news.*, ticker_list.stock_name, ticker_list.stock_num, news.title, news.date, news.link FROM popular_news \
                INNER JOIN ticker_list ON popular_news.ticker_id=ticker_list.ID \
                INNER JOIN news ON popular_news.news_id=news.ID \
                WHERE time_interval=?"
    let param = [mapping[req.query.interval]]

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