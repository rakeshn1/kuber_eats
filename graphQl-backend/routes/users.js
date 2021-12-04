const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Users = require('../models/UsersModel');
const Orders = require('../models/OrdersModel');
// const pool = require('../dbConnection');
const upload = require('../fileUploader');
const kafka = require('../kafka/client');
const configurations = require('../config.json');

const router = express.Router();
const saltRounds = 10;
const checkAuth = passport.authenticate('jwt', { session: false });
// const selectQuery = 'SELECT * FROM users';

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const rows = await Users.find({});
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
    const emailCheck = await Users.findOne({ email: req.body.email });
    if (emailCheck) {
      console.log('Email is already registered');
      return res.status(409).json({ msg: 'The email is already registered' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      favorites: JSON.stringify(req.body.favorites),
    });

    const rows = await newUser.save();
    console.log(rows);
    // eslint-disable-next-line no-underscore-dangle
    if (rows._doc) {
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
router.put('/update', checkAuth, async (req, res) => {
  try {
    req.body.dob = JSON.stringify(req.body.dob);
    req.body.address = JSON.stringify(req.body.address);
    const rows = await Users.updateOne({ _id: req.body.id }, {
      name: req.body.name,
      nickname: req.body.nickname,
      number: req.body.number,
      email: req.body.email,
      dob: req.body.dob,
      address: req.body.address,
      imageUrl: req.body.imageUrl,
    });
    if (rows.modifiedCount === 1) {
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
    const rows = await Users.find({});
    let flag = false;
    let userData;
    if (rows.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.email === req.body.email) {
          // eslint-disable-next-line no-await-in-loop
          const result = await bcrypt.compare(req.body.password, row.password);
          if (result) {
            userData = {
              // eslint-disable-next-line no-underscore-dangle
              id: row._id,
              name: row.name,
              nickname: row.nickname,
              number: row.number,
              email: row.email,
              dob: row.dob ? JSON.parse(row.dob) : row.dob,
              address: row.address ? JSON.parse(row.address) : row.address,
              imageUrl: row.imageUrl,
              favorites: JSON.parse(row.favorites),
            };
            flag = true;
            break;
          }
        }
      }
      if (flag) {
        // eslint-disable-next-line no-underscore-dangle
        const payload = { _id: userData.id, username: userData.name };
        const token = `JWT ${jwt.sign(payload, configurations.secret, {
          expiresIn: 1008000,
        })}`;
        console.log('User credentials are valid');
        res.status(200).json({ userData, token });
      } else {
        console.log('User credentials are Invalid');
        res.status(401).json({ msg: 'User name or password is invalid' });
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
router.post('/uploadImage', checkAuth, upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      req.file.imageUrl = req.file.location;
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

router.post('/orders', checkAuth, async (req, res) => {
  try {
    const rows = await Orders.aggregate([
      {
        $match: {
          $and: [{ customerID: req.body.userID }],
        },
      },
      { $set: { resObjID: { $toObjectId: '$restaurantID' } } },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'resObjID',
          foreignField: '_id',
          as: 'restaurantRow',
        },
      },
      { $unwind: '$restaurantRow' },
      {
        $project: {
          _id: 1,
          description: 1,
          totalCost: 1,
          dateTime: 1,
          deliveryStatus: 1,
          deliveryType: 1,
          status: 1,
          customerID: 1,
          restaurantID: 1,
          address: 1,
          deliveryNote: 1,
          title: '$restaurantRow.title',
        },
      },
    ]);
    if (rows.length > 0) {
      const rowData = rows.map((row) => ({
        // eslint-disable-next-line no-underscore-dangle
        id: row._id,
        description: row.description,
        totalCost: parseFloat(row.totalCost.toJSON().$numberDecimal),
        dateTime: row.dateTime,
        deliveryStatus: row.deliveryStatus,
        status: row.status,
        deliveryType: row.deliveryType,
        customerID: row.customerID,
        restaurantID: row.restaurantID,
        name: row.title,
        address: row.address,
        deliveryNote: row.deliveryNote,
      }));
      console.log(rowData);
      console.log('Fetched the user orders from DB');
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

router.post('/createOrder', checkAuth, async (req, res) => {
  try {
    req.body.description = JSON.stringify(req.body.description);
    req.body.address = JSON.stringify(req.body.address);
    // req.body.dateTime = JSON.stringify(req.body.dateTime);
    const newOrder = new Orders({
      description: req.body.description,
      email: req.body.email,
      totalCost: req.body.totalCost,
      dateTime: req.body.dateTime,
      deliveryStatus: req.body.deliveryStatus,
      status: req.body.status,
      deliveryType: req.body.deliveryType,
      customerID: req.body.customerID,
      restaurantID: req.body.restaurantID,
      address: req.body.address,
      deliveryNote: req.body.deliveryNote,
    });
    const rows = await newOrder.save();
    console.log(rows);
    // eslint-disable-next-line no-underscore-dangle
    if (rows._doc) {
      res.status(200).json({ msg: 'Successfully created an Order' });
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error creating an Order:');
    console.error(e);
    res.status(400).json({
      msg: `Error creating an Order: ${e}`,
    });
  }
});

router.put('/updateFavorites', async (req, res) => {
  try {
    const updated = req.body.favorites;
    const index = updated.indexOf(req.body.restaurantID);
    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(req.body.restaurantID);
    }
    const rows = await Users.updateOne({ _id: req.body.id }, {
      favorites: JSON.stringify(updated),
    });
    console.log(rows);
    if (rows.modifiedCount === 1) {
      res.status(200).json({ msg: 'Successfully updated the user favorites' });
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating the user favorites:');
    console.error(e);
    res.status(400).json({
      msg: `Error updating  updating the user favorites: ${e}`,
    });
  }
});

module.exports = router;
