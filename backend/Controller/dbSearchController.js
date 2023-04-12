const con = require('../Model/connectFinancial')

exports.financial_search = async function(req, res){
    let query = `SELECT financialData.*, ticker_list.stock_name, ticker_list.stock_num \
                FROM financialData INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID \
                WHERE 1=1`
    let param = []

    if(req.body.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.body.stock_num_name.split(" ")[0])
    }

    if(req.body.startDate !== "" && req.body.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.body.startDate, req.body.endDate)
    }

    if(req.body.investmentCompany !== "all"){
        query += ` AND investmentCompany=?`
        param.push(req.body.investmentCompany)
    }

    if(req.body.recommend !== "all"){
        switch(req.body.recommend){
            case "buy":
                query += ` AND recommend IN ('增加持股','中立轉買進','買進','優於大盤','buy','Buy','BUY','overweight',\
                        'Overweight','OVERWEIGHT','增加持股(Overweight)','買進(Buy)','買進 (維持評等)','買進 (調升評等)',\
                        '買進 (重新納入研究範圍)','買進 (研究員異動)','買進  (初次報告)','買進 (初次報告)','買進（調升）',\
                        '區間→買進','買進（維持）','買 進','買進(調升評等)','買進(維持評等)','強力買進(調升評等)','強力買進(維持評等)',\
                        '強力買進(上調評等)','買進(初次評等)','買進(調降目標價)','強力買進(初次評等)','Upgrade to BUY','評等買進',\
                        'UPGRADE TO BUY','Upgrade To BUY','買進轉強力買進','維持強力買進','STRONG BUY','Upgarde to BUY','Trading Buy',\
                        '買進買進','買進(維持)','逢低買進(維持)','買進(初次)','買進 – 維持買進','買進– 維持買進','逢低買進','買進(首次評等)',\
                        '買進 (首次評等)','買進-維持','逢低買進-首次','逢低買進-維持','買進-首次','Maintain OUTPERFORM','OUTPERFORM',\
                        'outperform','Outperform')`
                break
            
            case "sell":
                query += ` AND recommend IN ('賣出','劣於大盤','sell','Sell','SELL','Underweight','underweight','UNDERWEIGHT',\
                        'reduce','Reduce','REDUCE','賣出(Sell)','降低持股','降低持股(Underweight)','賣出 (維持評等)','賣 出',\
                        '降低持股(調降評等)','賣出(調降評等)','Underperform','underperform','UNDERPERFORM')`
                break
            
            case "neutral":
                query += ` AND recommend IN ('維持中立','中立','買進轉中立','持有-超越同業(維持評等)','hold','Hold','HOLD','neutral',\
                        'Nertual','NEUTRAL','中立(Neutral)','持有-落後同業','持有-落後同業 (維持評等)','持有-超越同業 (調降評等)',\
                        '持有-超越同業','持有-落後同業(維持評等)','持有-超越大盤(維持評等)','持有-超越大盤 (維持評等)','持有-落後大盤',\
                        '中立（調降）','長期持有','中立(維持評等)','中立(調降評等)','中立(初次評等)','中立 (維持評等)','中立(降低評等)',\
                        '中立(調升評等)','中立(下修評等)','中立 (調降評等)','評等中立','Downgrade to HOLD','持有','中立中立','中立 – 維持中立',\
                        '中立 – 初次評等中立','中立 – 買進轉中立','中立 – 初次評等','中性','中性 (維持評等)','中 性 (維 持 評 等 )','中性 (調降評等)')`
                break

            case "interval":
                    query += ` AND recommend IN ('區間操作','區間操作（調降）','區間')`
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
    let query = `SELECT post_board_memo.*, ticker_list.stock_name, ticker_list.stock_num \
                FROM post_board_memo INNER JOIN ticker_list ON post_board_memo.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.body.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.body.stock_num_name.split(" ")[0])
    }

    if(req.body.startDate !== "" && req.body.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.body.startDate, req.body.endDate)
    }

    if(req.body.recommend !== ""){
        query += ` AND evaluation=?`
        param.push(req.body.recommend)
    }

    if(req.body.provider !== ""){
        query += ` AND username=?`
        param.push(req.body.provider)
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
    let query = `SELECT lineMemo.*, ticker_list.stock_name, ticker_list.stock_num \
                FROM lineMemo INNER JOIN ticker_list ON lineMemo.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.body.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.body.stock_num_name.split(" ")[0])
    }
    
    if(req.body.startDate !== "" && req.body.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.body.startDate, req.body.endDate)
    }

    query += " ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query, param);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send(error)
    }
}

exports.calender_search = async function(req, res){
    let query = `SELECT calender.*, ticker_list.stock_name\
                from calender INNER JOIN ticker_list ON calender.ticker_id=ticker_list.ID WHERE 1=1`
    let param = []

    if(req.body.stock_num_name !== ""){
        query += ` AND stock_num=?`
        param.push(req.body.stock_num_name.split(" ")[0])
    }
    if(req.body.startDate !== "" && req.body.endDate !== ""){
        query += ` AND date BETWEEN ? AND ?`
        param.push(req.body.startDate, req.body.endDate)
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
    if(req.body.pattern === ""){
        res.status(200).json({})
    }

    let query = `SELECT stock_name FROM ticker_list WHERE stock_name LIKE ? AND CHAR_LENGTH(stock_num)=4`
    let param = [`%${req.body.pattern}%`]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send({})
    }
}

exports.news_search = async function(req, res){
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

exports.news_search_today = async function(req, res){
    let query = `SELECT * FROM news WHERE date=?`
    let param = [req.query.date]

    if(req.query.category !== "全部"){
        query += " AND category=?"
        param.push(req.query.category)
    }

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

exports.news_search_past = async function(req, res){
    let query = `SELECT * FROM news WHERE date<?`
    let param = [req.query.date]

    if(req.query.category !== "全部"){
        query += " AND category=?"
        param.push(req.query.category)
    }

    query += " ORDER BY date DESC"

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
    let query = `SELECT COUNT(*) as todayQuantity FROM news WHERE date=?;\
                SELECT category, COUNT(category) as todayQuantity FROM news WHERE date=? GROUP BY category ORDER BY category;\
                SELECT COUNT(*) as pastQuantity FROM news WHERE date<?;\
                SELECT category, COUNT(category) as pastQuantity FROM news WHERE date<? GROUP BY category ORDER BY category;`
    let param = [req.query.date, req.query.date, req.query.date, req.query.date, req.query.date, req.query.date]
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
        { "ID" : 9, "category" : "經濟日報 證券 市場焦點", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 10, "category" : "經濟日報 證券 櫃買動態", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 11, "category" : "經濟日報 證券 權證特區", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 12, "category" : "經濟日報 證券 證券達人", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 13, "category" : "經濟日報 證券 集中市場", "todayQuantity" : 0, "pastQuantity" : 0 },
        { "ID" : 14, "category" : "財報狗", "todayQuantity" : 0, "pastQuantity" : 0 },
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

    if(req.query.investmentCompany !== ""){
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

exports.industry_search = async function(req, res){
    let query = `SELECT * FROM financialDataIndustry WHERE 1=1`
    let param = []

    if(req.query.startDate !== "" && req.query.endDate !== ""){
        query += " AND date BETWEEN ? AND ?"
        param.push(req.query.startDate, req.query.endDate)
    }

    if(req.query.pattern !== ""){
        query += " AND ?? LIKE ?"
	    param.push(req.query.column, `%${req.query.pattern}%`)
    }

    query += " ORDER BY date DESC"

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}