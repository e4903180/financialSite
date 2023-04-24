const con = require('../Model/connectFinancial')
const { config } = require('../constant');
const fsPromises = require('fs').promises;

exports.financial_recommend_update = async function(req, res){
    /*
        #swagger.tags = ['Update data']
        #swagger.description = 'Update financialData recommend.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Update financial recommend.',
            required: true,
            type: 'object',
            schema: {
                $ticker_id: "1",
                $filename: "2201_裕隆_20230420_統一投顧_買進_NULL.pdf",
                $recommend: "中立",
                $date: "2023-04-20",
                $investmentCompany: "統一投顧"
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT stock_num FROM ticker_list WHERE ID=?"
    let param = [req.body.ticker_id]
    let stock_num = -1

    try {
        const [rows, fields] = await con.promise().query(query, param);
        stock_num = rows[0]["stock_num"]

    } catch (error) {
        return res.status(400).send("error")
    }

    query = "UPDATE financialData SET recommend=?, filename=? WHERE ticker_id=? AND \
            date=? AND investmentCompany=?"

    let info = req.body.filename.split("_")
    let new_filename = `${info[0]}_${info[1]}_${info[2]}_${info[3]}_${req.body.recommend}_${info[5]}`

    param = [req.body.recommend, new_filename, req.body.ticker_id, req.body.date, 
            req.body.investmentCompany]

    try {
        const [rows, fields] = await con.promise().query(query, param);
        fsPromises.rename(`${config["FINANCIALDATA_PATH"]}${stock_num}/${req.body.filename}`, 
                        `${config["FINANCIALDATA_PATH"]}${stock_num}/${new_filename}`)

        return res.status(200).send("success")
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.financial_delete = async function(req, res){
    /*
        #swagger.tags = ['Delete data from table']
        #swagger.description = 'Delete data from financialData.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Ticker id.',
            required: true,
            type: 'object',
            schema: {
                $ID: "1",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "DELETE FROM financialData WHERE ID=?"
    let param = [req.body.ID]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success")
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.financialDataOther_title_update = async function(req, res){
    /*
        #swagger.tags = ['Update data']
        #swagger.description = 'Update financialDataOther title.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Filter parameter.',
            required: true,
            type: 'object',
            schema: {
                $title: "【永豐投顧】Netflix（NFLX US）：延遲打擊共享帳戶全面推出時間_20230419",
                $date: "2023-04-18",
                $investmentCompany: "永豐投顧",
                $filename: "歐美個股點評04192023-Netflix（NFLX US ).pdf",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "UPDATE financialDataOther SET title=? WHERE date=? AND \
                investmentCompany=? AND filename=?"

    let param = [req.body.title, req.body.date, req.body.investmentCompany, req.body.filename]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success")
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.financialDataOther_delete = async function(req, res){
    /*
        #swagger.tags = ['Delete data from table']
        #swagger.description = 'Delete data from financialDataOther.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Ticker id.',
            required: true,
            type: 'object',
            schema: {
                $ID: "1",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */

    let query = "DELETE FROM financialDataOther WHERE ID=?"
    let param = [req.body.ID]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success")
    } catch (error) {
        return res.status(400).send("error")
    }
}