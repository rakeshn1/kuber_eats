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

router.get('/:id', async (req, res) => {
  try {
    const restaurantQuery = `SELECT * FROM restaurants WHERE id = ${req.params.id}`;
    const dishQuery = `SELECT * FROM Dishes WHERE restaurantID = ${req.params.id}`;
    const [restaurantData] = await pool.query(restaurantQuery);
    const [dishData] = await pool.query(dishQuery);
    if (restaurantData.length > 0) {
      const rows = restaurantData.map((row) => {
        // eslint-disable-next-line no-param-reassign
        const rowData = {};
        rowData.uuid = row.id;
        rowData.title = row.title;
        rowData.imageUrl = row.imageUrl;
        rowData.largeImageUrl = row.largeImageUrl;
        rowData.location = JSON.parse(row.location);
        rowData.categories = JSON.parse(row.categories);
        rowData.tags = JSON.parse(row.tags);
        rowData.etaRange = JSON.parse(row.etaRange);
        rowData.rawRatingStats = JSON.parse(row.rawRatingStats);
        rowData.publicContact = JSON.parse(row.publicContact);
        rowData.sections = [];
        rowData.items = {};
        const sectionMap = {};
        if (dishData.length > 0) {
          dishData.forEach((dish) => {
            // eslint-disable-next-line no-param-reassign
            dish.uuid = dish.id;
            // eslint-disable-next-line no-param-reassign
            dish.itemDescription = dish.description;
            // eslint-disable-next-line no-param-reassign
            dish.category = JSON.parse(dish.category);
            dish.category.forEach((cat) => {
              const catValue = cat.value;
              if (sectionMap[catValue]) {
                sectionMap[catValue].itemUuids.push(dish.uuid);
              } else {
                const newEntry = {
                  uuid: catValue + Date.now(),
                  title: catValue,
                  itemUuids: [],
                };
                sectionMap[catValue] = newEntry;
                sectionMap[catValue].itemUuids.push(dish.uuid);
              }
            });
            rowData.items[dish.uuid] = dish;
          });
          // eslint-disable-next-line guard-for-in,no-restricted-syntax
          for (const key in sectionMap) {
            rowData.sections.push(sectionMap[key]);
          }
        }
        return rowData;
      });
      console.log(rows);
      console.log('Fetched the restaurant data from DB');
      res.status(200).json(rows[0]);
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

router.post('/addDish', async (req, res) => {
  try {
    req.body.category = JSON.stringify(req.body.category);
    const sqlQuery = 'INSERT INTO Dishes (title, imageUrl, ingredients, description, price, category, rules, customizationIds, restaurantID) VALUES (?,?,?,?,?,?,?,?,?)';
    console.log(sqlQuery);
    const [rows] = await pool.query(sqlQuery,
      [req.body.title, req.body.imageUrl, req.body.ingredients, req.body.description,
        // eslint-disable-next-line max-len
        req.body.price, req.body.category, req.body.rules, req.body.customizationIds, req.body.restaurantID]);
    console.log(rows);
    if (rows.affectedRows) {
      res.status(200).json({ msg: 'Successfully created a dish' });
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error creating a dish:');
    console.error(e);
    res.status(400).json({
      msg: `Error creating a dish: ${e}`,
    });
  }
});

router.put('/editDish', async (req, res) => {
  try {
    req.body.category = JSON.stringify(req.body.category);
    const sqlQuery = 'UPDATE Dishes SET title = ?, imageUrl = ?, ingredients = ?, description = ?, price = ?, category = ?, rules = ?, customizationIds = ? WHERE id = ?';
    console.log(sqlQuery);
    const [rows] = await pool.query(sqlQuery,
      [req.body.title, req.body.imageUrl, req.body.ingredients, req.body.description,
        // eslint-disable-next-line max-len
        req.body.price, req.body.category, req.body.rules, req.body.customizationIds, req.body.id]);
    console.log(rows);
    if (rows.affectedRows) {
      res.status(200).json({ msg: 'Successfully updated a dish' });
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating a dish:');
    console.error(e);
    res.status(400).json({
      msg: `Error updating a dish: ${e}`,
    });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const query = 'SELECT o.id, o.description, o.totalCost, o.dateTime, o.deliveryStatus, o.deliveryType, o.status, o.customerID,o.restaurantID, u.name, u.nickname, u.number, u.dob, u.email, u.address, u.imageUrl  FROM orders o join users u on o.customerID = u.id where o.restaurantID = ?';
    const [rows] = await pool.query(query, req.body.restaurantID);
    if (rows.length > 0) {
      const rowData = rows.map((row) => ({
        id: row.id,
        description: row.description,
        totalCost: row.totalCost,
        dateTime: row.dateTime,
        deliveryStatus: row.deliveryStatus,
        status: row.status,
        deliveryType: row.deliveryType,
        customerID: row.customerID,
        restaurantID: row.restaurantID,
        name: row.name,
        nickname: row.nickname,
        number: row.number,
        email: row.email,
        dob: JSON.parse(row.dob),
        address: JSON.parse(row.address),
        imageUrl: row.imageUrl,
        favorites: row.favorites,
      }));
      console.log(rowData);
      console.log('Fetched the restaurant orders from DB');
      res.status(200).json(rowData);
    }
  } catch (e) {
    console.error('Error fetching orders from DB:');
    console.error(e);
    res.status(400).json({
      msg: `Error fetching data from DB: ${e}`,
    });
  }
});

router.put('/orderUpdate', async (req, res) => {
  try {
    const sqlQuery = 'UPDATE orders SET deliveryStatus = ? WHERE id = ?';
    const [rows] = await pool.query(sqlQuery, [req.body.deliveryStatus, req.body.id]);
    console.log(sqlQuery, req.body.id);
    console.log(rows);
    if (rows.affectedRows) {
      res.status(200).json({ msg: 'Successfully updated the delivery status' });
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating the delivery status:');
    console.error(e);
    res.status(400).json({
      msg: `Error updating the delivery status: ${e}`,
    });
  }
});

module.exports = router;
