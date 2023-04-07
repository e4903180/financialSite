const con = require('../../Model/connectFinancial')
const { config } = require('../../constant');

exports.single_financialData_download = async function(req, res){
    const filename = req.query.filename;
    let query = `SELECT ticker_list.stock_num FROM financialData \
                INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID WHERE filename=?`
    let param = [filename]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        res.download(config["FINANCIALDATA_PATH"] + rows[0].stock_num + "/" + filename)
    } catch (error) {
        return res.status(400).send(error)
    }
};

exports.single_financialDataOther_download = function(req, res){
    res.download(config["FINANCIALDATAOTHER_PATH"] + req.query.filename)
};

exports.single_financialDataIndustry_download = function(req, res){
    res.download(config["FINANCIALDATAINDUSTRY_PATH"] + req.query.filename)
};

exports.single_post_board_memo_download = function(req, res){
    res.download(config["POST_BOARD_MEMO_PATH"] + req.query.filename)
};

exports.single_line_memo_download = function(req, res){
    res.download(config["LINE_MEMO_PATH"] + req.query.filename)
};

exports.table_status = async function(req, res){
    res.download(config["CSV_PATH"] + req.query.table_name)
};

exports.single_meetingData_memo_download = function(req, res){
    res.download(config["MEETING_DATA_MEMO_PATH"] + req.query.filename)
};

exports.single_industry_analysis_download = function(req, res){
    res.download(config["INDUSTRY_ANALYSIS_PATH"] + req.query.filename.replace("percentTransform", "%"))
};

exports.single_twse_chPDF_download = function(req, res){
    const filename = req.query.filename;

    res.download(config["TWSE_CHPDF_PATH"] + filename.slice(0, 4) + "/" + filename)
};

exports.single_twse_enPDF_download = function(req, res){
    const filename = req.query.filename;

    res.download(config["TWSE_ENPDF_PATH"] + filename.slice(0, 4) + "/" + filename)
};