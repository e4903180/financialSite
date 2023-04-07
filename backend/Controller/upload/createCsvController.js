const { Parser } = require('json2csv');
const iconv = require('iconv-lite');
const fs = require('fs');

exports.createCSV = (path, data) => {
    const fields = Object.keys(data[0])
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(data);
    var newCsv = iconv.encode(csv, 'BIG5');

    fs.writeFileSync(path, newCsv);
}