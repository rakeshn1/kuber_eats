/*
Mysql DB connection
 */
const mysql = require('mysql');
const config = require('./config.json')
var pool  = mysql.createPool({
    connectionLimit : 100,
    host            : config.dbConfiguration.host,
    user            : config.dbConfiguration.userName,
    password        : config.dbConfiguration.password,
    database        : config.dbConfiguration.database
});

module.exports = pool;