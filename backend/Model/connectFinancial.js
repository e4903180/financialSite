var mysql2 = require('mysql2');

var con = mysql2.createPool({
    host : "localhost",
    user : "debian-sys-maint",
    password : "CEMj8ptYHraxNxFt",
    database : "financial",
    charset : "utf8",
    multipleStatements : true,
    connectionLimit: 10,
});

var con1 = mysql2.createPool({
    host : "localhost",
    user : "debian-sys-maint",
    password : "CEMj8ptYHraxNxFt",
    database : "twStock",
    charset : "utf8",
    multipleStatements : true,
    connectionLimit: 10,
});

module.exports = con, con1