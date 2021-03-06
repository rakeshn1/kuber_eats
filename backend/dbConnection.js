/*
Mysql DB connection
 */
const mysql = require('mysql2');
const config = require('./config.json');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: config.dbConfiguration.host,
  user: config.dbConfiguration.userName,
  password: config.dbConfiguration.password,
  database: config.dbConfiguration.database,
});
const promisePool = pool.promise();

module.exports = promisePool;
