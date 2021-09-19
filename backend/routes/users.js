var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('../dbConnection');

const selectQuery = "SELECT * FROM users";

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try{
    const [rows ,fields] = await pool.query(selectQuery);
    if(rows){
      console.log("Fetched the data from DB")
      res.status(200).json(rows);
    }
  }catch (e) {
    console.error("Error fetching data from DB:")
    console.error(e)
    res.status(400).json({
              msg: "Error fetching data from DB: "+e
            })
  }
});

/*Create user*/
router.post('/create', async function(req, res, next) {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    let sqlQuery = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
    console.log(sqlQuery)
    const [rows] = await pool.query(sqlQuery,[req.body.name, req.body.email, hashedPassword]);
    console.log(rows)
    if(rows.affectedRows){
      console.log("Successfully created user");
      res.status(200).json({msg: "Successfully created user"});
    }else{
      throw new Error("DB didn't return success response");
    }
  }catch (e) {
    console.error("Error creating the user:")
    console.error(e)
    res.status(400).json({
      msg: "Error creating the user: "+e
    })
  }
});

/*Check Login credentials*/
router.post('/login', async function(req, res, next) {
  try{
    const [rows] = await pool.query(selectQuery);
    let flag = false;
    let userData;
    if(rows.length > 0){
      for(let i = 0; i < rows.length; i++){
        let row = rows[i];
        if(row.name === req.body.name){
          let result = await bcrypt.compare(req.body.password, row.password);
          if(result){
            userData = {
              id: row.id,
              name : row.name
            }
            flag = true;
            break;
          }
        }
      }
      if(flag){
        console.log("User credentials are valid");
        res.status(200).json(userData);
      }else{
        console.log("User credentials are Invalid");
        res.status(400).json({msg: "User name or password is invalid"});
      }
    }else{
      res.status(400).json({msg: "No users  present"});
    }
  }catch (e) {
    console.error("Error checking login credentials:")
    console.error(e)
    res.status(400).json({
      msg: "Error checking login credentials: "+e
    })
  }
});

module.exports = router;
