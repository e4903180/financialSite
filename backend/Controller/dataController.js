const con = require('../Model/connectMySQL')

exports.newest15 = async function(req, res){
    let sql = "SELECT * FROM financialData ORDER BY `date` DESC Limit 15;"

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {

        return res.status(400).send("error")
    }
};

exports.allData = async function(req, res){
    let sql = "SELECT count( * ) as dataQuantity from financialData; select max(date) as newestDate from financialData;select count( * ) as dataQuantity from post_board_memo;select max(date) as newestDate from post_board_memo;select count( * ) as dataQuantity from lineMemo;select max(date) as newestDate from lineMemo;select count( * ) as dataQuantity from calender;select max(date) as newestDate from calender;"

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send([Object.assign({ "dbName" : "個股研究資料" }, rows[0][0], rows[1][0], {"downloadUrl" : "http://140.116.214.154:3000/api/data/download/financialData"}),
                                        Object.assign({ "dbName" : "個股推薦" }, rows[2][0], rows[3][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/post_board_memo" }),
                                        Object.assign({ "dbName" : "Line memo" }, rows[4][0], rows[5][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/lineMemo" }), 
                                        Object.assign({ "dbName" : "法說會" }, rows[6][0], rows[7][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/calender" })])
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.post_board_state = async function(req, res){
    let sql = "SELECT count( * ) as dataQuantity, max(date) as newestDate from post_board_memo;"

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows[0])
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.lineMemo_state = async function(req, res){
    let sql = "SELECT count( * ) as dataQuantity, max(date) as newestDate from lineMemo;"

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows[0])
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.superUser = async function(req, res){
    let sql = "SELECT superUser from user WHERE userName=?"
    let param = [req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(sql, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.meetingData = async function(req, res){
    let sql = "SELECT *, filename as fileName from meetingData;"

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }  
}

exports.industry_analysis = async function(req, res){
    let sql ="SELECT *, filename as fileName from industry_analysis;"

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.userList = async function(req, res){
    let sql ="SELECT name, userName, email FROM user"

    try {
        const [rows, fields] = await con.promise().query(sql);

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
    con.query("SELECT stockNum, stockName, Date from calender where year(date)=? AND month(date)=?;", [req.body.year, req.body.month] , function(err, result, field){
        let re = [];
        
        for(let i = 0; i < result.length; i++){
            re.push(Object.assign({"title" : result[i]["stockNum"] + " " + result[i]["stockName"]}, {"date" : result[i]["Date"]}))
        };
        
        if(err === null){
            return res.status(200).json(re)
        }else{
            return res.status(400).send("error")
        }
    })    
}

exports.calenderData = async function(req, res){
    con.query("SELECT * from calender where year(date)=? AND month(date)=?;", [req.body.year, req.body.month,] , function(err, result, field){
        if(err === null){
            return res.status(200).json(result)
        }else{
            return res.status(400).send("error")
        }
    })    
}

exports.tickerList = async function(req, res){
    con.query("SELECT ID, stock_name as stock_num_name from ticker_list", function(err, result, field){
        if(err === null){
            return res.status(200).json(result)
        }else{
            return res.status(400).send("error")
        }
    })    
}

exports.username = async function(req, res){
    return res.status(200).send(req.session.userName)
}