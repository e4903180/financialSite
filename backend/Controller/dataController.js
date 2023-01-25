const con = require('../Model/connectFinancial')

exports.newest15 = async function(req, res){
    let query = "SELECT financialData.*, ticker_list.stock_name \
    FROM financialData INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID ORDER BY `date` DESC Limit 15;"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows)
    } catch (error) {

        return res.status(400).send("error")
    }
};

exports.allData = async function(req, res){
    let query = "SELECT COUNT( * ) as dataQuantity FROM financialData; SELECT MAX(date) as newestDate FROM financialData;\
    SELECT COUNT( * ) as dataQuantity FROM post_board_memo;SELECT MAX(date) as newestDate FROM post_board_memo;\
    SELECT COUNT( * ) as dataQuantity FROM lineMemo;SELECT MAX(date) as newestDate FROM lineMemo;\
    SELECT COUNT( * ) as dataQuantity FROM calender;SELECT MAX(date) as newestDate FROM calender;"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send([Object.assign({ "dbName" : "個股研究資料" }, rows[0][0], rows[1][0], {"downloadUrl" : "http://140.116.214.154:3000/api/data/download/financialData"}),
                                        Object.assign({ "dbName" : "個股推薦" }, rows[2][0], rows[3][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/post_board_memo" }),
                                        Object.assign({ "dbName" : "Line memo" }, rows[4][0], rows[5][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/lineMemo" }), 
                                        Object.assign({ "dbName" : "法說會" }, rows[6][0], rows[7][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/calender" })])
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.post_board_state = async function(req, res){
    let query = "SELECT COUNT( * ) as dataQuantity, MAX(date) as newestDate FROM post_board_memo;"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows[0])
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.lineMemo_state = async function(req, res){
    let query = "SELECT COUNT( * ) as dataQuantity, MAX(date) as newestDate FROM lineMemo;"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows[0])
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.superUser = async function(req, res){
    let query = "SELECT superUser FROM user WHERE userName=?"
    let param = [req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.meetingData = async function(req, res){
    let query = "SELECT *, filename as fileName FROM meetingData;"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }  
}

exports.industry_analysis = async function(req, res){
    let query ="SELECT *, filename as fileName FROM industry_analysis;"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.userList = async function(req, res){
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
    let query = "SELECT stock_name, date FROM calender INNER JOIN ticker_list ON calender.ticker_id=ticker_list.ID WHERE year(date)=? AND month(date)=?;"
    let param = [req.body.year, req.body.month]
    let re = [];

    try {
        const [rows, fields] = await con.promise().query(query, param);

        for(let i = 0; i < rows.length; i++){
            re.push(Object.assign({"title" : rows[i]["stock_name"]}, {"date" : rows[i]["date"]}))
        };

        return res.status(200).json(re)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.calenderData = async function(req, res){
    let query = "SELECT calender.*, ticker_list.stock_name\
        FROM calender INNER JOIN ticker_list ON calender.ticker_id=ticker_list.ID WHERE YEAR(date)=? AND MONTH(date)=?;"
    let param = [req.body.year, req.body.month]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).json(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.tickerList = async function(req, res){
    let query = "SELECT ID, stock_name as stock_num_name FROM ticker_list"

    try {
        const [rows, fields] = await con.promise().query(query);

        return res.status(200).json(rows)
    } catch (error) {
        return res.status(400).send("error")
    } 
}

exports.news = async function(req, res){
    let query = "SELECT * FROM news WHERE date=(SELECT MAX(date) FROM news) ORDER BY category DESC"

    try {
        const [rows, fields] = await con.promise().query(query);
        
        for(let i = 0; i < rows.length; i++){
            rows[i]["title"] = [rows[i]["title"], rows[i]["link"]]
            delete rows[i]["link"]
        }

        return res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        return res.status(400).send("error")
    } 
}

exports.username = async function(req, res){
    return res.status(200).send(req.session.userName)
}