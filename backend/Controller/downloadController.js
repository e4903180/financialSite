const con = require('../Model/connectMySQL')
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

exports.download = function(req, res){
    res.download(req.query.filePath)
};

exports.financialData2csv_download = function(req, res){
    con.query("select * from financialData", function(err, result, field){
        if(err === null){
            const path = createCSV('/home/cosbi/桌面/financialData/financialData.csv', result)
            res.download(path)
        }
    });
};

exports.post_board_memo2csv_download = function(req, res){
    con.query("select * from post_board_memo", function(err, result, field){
        if(err === null){
            const path = createCSV('/home/cosbi/桌面/financialData/post_board_memo.csv', result)
            res.download(path)
        }
    });
};

exports.lineMemo2csv_download = function(req, res){
    con.query("select * from lineMemo", function(err, result, field){
        if(err === null){
            const path = createCSV('/home/cosbi/桌面/financialData/lineMemo.csv', result)
            res.download(path)
        }
    });
};