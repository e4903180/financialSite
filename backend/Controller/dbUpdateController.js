const con = require('../Model/connectFinancial')
const fs = require('fs');
const { config } = require('../constant');
const fsPromises = require('fs').promises;

exports.financial_recommend_update = async function(req, res){
    let query = "SELECT stock_num FROM ticker_list WHERE ID=?"
    let param = [req.body.ticker_id]
    let stock_num = -1

    try {
        const [rows, fields] = await con.promise().query(query, param);
        stock_num = rows[0]["stock_num"]

    } catch (error) {
        return res.status(400).send("error")
    }

    query = "UPDATE financialData SET recommend=? WHERE ticker_id=? AND \
                date=? AND investmentCompany=? AND filename=?"

    let info = req.body.filename.split("_")
    let new_filename = `${info[0]}_${info[1]}_${info[2]}_${info[3]}_${req.body.recommend}_${info[5]}`

    param = [req.body.recommend, req.body.ticker_id, req.body.date, 
            req.body.investmentCompany, new_filename]

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
    let query = "DELETE FROM financialData WHERE ID=?"
    let param = [req.body.ID]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success")
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.financialDataIndustry_title_update = async function(req, res){
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

exports.financialDataIndustry_delete = async function(req, res){
    let query = "DELETE FROM financialDataOther WHERE ID=?"
    let param = [req.body.ID]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success")
    } catch (error) {
        return res.status(400).send("error")
    }
}