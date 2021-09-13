var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('../dbConnection');


/* GET users listing. */
router.get('/', async function(req, res, next) {
  try{
    const [rows ,fields] = await pool.query("SELECT * FROM users");
    if(rows){
      console.log("Fetched the data from DB")
      res.status(200).json(rows[0]);
    }
  }catch (e) {
    console.error("Error fetching data from DB:")
    console.error(e)
    res.status(400).json({
              msg: "Error fetching data from DB: "+e
            })
  }
});

/*Check Login credentials*/
router.post('/create', function(req, res, next) {

});

module.exports = router;
