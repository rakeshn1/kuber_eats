var express = require('express');
var router = express.Router();
const pool = require('../dbConnection');

const selectQuery = "SELECT * FROM restaurants";

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try{
        let [rows ,fields] = await pool.query(selectQuery);
        if(rows.length > 0){
            rows = rows.map(row =>{
                row.uuid = row.id
                row.location = JSON.parse(row.location)
                row.categories = JSON.parse(row.categories)
                row.tags = JSON.parse(row.tags)
                row.etaRange = JSON.parse(row.etaRange)
                row.rawRatingStats = JSON.parse(row.rawRatingStats)
                row.publicContact = JSON.parse(row.publicContact)
                return row;
            })
            console.log(rows)
            console.log("Fetched the restaurant data from DB")
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
        req.body.location = JSON.stringify(req.body.location)
        req.body.categories = JSON.stringify(req.body.categories)
        req.body.tags = JSON.stringify(req.body.tags)
        req.body.etaRange = JSON.stringify(req.body.etaRange)
        req.body.rawRatingStats = JSON.stringify(req.body.rawRatingStats)
        req.body.publicContact = JSON.stringify(req.body.publicContact)
        let sqlQuery = "INSERT INTO restaurants (title, imageUrl, largeImageUrl, location, categories, tags, etaRange, rawRatingStats, publicContact, priceBucket) VALUES (?,?,?,?,?,?,?,?,?,?)";
        console.log(sqlQuery)
        const [rows] = await pool.query(sqlQuery,
            [req.body.title,req.body.imageUrl,req.body.largeImageUrl,req.body.location,req.body.categories,
                     req.body.tags,req.body.etaRange,req.body.rawRatingStats,req.body.publicContact,req.body.priceBucket]
        );
        console.log(rows)
        if(rows.affectedRows){
            res.status(200).json({msg: "Successfully created a restaurant entry"});
        }else{
            throw new Error("DB didn't return success response");
        }
    }catch (e) {
        console.error("Error creating a restaurant entry:")
        console.error(e)
        res.status(400).json({
            msg: "Error creating a restaurant entry: "+e
        })
    }
});

/*Check Login credentials*/
router.post('/login', async function(req, res, next) {
    try{
        const [rows] = await pool.query(selectQuery);
        let flag = false
        if(rows.length > 0){
            for(let i = 0; i < rows.length; i++){
                let row = rows[i];
                if(row.name === req.body.name){
                    let result = await bcrypt.compare(req.body.password, row.Password);
                    if(result){
                        flag = true;
                        break;
                    }
                }
            }
            if(flag){
                console.log("User credentials are valid");
                res.status(200).json({msg: "User credentials are correct"});
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
