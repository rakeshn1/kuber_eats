const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
const pool = require('../dbConnection');
const upload = require('../fileUploader');
const configurations = require('../config.json');

const selectQuery = 'SELECT * FROM users';

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(selectQuery);
    if (rows) {
      console.log('Fetched the data from DB');
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

    const sqlQuery = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
    console.log(sqlQuery);
    const [rows] = await pool.query(sqlQuery, [req.body.name, req.body.email, hashedPassword]);
    console.log(rows);
    if (rows.affectedRows) {
      console.log('Successfully created user');
      res.status(200).json({ msg: 'Successfully created user' });
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error creating the user:');
    console.error(e);
    res.status(400).json({
      msg: `Error creating the user: ${e}`,
    });
  }
});

/* Update user */
router.put('/update', async (req, res) => {
  try {
    req.body.dob = JSON.stringify(req.body.dob);
    req.body.address = JSON.stringify(req.body.address);
    const sqlQuery = 'UPDATE users SET name = ?, nickname = ?, number = ?, email = ?, dob = ?, address = ?, imageUrl = ?, favorites = ? WHERE id = ?';
    console.log(sqlQuery);
    const [rows] = await pool.query(sqlQuery,
      [req.body.name, req.body.nickname, req.body.number, req.body.email,
        // eslint-disable-next-line max-len
        req.body.dob, req.body.address, req.body.imageUrl, req.body.favorites, req.body.id]);
    console.log(rows);
    if (rows.affectedRows) {
      res.status(200).json({ msg: 'Successfully updated the user details' });
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating the user details:');
    console.error(e);
    res.status(400).json({
      msg: `Error updating  updating the user details: ${e}`,
    });
  }
});

/* Check Login credentials */
router.post('/login', async (req, res) => {
  try {
    const [rows] = await pool.query(selectQuery);
    let flag = false;
    let userData;
    if (rows.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.name === req.body.name) {
          // eslint-disable-next-line no-await-in-loop
          const result = await bcrypt.compare(req.body.password, row.password);
          if (result) {
            userData = {
              id: row.id,
              name: row.name,
              nickname: row.nickname,
              number: row.number,
              email: row.email,
              dob: JSON.parse(row.dob),
              address: JSON.parse(row.address),
              imageUrl: row.imageUrl,
              favorites: row.favorites,
            };
            flag = true;
            break;
          }
        }
      }
      if (flag) {
        console.log('User credentials are valid');
        res.status(200).json(userData);
      } else {
        console.log('User credentials are Invalid');
        res.status(400).json({ msg: 'User name or password is invalid' });
      }
    } else {
      res.status(400).json({ msg: 'No users  present' });
    }
  } catch (e) {
    console.error('Error checking login credentials:');
    console.error(e);
    res.status(400).json({
      msg: `Error checking login credentials: ${e}`,
    });
  }
});

/* Upload image */
router.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      const url = `http://${configurations.host}:${configurations.port}/images/${req.file.filename}`;
      req.file.imageUrl = url;
      console.log(req.file);
      res.status(200).json(req.file);
    } else {
      console.log('File upload failed');
      res.status(400).json({ msg: 'File upload failed' });
    }
  } catch (e) {
    console.error('Error uploading image file:');
    console.error(e);
    res.status(400).json({
      msg: `Error uploading image file: ${e}`,
    });
  }
});

module.exports = router;
