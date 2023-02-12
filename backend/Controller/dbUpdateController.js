const con = require('../Model/connectFinancial')

exports.financial_recommend_update = async function(req, res){
    let query = "UPDATE financialData SET recommend=? WHERE ticker_id=? AND \
    date=? AND investmentCompany=? AND filename=?"

    let param = [req.body.recommend, req.body.ticker_id, req.body.date, req.body.investmentCompany, req.body.filename]

    try {
        const [rows, fields] = await con.promise().query(query, param);

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
    let query = "UPDATE financialDataIndustry SET title=? WHERE date=? AND \
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
    let query = "DELETE FROM financialDataIndustry; WHERE ID=?"
    let param = [req.body.ID]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send("success")
    } catch (error) {
        return res.status(400).send("error")
    }
}