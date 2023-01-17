const con = require('../Model/connectFinancial')
const { Parser } = require('json2csv');
const iconv = require('iconv-lite');
const fs = require('fs');

function createCSV(path, data){
    const fields = Object.keys(data[0])
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(data);
    var newCsv = iconv.encode(csv, 'BIG5');

    fs.writeFileSync(path, newCsv);

    return path
}

exports.single_financialData_download = async function(req, res){
    const filename = req.query.filename;
    let query = `SELECT ticker_list.stock_num FROM financialData INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID WHERE filename=?`
    let param = [filename]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        res.download("/home/cosbi/桌面/financialData/gmailData/data/" + rows[0].stock_num + "/" + filename)
    } catch (error) {
        return res.status(400).send(error)
    }
};

exports.single_post_board_memo_download = function(req, res){
    res.download("/home/cosbi/桌面/financialData/post_board_data/" + req.query.filename)
};

exports.single_line_memo_download = function(req, res){
    res.download("/home/cosbi/桌面/financialData/lineMemo_data/" + req.query.filename)
};

exports.financialData2csv_download = async function(req, res){
    let query = `SELECT * FROM financialData`

    try {
        const [rows, fields] = await con.promise().query(query);

        const path = createCSV('/home/cosbi/桌面/financialData/financialData.csv', rows)
        res.download(path)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.post_board_memo2csv_download = async function(req, res){
    let query = `SELECT * FROM post_board_memo`

    try {
        const [rows, fields] = await con.promise().query(query);

        const path = createCSV('/home/cosbi/桌面/financialData/post_board_memo.csv', rows)
        res.download(path)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.lineMemo2csv_download = async function(req, res){
    let query = `SELECT * FROM lineMemo`

    try {
        const [rows, fields] = await con.promise().query(query);

        const path = createCSV('/home/cosbi/桌面/financialData/lineMemo.csv', rows)
        res.download(path)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.calender2csv_download = async function(req, res){
    let query = `SELECT * FROM calender`

    try {
        const [rows, fields] = await con.promise().query(query);

        const path = createCSV('/home/cosbi/桌面/financialData/calender.csv', rows)
        res.download(path)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.single_meetingData_memo_download = function(req, res){
    res.download("/home/cosbi/桌面/financialData/meeting_data/" + req.query.filename)
};

exports.single_industry_analysis_download = function(req, res){
    res.download("/home/cosbi/桌面/financialData/Industry_analysis/" + req.query.filename.replace("percentTransform", "%"))
};

exports.single_twse_chPDF_download = function(req, res){
    const filename = req.query.filename;

    res.download("/home/cosbi/桌面/financialData/twseData/data/ch/" + filename.slice(0, 4) + "/" + filename)
};

exports.single_twse_enPDF_download = function(req, res){
    const filename = req.query.filename;

    res.download("/home/cosbi/桌面/financialData/twseData/data/en/" + filename.slice(0, 4) + "/" + filename)
};