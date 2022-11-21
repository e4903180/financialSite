const con = require('../Model/connectMySQL')

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

exports.post_board_state = function(req, res){
    con.query("select count( * ) as dataQuantity from post_board_memo;select max(date) as newestDate from post_board_memo;", function(err, result, field){
        if(err === null){
            return res.status(200).json(Object.assign(result[0][0], result[1][0]))
        }else{
            return res.status(400).send("error")
        }
    })
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
            re.push(Object.assign({"title" : result[0][i].stockNum + " " + result[1][i].stockName}, {"date" : result[2][i].Date}))
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
    con.query("SELECT ticker from ticker_list", function(err, result, field){
        if(err === null){
            let temp = []

            for(let i = 0; i < result.length; i++){
                temp.push(result[i]["ticker"])

                if(i === result.length - 1){
                    return res.status(200).json(temp)
                }
            }
            
        }else{
            return res.status(400).send("error")
        }
    })    
}


exports.username = async function(req, res){
    return res.status(200).send(req.session.userName)
}