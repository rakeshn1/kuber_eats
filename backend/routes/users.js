var express = require('express');
var router = express.Router();
const pool = require('../dbConnection');


/* GET users listing. */
router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error("DB connection failed with following error:")
      console.error(err)
      res.status(400).json({
        msg: "DB connection failed: "+err
      })
    }

    connection.query('SELECT * FROM users', function (error, results, fields) {
      connection.release();
      if (error) {
        console.error("Error fetching data from DB:")
        console.error(error)
        res.status(400).json({
          msg: "Error fetching data from DB: "+err
        })
      }
      if(results.length > 0){
        res.status(200).json(results[0]);
      }
    });
  });
});

module.exports = router;
