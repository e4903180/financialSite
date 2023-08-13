var mysql2 = require('mysql2');
const { config } = require('../constant')

var con = mysql2.createPool({
    host : config["DB_HOST"],
    user : config["DB_USER"],
    password : config["DB_PASSWORD"],
    database : config["DB_DATABASE_TWSTOCK"],
    charset : "utf8",
    multipleStatements : true,
    connectionLimit: 10,
});

module.exports = con