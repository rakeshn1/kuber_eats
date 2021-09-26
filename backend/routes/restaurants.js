const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
const pool = require('../dbConnection');

const selectQuery = 'SELECT * FROM restaurants';

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    let [rows] = await pool.query(selectQuery);
    if (rows.length > 0) {
      rows = rows.map((row) => {
        // eslint-disable-next-line no-param-reassign
        row.uuid = row.id;
        row.location = JSON.parse(row.location);
        row.categories = JSON.parse(row.categories);
        row.tags = JSON.parse(row.tags);
        row.etaRange = JSON.parse(row.etaRange);
        row.rawRatingStats = JSON.parse(row.rawRatingStats);
        row.publicContact = JSON.parse(row.publicContact);
        return row;
      });
      console.log(rows);
      console.log('Fetched the restaurant data from DB');
      res.status(200).json(rows);
    }
  } catch (e) {
    console.error('Error fetching data from DB:');
    console.error(e);
    res.status(400).json({
      msg: `Error fetching data from DB: ${e}`,
    });
  }
});

/* Create user */
router.post('/create', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const sqlQuery = 'INSERT INTO restaurants (title, email, Password) VALUES (?,?,?)';
    console.log(sqlQuery);
    const [rows] = await pool.query(sqlQuery, [req.body.title, req.body.email, hashedPassword]);
    console.log(rows);
    if (rows.affectedRows) {
      res.status(200).json({ msg: 'Successfully created a Restaurant user' });
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error creating a Restaurant user:');
    console.error(e);
    res.status(400).json({
      msg: `Error creating a Restaurant user: ${e}`,
    });
  }
});

/* Update details */
router.put('/update', async (req, res) => {
  try {
    // req.body.location = JSON.stringify(req.body.location);
    const categories = [];
    req.body.categories.forEach((ele) => {
      categories.push({ id: ele.value, name: ele.label });
    });
    req.body.categories = JSON.stringify(categories);
    // req.body.timings = JSON.stringify(req.body.timings);
    // req.body.etaRange = JSON.stringify(req.body.etaRange);
    // req.body.rawRatingStats = JSON.stringify(req.body.rawRatingStats);
    // req.body.publicContact = JSON.stringify(req.body.publicContact);
    const sqlQuery = 'UPDATE restaurants SET imageUrl = ?, largeImageUrl = ?, location = ?, categories = ?, tags = ?, etaRange = ?, rawRatingStats = ?, publicContact = ?, priceBucket = ?, timings = ? WHERE id = ?';
    console.log(sqlQuery);
    const [rows] = await pool.query(sqlQuery,
      [req.body.imageUrl, req.body.largeImageUrl, req.body.location, req.body.categories,
        // eslint-disable-next-line max-len
        req.body.tags, req.body.etaRange, req.body.rawRatingStats, req.body.publicContact, req.body.priceBucket, req.body.timings, req.body.id]);
    console.log(rows);
    if (rows.affectedRows) {
      res.status(200).json({ msg: 'Successfully updated a restaurant entry' });
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating a restaurant entry:');
    console.error(e);
    res.status(400).json({
      msg: `Error updating a restaurant entry: ${e}`,
    });
  }
});

/* Check Login credentials */
router.post('/login', async (req, res) => {
  try {
    const [rows] = await pool.query(selectQuery);
    let flag = false;
    let restaurantData;
    if (rows.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.email === req.body.email) {
          // eslint-disable-next-line no-await-in-loop
          const result = await bcrypt.compare(req.body.password, row.Password);
          if (result) {
            const categories = [];
            row.categories = JSON.parse(row.categories);
            row.categories.forEach((ele) => {
              categories.push({ value: ele.id, label: ele.name });
            });
            restaurantData = {
              id: row.id,
              title: row.title,
              email: row.email,
              publicContact: parseFloat(row.publicContact),
              largeImageUrl: row.largeImageUrl,
              imageUrl: row.imageUrl,
              location: row.location,
              timings: row.timings,
              categories,
            };
            flag = true;
            break;
          }
        }
      }
      if (flag) {
        console.log('Restaurant User credentials are valid');
        res.status(200).json(restaurantData);
      } else {
        console.log('Restaurant User credentials are Invalid');
        res.status(400).json({ msg: 'Restaurant User name or password is invalid' });
      }
    } else {
      res.status(400).json({ msg: 'No Restaurant users  present' });
    }
  } catch (e) {
    console.error('Error checking login credentials:');
    console.error(e);
    res.status(400).json({
      msg: `Error checking login credentials: ${e}`,
    });
  }
});

module.exports = router;
