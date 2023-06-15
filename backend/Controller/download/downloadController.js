const { config } = require('../../constant');

exports.single_financialData_download = async function(req, res){
    /*
        #swagger.tags = ['File download']
        #swagger.description = 'Download ticker research pdf.'

        #swagger.parameters['filename'] = {
            in: 'query',
            description: 'Filename about ticker research pdf.',
            required: true,
            type: 'string',
            schema: "6277_宏正_20230419_宏遠_區間操作_NULL.pdf"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    const stock_num = req.query.filename.split("_")[0]
    
    try {
        res.download(config["FINANCIALDATA_PATH"] + stock_num + "/" + req.query.filename)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.single_financialDataOther_download = function(req, res){
    /*
        #swagger.tags = ['File download']
        #swagger.description = 'Download other research pdf.'

        #swagger.parameters['filename'] = {
            in: 'query',
            description: 'Filename about other research pdf.',
            required: true,
            type: 'string',
            schema: "SinoPac股市重大事件行事曆-04182023.PDF"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */

    try {
        res.download(config["FINANCIALDATAOTHER_PATH"] + req.query.filename)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.single_financialDataIndustry_download = function(req, res){
    /*
        #swagger.tags = ['File download']
        #swagger.description = 'Download industry research pdf.'

        #swagger.parameters['filename'] = {
            in: 'query',
            description: 'Filename about industry research pdf.',
            required: true,
            type: 'string',
            schema: "投資快訊03092023-半導體產業-存貨沒意外地續揚.pdf"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    try {
        res.download(config["FINANCIALDATAINDUSTRY_PATH"] + req.query.filename)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.single_post_board_memo_download = function(req, res){
    /*
        #swagger.tags = ['File download']
        #swagger.description = 'Download post board memo data.'

        #swagger.parameters['filename'] = {
            in: 'query',
            description: 'Filename about post board memo.',
            required: true,
            type: 'string',
            schema: ""
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    try {
        res.download(config["POST_BOARD_MEMO_PATH"] + req.query.filename)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.single_line_memo_download = function(req, res){
    /*
        #swagger.tags = ['File download']
        #swagger.description = 'Download line memo data.'

        #swagger.parameters['filename'] = {
            in: 'query',
            description: 'Filename about line memo.',
            required: true,
            type: 'string',
            schema: "8210_勤誠_2023-02-07_16_59_11.txt"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    try {
        res.download(config["LINE_MEMO_PATH"] + req.query.filename)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.table_status = async function(req, res){
    /*
        #swagger.tags = ['File download']
        #swagger.description = 'Download sql table as csv file.'

        #swagger.parameters['table_name'] = {
            in: 'query',
            description: 'Table name and add .csv.',
            required: true,
            type: 'string',
            schema: "news.csv"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    try {
        res.download(config["CSV_PATH"] + req.query.table_name)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.single_twse_chPDF_download = function(req, res){
    /*
        #swagger.tags = ['File download']
        #swagger.description = 'Download twse ch pdf.'

        #swagger.parameters['table_name'] = {
            in: 'query',
            description: 'Filename about twse ch pdf',
            required: true,
            type: 'string',
            schema: "247220230418M001.pdf"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    const filename = req.query.filename;
    
    try {
        res.download(config["TWSE_CHPDF_PATH"] + filename.slice(0, 4) + "/" + filename)
    } catch (error) {
        return res.status(400).send("error")
    }
};

exports.single_twse_enPDF_download = function(req, res){
    /*
        #swagger.tags = ['File download']
        #swagger.description = 'Download twse en pdf.'

        #swagger.parameters['table_name'] = {
            in: 'query',
            description: 'Filename about twse en pdf',
            required: true,
            type: 'string',
            schema: "247220230418E001.pdf"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    const filename = req.query.filename;
    
    try {
        res.download(config["TWSE_ENPDF_PATH"] + filename.slice(0, 4) + "/" + filename)
    } catch (error) {
        return res.status(400).send("error")
    }
};