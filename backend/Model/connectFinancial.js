var mysql2 = require('mysql2');

var con = mysql2.createPool({
    host : "140.116.214.134",
    user : "financialSite",
    password : "624001479",
    database : "financial",
    charset : "utf8",
    multipleStatements : true,
    connectionLimit: 10,
});

module.exports = con