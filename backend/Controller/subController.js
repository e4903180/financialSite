const con = require('../Model/connectFinancial')

exports.handle_support_resistance_sub = async function(req, res){
    /*
        #swagger.tags = ['Subscribe']
        #swagger.description = 'Subscribe support resistance strategy.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Support resistance strategy param.',
            required: true,
            type: 'object',
            schema: {
                $stock_num: "2330",
                $startDate: "2023-08-05",
                $endDate: "2023-08-06",
                $maLen: "20",
                $maType: "sma",
                $method: "method1",
                $alertCondition: "突破天花板線",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    var userName = req.session.userName
    var stock_num = req.body.stockNum
    var startDate = req.body.startDate
    var endDate = req.body.endDate
    var maLen = req.body.maLen
    var maType = req.body.maType
    var method = req.body.method
    var alertCondition = req.body.alertCondition
    var Today = new Date();

    var year = Today.getFullYear().toString()
    var month = (Today.getMonth() + 1).toString().padStart(2, '0');
    var day = Today.getDate().toString().padStart(2, '0');
    var hour = Today.getHours().toString().padStart(2, '0');
    var min = Today.getMinutes().toString().padStart(2, '0');
    var sec = Today.getSeconds().toString().padStart(2, '0');
    var Time = `${year}-${month}-${day} ${hour}:${min}:${sec}`
    let query = `SELECT COUNT(*) as dataQuantity FROM subscribe INNER JOIN ticker_list ON subscribe.ticker_id=ticker_list.ID \
                WHERE username=? AND endTime=? AND stock_num=? AND content=? AND strategy=? AND alertCondition=?`
    let param = [userName, endDate, stock_num, "歷史資料起始日" + startDate + "_" + maLen + maType + "_" + method, "天花板地板線", alertCondition]
    
    try {
        const [rows, fields] = await con.promise().query(query, param);

        if(rows[0]["dataQuantity"] != 0){
            return res.status(401).send("same")
        }
    } catch (error) {
        return res.status(400).send("error")
    }

    let key = -1

    query = `SELECT ID FROM ticker_list WHERE stock_num=?`
    param = [stock_num]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        key = rows[0]["ID"]
    } catch (error) {
        return res.status(400).send("error")
    }
    
    query = `INSERT INTO subscribe (username, subTime, endTime, ticker_id, content, strategy, alertCondition) VALUES (?, ?, ?, ?, ?, ?, ?)`
    param = [userName, Time, endDate, key, "歷史資料起始日" + startDate + "_" + maLen + maType + "_" + method, "天花板地板線", alertCondition]

    try {
        const [rows, fields] = await con.promise().query(query, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    return res.status(200).send("success")
}

exports.handle_pricing_strategy_sub = async function(req, res){
    /*
        #swagger.tags = ['Subscribe']
        #swagger.description = 'Subscribe pricing strategy.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Pricing strategy param.',
            required: true,
            type: 'object',
            schema: {
                $stock_num: "2330",
                $startYear: "10",
                $endDate: "2023-08-06",
                $alertCondition: "低於便宜價",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    var userName = req.session.userName
    var stock_num = req.body.stockNum
    var startYear = req.body.startYear
    var endDate = req.body.endDate
    var alertCondition = req.body.alertCondition
    var Today = new Date();

    var year = Today.getFullYear().toString()
    var month = (Today.getMonth() + 1).toString().padStart(2, '0');
    var day = Today.getDate().toString().padStart(2, '0');
    var hour = Today.getHours().toString().padStart(2, '0');
    var min = Today.getMinutes().toString().padStart(2, '0');
    var sec = Today.getSeconds().toString().padStart(2, '0');
    var Time = `${year}-${month}-${day} ${hour}:${min}:${sec}`

    let query = `SELECT COUNT(*) as dataQuantity FROM subscribe INNER JOIN ticker_list ON subscribe.ticker_id=ticker_list.ID \
                WHERE username=? AND endTime=? AND stock_num=? AND content=? AND strategy=? AND alertCondition=?`
    let param = [userName, endDate, stock_num, "歷史幾年資料" + startYear, "股票定價策略", alertCondition]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        if(rows[0]["dataQuantity"] != 0){
            return res.status(401).send("same")
        }
    } catch (error) {
        return res.status(400).send("error")
    }

    let key = -1

    query = `SELECT ID FROM ticker_list WHERE stock_num=?`
    param = [stock_num]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        key = rows[0]["ID"]
    } catch (error) {
        return res.status(400).send("error")
    }
    
    query = `INSERT INTO subscribe (username, subTime, endTime, ticker_id, content, strategy, alertCondition) VALUES (?, ?, ?, ?, ?, ?, ?)`
    param = [userName, Time, endDate, key, "歷史幾年資料" + startYear, "股票定價策略", alertCondition]
    
    try {
        const [rows, fields] = await con.promise().query(query, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    return res.status(200).send("success")
}

exports.handle_per_river_sub = async function(req, res){
    /*
        #swagger.tags = ['Subscribe']
        #swagger.description = 'Subscribe per river strategy.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Per river strategy param.',
            required: true,
            type: 'object',
            schema: {
                $stock_num: "2330",
                $endDate: "2023-08-06",
                $alertCondition: "低於便宜價",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    var userName = req.session.userName
    var stock_num = req.body.stockNum
    var endDate = req.body.endDate
    var alertCondition = req.body.alertCondition
    var Today = new Date();

    var year = Today.getFullYear().toString()
    var month = (Today.getMonth() + 1).toString().padStart(2, '0');
    var day = Today.getDate().toString().padStart(2, '0');
    var hour = Today.getHours().toString().padStart(2, '0');
    var min = Today.getMinutes().toString().padStart(2, '0');
    var sec = Today.getSeconds().toString().padStart(2, '0');
    var Time = `${year}-${month}-${day} ${hour}:${min}:${sec}`

    let query = `SELECT COUNT(*) as dataQuantity FROM subscribe INNER JOIN ticker_list ON subscribe.ticker_id=ticker_list.ID \
                WHERE username=? AND endTime=? AND stock_num=? AND strategy=? AND alertCondition=?`
    let param = [userName, endDate, stock_num, "本益比河流圖", alertCondition]
    
    try {
        const [rows, fields] = await con.promise().query(query, param);

        if(rows[0]["dataQuantity"] != 0){
            return res.status(401).send("same")
        }
    } catch (error) {
        return res.status(400).send("error")
    }

    let key = -1

    query = `SELECT ID FROM ticker_list WHERE stock_num=?`
    param = [stock_num]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        key = rows[0]["ID"]
    } catch (error) {
        return res.status(400).send("error")
    }
    
    query = `INSERT INTO subscribe (username, subTime, endTime, ticker_id, content, strategy, alertCondition) VALUES (?, ?, ?, ?, ?, ?, ?)`
    param = [userName, Time, endDate, key, "", "本益比河流圖", alertCondition]

    try {
        const [rows, fields] = await con.promise().query(query, param);
    } catch (error) {
        return res.status(400).send("error")
    }

    return res.status(200).send("success")
}

exports.get_sub = async function(req, res){
    /*
        #swagger.tags = ['Subscribe']
        #swagger.description = 'Get subscribe.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `SELECT subscribe.ID, ticker_list.stock_name, subscribe.endTime, subscribe.subTime, subscribe.content, subscribe.strategy, subscribe.alertCondition FROM subscribe \
                INNER JOIN ticker_list ON subscribe.ticker_id=ticker_list.ID WHERE username=?`
    let param = [req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(query, param);
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.delete_sub = async function(req, res){
    /*
        #swagger.tags = ['Subscribe']
        #swagger.description = 'Delete subscribe.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Delete subscribe parameter.',
            required: true,
            type: 'object',
            schema: {
                $subTime: "",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `DELETE FROM subscribe WHERE username = ? AND subTime = ?`
    let param = [req.session.userName, req.body.subTime]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {

        return res.status(400).send("error")
    }
}

exports.get_user_notify_type = async function(req, res){
    /*
        #swagger.tags = ['Subscribe']
        #swagger.description = 'Get user notify type.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `SELECT lineNotify, emailNotify FROM user WHERE userName=?`
    let param = [req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {

        return res.status(400).send("error")
    }
}

exports.update_user_lineNotify_type = async function(req, res){
    /*
        #swagger.tags = ['Subscribe']
        #swagger.description = 'Update line notify.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Switch on off.',
            required: true,
            type: 'object',
            schema: {
                $switch: "1",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `UPDATE user SET lineNotify=? WHERE userName=?`
    let param = [req.body.switch, req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success")
    } catch (error) {

        return res.status(400).send("error")
    }
}

exports.update_user_emailNotify_type = async function(req, res){
    /*
        #swagger.tags = ['Subscribe']
        #swagger.description = 'Update email notify.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Switch on off.',
            required: true,
            type: 'object',
            schema: {
                $switch: "1",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = `UPDATE user SET emailNotify=? WHERE userName=?`
    let param = [req.body.switch, req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success")
    } catch (error) {

        return res.status(400).send("error")
    }
} 