const con = require('../Model/connectMySQL')
let { PythonShell } = require('python-shell')

exports.newest15 = async function(req, res){
    con.query("SELECT * FROM financialData ORDER BY `date` DESC Limit 15", function(err, result, field){
        if(err === null){
            return res.status(200).json(result)
        }else{
            return res.status(400).send("error")
        }
    });
};

exports.allData = async function(req, res){
    con.query("select count( * ) as dataQuantity from financialData; select max(date) as newestDate from financialData;select count( * ) as dataQuantity from post_board_memo;select max(date) as newestDate from post_board_memo;select count( * ) as dataQuantity from lineMemo;select max(date) as newestDate from lineMemo;select count( * ) as dataQuantity from calender;select max(date) as newestDate from calender;", function(err, result, field){
        if(err === null){
            return res.status(200).json([Object.assign({ "dbName" : "個股研究資料" }, result[0][0], result[1][0], {"downloadUrl" : "http://140.116.214.154:3000/api/data/download/financialData"}),
                                        Object.assign({ "dbName" : "個股推薦" }, result[2][0], result[3][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/post_board_memo" }),
                                        Object.assign({ "dbName" : "Line memo" }, result[4][0], result[5][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/lineMemo" }), 
                                        Object.assign({ "dbName" : "法說會" }, result[6][0], result[7][0], { "downloadUrl" : "http://140.116.214.154:3000/api/data/download/calender" })])
        }else{
            console.log(err)
            return res.status(400).send("error")
        }
    });
};

exports.DbFinancialSearch = async function(req, res){
    let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`

    if(req.body.stockName_or_Num.length !== 0){
        var pattern = new RegExp(/\d{4}/)
        sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
    }

    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
    if(req.body.investmentCompany !== "") sql += ` AND investmentCompany='${req.body.investmentCompany}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.Db_post_board_memoSearch = async function(req, res){
    let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`

    if(req.body.stockName_or_Num.length !== 0){
        var pattern = new RegExp(/\d{4}/)
        sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
    }

    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.DbLineMemoSearch = async function(req, res){
    let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`

    if(req.body.stockName_or_Num.length !== 0){
        var pattern = new RegExp(/\d{4}/)
        sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
    }

    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.DbCalenderSearch = async function(req, res){
    let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`

    if(req.body.stockName_or_Num.length !== 0){
        var pattern = new RegExp(/\d{4}/)
        sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
    }

    if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate)}' AND '${(req.body.endDate)}'`

    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

// exports.dbSearch = async function(req, res){
//     if(req.body.stockName_or_Num.length == 0 && req.body.startDate == "" && req.body.endDate == "" && req.body.investmentCompany == ""){
//         let sql = `SELECT * FROM ${req.body.dbTable}`

//         con.query(sql,function(err, result, field){
//             if(err === null){
//                 return res.status(200).json(result)
//             }else{
//                 return res.status(400).send("error")
//             }
//         });
//     }else{
//         var pattern = new RegExp(/\d{4}/)
//         let sql = `SELECT * FROM ${req.body.dbTable} WHERE 1=1`
    
//         if(req.body.stockName_or_Num.length !== 0) sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
        
//         if(req.body.startDate !== "" && req.body.endDate !== ""){
//             if(req.body.dbTable !== "calender") sql += ` AND date BETWEEN '${(req.body.startDate)}' AND '${(req.body.endDate)}'`
//             else sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
//         } 

//         if(req.body.investmentCompany !== "") sql += ` AND investmentCompany='${req.body.investmentCompany}'`

//         con.query(sql, function(err, result, field){
//             if(err === null){
//                 return res.status(200).json(result)
//             }else{
//                 return res.status(400).json({})
//             }
//         });
//     }
// };

// exports.autoCom = function(req, res){
//     con.query("select * from autocompletedSearch", function(err, result, field){
//         if(err === null){
//             return res.status(200).json(result)
//         }else{
//             return res.status(400).send("error")
//         }
//     });
// };

exports.post_board_state = function(req, res){
    con.query("select count( * ) as dataQuantity from post_board_memo;select max(date) as newestDate from post_board_memo;", function(err, result, field){
        if(err === null){
            return res.status(200).json(Object.assign(result[0][0], result[1][0]))
        }else{
            return res.status(400).send("error")
        }
    })
}

exports.post_board_search = function(req, res){
    if(req.body.stockName_or_Num == "" && req.body.startDate == "" && req.body.endDate == "" && req.body.recommend == "" && req.body.provider == ""){
        let sql = `SELECT * FROM post_board_memo`

        con.query(sql,function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).send("error")
            }
        });
    }else{
        var pattern = new RegExp(/\d{4}/)
        let sql = `SELECT * FROM post_board_memo WHERE 1=1`

        if(req.body.stockName_or_Num.length !== 0)sql += ` AND stockNum='${pattern.exec(req.body.stockName_or_Num[0].stock_num_name)[0]}'`
        if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
        if(req.body.recommend !== "") sql += ` AND evaluation='${req.body.recommend}'`
        if(req.body.provider !== "") sql += ` AND username='${req.body.provider}'`
    
        con.query(sql,function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).json({})
            }
        });

    }
}

exports.lineMemo_state = function(req, res){
    con.query("select count( * ) as dataQuantity from lineMemo;select max(date) as newestDate from lineMemo;", function(err, result, field){
        if(err === null){
            return res.status(200).json(Object.assign(result[0][0], result[1][0]))
        }else{
            return res.status(400).send("error")
        }
    })
}

exports.lineMemo_search = function(req, res){
    if(req.body.stock_num_name.length == 0 && req.body.startDate == "" && req.body.endDate == "" && req.body.recommend == "" && req.body.provider == ""){
        let sql = `SELECT * FROM lineMemo`

        con.query(sql, function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).send("error")
            }
        });
    }else{
        let sql = `SELECT * FROM lineMemo WHERE 1=1`

        if(req.body.stock_num_name.length != 0)sql += ` AND stockNum='${req.body.stock_num_name[0].stock_num_name.slice(0, 4)}'`
        if(req.body.startDate !== "" && req.body.endDate !== "") sql += ` AND date BETWEEN '${(req.body.startDate).replace(/-/g, "_")}' AND '${(req.body.endDate).replace(/-/g, "_")}'`
    
        con.query(sql, function(err, result, field){
            if(err === null){
                return res.status(200).json(result)
            }else{
                return res.status(400).json({})
            }
        });

    }
}

exports.superUser = async function(req, res){
    con.query("SELECT superUser from user WHERE userName=?", [req.session.userName], function(err, result, field){
        if(err === null){
            return res.status(200).send(result)
        }else{
            return res.status(400).send("error")
        }
    })    
}

exports.meetingData = async function(req, res){
    con.query("SELECT * from meetingData;SELECT filename as fileName from meetingData", function(err, result, field){
        let re = [];
        for(let i = 0; i < result[0].length; i++){
            re.push(Object.assign(result[0][i], result[1][i]))
        };

        if(err === null){
            return res.status(200).json(re)
        }else{
            return res.status(400).send("error")
        }
    })    
}

exports.industry_analysis = async function(req, res){
    con.query("SELECT * from industry_analysis;SELECT filename as fileName from industry_analysis", function(err, result, field){
        let re = [];
        for(let i = 0; i < result[0].length; i++){
            re.push(Object.assign(result[0][i], result[1][i]))
        };

        if(err === null){
            return res.status(200).json(re)
        }else{
            return res.status(400).send("error")
        }
    })    
}

exports.userList = async function(req, res){
    con.query("SELECT name from user;SELECT userName from user;SELECT email from user", function(err, result, field){
        let re = [];
        for(let i = 0; i < result[0].length; i++){
            re.push(Object.assign(result[0][i], result[1][i], result[2][i]))
        };

        // if(re.length % 8 != 0){
        //     const range = 8 - (re.length % 8)
        //     for(let i = 0; i < range; i++){
        //         re.push({"name" : "", "userName" : "", "email" : ""})
        //     };
        // }

        if(err === null){
            return res.status(200).json(re)
        }else{
            return res.status(400).send("error")
        }
    })    
}

exports.calender = async function(req, res){
    con.query("SELECT stockNum from calender where year(date)=? AND month(date)=?;SELECT stockName from calender where year(date)=? AND month(date)=?;SELECT Date from calender where year(date)=? AND month(date)=?;", [req.body.year, req.body.month, req.body.year, req.body.month, req.body.year, req.body.month] , function(err, result, field){
        let re = [];
        for(let i = 0; i < result[0].length; i++){
            re.push(Object.assign({"title" : result[0][i].stockNum + result[1][i].stockName}, {"date" : result[2][i].Date}))
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

exports.pricingData = async function(req, res){
    let options = {
        args:[
                req.body.stockNum,
                req.body.year
            ]
    }
    console.log(options)
    
    const result = await new Promise((resolve, reject) => {
        PythonShell.run('/home/cosbi/financialSite/backend/PythonTool/StockPriceDecision.py', options, (err, data) => {
            if (err) reject(err)
            const parsedString = JSON.parse(data)
            return resolve(parsedString);
        })
    })

    return res.status(200).send(result)
}

exports.PER_river_Data = async function(req, res){
    let options = {
        args:[
                req.body.stockNum,
                "MONTH"
            ]
    }
    
    const result = await new Promise((resolve, reject) => {
        PythonShell.run('/home/cosbi/financialSite/backend/PythonTool/PER_River.py', options, (err, data) => {
            if (err) reject(err)
            const parsedString = JSON.parse(data)

            if(data["error"]){
                reject(data["error"])
            }else{
                return resolve(parsedString);
            }
        })
    })

    return res.status(200).send(result)
}

exports.support_resistance_data = async function(req, res){
    let options = {
        args:[
                req.body.stockNum,
                req.body.startDate,
                req.body.ma_type,
                req.body.maLen,
                req.body.method,
            ]
    }

    const result = await new Promise((resolve, reject) => {
        PythonShell.run('/home/cosbi/financialSite/backend/PythonTool/SupportResistance.py', options, (err, data) => {
            if (err) reject(err)

            const parsedString = JSON.parse(data)
            return resolve(parsedString);
        })
    })

    return res.status(200).send(result)
}

exports.handle_support_resistance_sub = async function(req, res){
    var userName = req.session.userName
    var stock_num = req.body.stockNum
    var startDate = req.body.startDate
    var endDate = req.body.endDate
    var maLen = req.body.maLen
    var maType = req.body.maType
    var method = req.body.method
    var subType = req.body.subType
    var Today = new Date();

    var year = Today.getFullYear().toString()
    var month = (Today.getMonth() + 1).toString().padStart(2, '0');
    var day = Today.getDate().toString().padStart(2, '0');
    var hours = Today.getHours().toString().padStart(2, '0');
    var minutes = Today.getMinutes().toString().padStart(2, '0');
    var seconds = Today.getSeconds().toString().padStart(2, '0');
    var Time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds

    let sql = `SELECT * FROM subscribe WHERE username = "${userName}" AND endTime = "${endDate}" AND ticker = "${stock_num}" AND subType = "${subType}" AND content = "天花板地板線_歷史資料起始日${startDate}_${maLen}${maType}_方法${method[6]}"`
    try {
        const [rows, fields] = await con.promise().query(sql);

        if(rows.length != 0){
            return res.status(401).send("same")
        }
    } catch (error) {
        return res.status(400).send("error")
    }

    sql = `SELECT * FROM user_sub WHERE username = "${userName}"`
    try {
        const [rows, fields] = await con.promise().query(sql);

        if(rows.length == 0){
            sql = `INSERT INTO user_sub (username, quantity) VALUES ("${userName}", 1)`
        }else{
            sql = `UPDATE user_sub SET quantity = ${rows[0]["quantity"] + 1} WHERE username = "${userName}"`
        }

        const [rows1, fields1] = await con.promise().query(sql);
    } catch (error) {
        return res.status(400).send("error")
    }

    sql = `INSERT INTO subscribe (username, subTime, endTime, ticker, subType, content) VALUES ("${userName}", "${Time}", "${endDate}", "${stock_num}", "${subType}", "天花板地板線_歷史資料起始日${startDate}_${maLen}${maType}_方法${method[6]}")`
    try {
        const [rows, fields] = await con.promise().query(sql);
    } catch (error) {
        return res.status(400).send("error")
    }

    res.status(200).send("success")
}

exports.get_support_resistance_sub = async function(req, res){
    var userName = req.session.userName

    let sql = `SELECT * FROM subscribe`
    try {
        const [rows, fields] = await con.promise().query(sql);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.delete_sub = async function(req, res){
    var userName = req.session.userName
    var subTime = req.body.subTime

    let sql = `DELETE FROM subscribe WHERE username = "${userName}" AND subTime = "${subTime}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        sql = `SELECT * FROM user_sub WHERE username = "${userName}"`
        const [rows1, fields1] = await con.promise().query(sql);

        if(rows1[0]["quantity"] == 1){
            sql = `DELETE FROM user_sub WHERE username = "${userName}"`
        }else{
            sql = `UPDATE user_sub SET quantity = ${rows1[0]["quantity"] - 1} WHERE username = "${userName}"`
        }

        const [rows2, fields2] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {

        return res.status(400).send("error")
    }
}

exports.notify_all = async function(req, res){
    var userName = req.session.userName

    let sql = `SELECT * FROM notify WHERE username="${userName}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.notify_read = async function(req, res){
    var userName = req.session.userName

    let sql = "SELECT * FROM notify WHERE `username`= " + `"${userName}"` + " AND `read`=1" 

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.notify_handle_read = async function(req, res){
    var userName = req.session.userName
    const time = req.body.time

    let sql = "UPDATE notify SET " + "`read`=1" + ` WHERE notifyTime="${time}" AND username=` + `"${userName}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.notify_handle_unread = async function(req, res){
    var userName = req.session.userName
    const time = req.body.time

    let sql = "UPDATE notify SET " + "`read`=0" + ` WHERE notifyTime="${time}" AND username=` + `"${userName}"`

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.get_realtime_price = async function(req, res){
    let options = {
        args:[
                req.query.tickerList.toString()
        ]
    }

    const result = await new Promise((resolve, reject) => {
        PythonShell.run('/home/cosbi/financialSite/backend/PythonTool/RealTimePrice.py', options, (err, data) => {
            if (err) reject(err)

            const parsedString = JSON.parse(data)
            return resolve(parsedString);
        })
    })

    return res.status(200).send(result)
}

exports.get_notify_quantity = async function(req, res){
    var userName = req.session.userName

    let sql = "SELECT COUNT(*) FROM notify WHERE `username`= " + `"${userName}"` + "AND `read`=0"

    try {
        const [rows, fields] = await con.promise().query(sql);

        return res.status(200).send(rows[0]['COUNT(*)'].toString())
    } catch (error) {
        return res.status(400).send("error")
    }
}