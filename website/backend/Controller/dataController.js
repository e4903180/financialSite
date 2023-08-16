const con = require('../Model/connectFinancial');
const { init_table_status } = require('../constant');

exports.newestResearch20 = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get newest 20 ticker research.'
    */
    let query = "SELECT financialData.*, ticker_list.stock_name \
                FROM financialData INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID ORDER BY \
                financialData.date DESC, ticker_list.stock_name ASC, financialData.investmentCompany DESC, \
                financialData.recommend ASC, ticker_list.stock_name ASC Limit 20;\
                SELECT * FROM financialDataOther ORDER BY `date` DESC Limit 20;"

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

exports.superUser = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Check if user is super user.'
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

exports.username = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get username.'
    */
    return res.status(200).send(req.session.userName)
}

exports.popular_ticker = async function(req, res){
    /*
        #swagger.tags = ['Get data']
        #swagger.description = 'Get popular ticker.'
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