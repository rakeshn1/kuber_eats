const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Restaurants = require('../models/RestaurantsModel');
const Dishes = require('../models/DishesModel');
const Orders = require('../models/OrdersModel');
// const pool = require('../dbConnection');
const configurations = require('../config.json');
const kafka = require("../kafka/client");

const router = express.Router();
const saltRounds = 10;
// const selectQuery = 'SELECT * FROM restaurants';
const checkAuth = passport.authenticate('jwt', { session: false });

/* GET Restaurants listing. */
router.get('/', async (req, res) => {
  try {
    req.body.path = 'getAllRestaurants';
    kafka.make_request('restaurantBasic', req.body, (error, result) => {
      if (result?.status === 200) {
        return res.status(200).json(result.data);
      } else {
        return res.status(400).json(result?.data);
      }
    });
    // const rows = await Restaurants.find({});
    // let rowsToSend;
    // if (rows) {
    //   rowsToSend = rows.map(async (row) => {
    //     const allDishes = await Dishes.find({ restaurantID: row.id }, { title: 1 });
    //     const rowData = {};
    //     rowData.uuid = row.id;
    //     rowData.title = row.title;
    //     rowData.imageUrl = row.imageUrl;
    //     rowData.largeImageUrl = row.largeImageUrl;
    //     rowData.location = row.location;
    //     rowData.categories = JSON.parse(row.categories);
    //     rowData.tags = allDishes;
    //     // rowData.etaRange = JSON.parse(row.etaRange);
    //     // rowData.rawRatingStats = JSON.parse(row.rawRatingStats);
    //     rowData.publicContact = row.publicContact;
    //     rowData.deliveryType = JSON.parse(row.deliveryType);
    //     rowData.dietary = JSON.parse(row.dietary);
    //     return Promise.resolve(rowData);
    //   });
    //   Promise.all(rowsToSend).then((to) => {
    //     console.log(rows);
    //     console.log('Fetched the restaurant data from DB');
    //     res.status(200).json(to);
    //   });
    // }
  } catch (e) {
    console.error('Error fetching data from DB:');
    console.error(e);
    res.status(400).json({
      msg: `Error fetching data from DB: ${e}`,
    });
  }
});

router.get('/:id', checkAuth, async (req, res) => {
  try {
    req.body.path = 'getOneRestaurant';
    req.body.params = req.params;
    kafka.make_request('restaurantBasic', req.body, (error, result) => {
      if (result?.status === 200) {
        return res.status(200).json(result.data);
      } else {
        return res.status(400).json(result?.data);
      }
    });
    // const restaurantData = await Restaurants.find({ _id: req.params.id });
    // let dishData = await Dishes.find({ restaurantID: req.params.id });
    // if (restaurantData.length > 0) {
    //   const rows = restaurantData.map((row) => {
    //     // eslint-disable-next-line no-param-reassign
    //     const rowData = {};
    //     rowData.uuid = row.id;
    //     rowData.title = row.title;
    //     rowData.imageUrl = row.imageUrl;
    //     rowData.largeImageUrl = row.largeImageUrl;
    //     rowData.location = row.location;
    //     rowData.categories = row.categories ? JSON.parse(row.categories) : row.categories;
    //     rowData.tags = row.tags ? JSON.parse(row.tags) : row.tags;
    //     // rowData.etaRange = JSON.parse(row.etaRange);
    //     // rowData.rawRatingStats = JSON.parse(row.rawRatingStats);
    //     rowData.publicContact = row.publicContact;
    //     rowData.deliveryType = JSON.parse(row.deliveryType);
    //     rowData.dietary = row.dietary ? JSON.parse(row.dietary) : row.dietary;
    //     rowData.sections = [];
    //     rowData.items = {};
    //     const sectionMap = {};
    //     if (dishData.length > 0) {
    //       dishData = JSON.parse(JSON.stringify(dishData));
    //       dishData.forEach((dish) => {
    //         // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    //         dish.uuid = dish._id;
    //         // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    //         dish.id = dish._id;
    //         // eslint-disable-next-line no-param-reassign
    //         dish.itemDescription = dish.description;
    //         // eslint-disable-next-line no-param-reassign
    //         dish.price = parseFloat(dish.price.$numberDecimal);
    //         // eslint-disable-next-line no-param-reassign
    //         dish.category = JSON.parse(dish.category);
    //         dish.category.forEach((cat) => {
    //           const catValue = cat.value;
    //           if (sectionMap[catValue]) {
    //             sectionMap[catValue].itemUuids.push(dish.uuid);
    //           } else {
    //             const newEntry = {
    //               uuid: catValue + Date.now(),
    //               title: catValue,
    //               itemUuids: [],
    //             };
    //             sectionMap[catValue] = newEntry;
    //             sectionMap[catValue].itemUuids.push(dish.uuid);
    //           }
    //         });
    //         rowData.items[dish.uuid] = dish;
    //       });
    //       // eslint-disable-next-line guard-for-in,no-restricted-syntax
    //       for (const key in sectionMap) {
    //         rowData.sections.push(sectionMap[key]);
    //       }
    //     }
    //     return rowData;
    //   });
    //   console.log(rows);
    //   console.log('Fetched the restaurant data from DB');
    //   res.status(200).json(rows[0]);
    // }
  } catch (e) {
    console.error('Error fetching data from DB:');
    console.error(e);
    res.status(400).json({
      msg: `Error fetching data from DB: ${e}`,
    });
  }
});

/* Create user */
// eslint-disable-next-line consistent-return
router.post('/create', async (req, res) => {
  try {
    req.body.path = 'createRestaurant';
    kafka.make_request('restaurantBasic', req.body, (error, result) => {
      if (result?.status === 200) {
        return res.status(200).json(result.data);
      } else if (result?.status === 409) {
        return res.status(409).json(result.data);
      } else {
        return res.status(500).json(result?.data);
      }
    });
    // const emailCheck = await Restaurants.findOne({ email: req.body.email });
    // if (emailCheck) {
    //   console.log('Email is already registered');
    //   return res.status(409).json({ msg: 'The email is already registered' });
    // }
    // const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // const deliveryType = JSON.stringify(req.body.deliveryType);
    //
    // const newRestaurant = new Restaurants({
    //   title: req.body.title,
    //   email: req.body.email,
    //   Password: hashedPassword,
    //   location: req.body.location,
    //   deliveryType,
    // });
    //
    // const rows = await newRestaurant.save();
    // console.log(rows);
    // // eslint-disable-next-line no-underscore-dangle
    // if (rows._doc) {
    //   res.status(200).json({ msg: 'Successfully created a Restaurant user' });
    // } else {
    //   throw new Error("DB didn't return success response");
    // }
  } catch (e) {
    console.error('Error creating a Restaurant user:');
    console.error(e);
    res.status(400).json({
      msg: `Error creating a Restaurant user: ${e}`,
    });
  }
});

/* Update details */
router.put('/update', checkAuth, async (req, res) => {
  try {
    req.body.path = 'updateRestaurant';
    kafka.make_request('restaurantBasic', req.body, (error, result) => {
      if (result?.status === 200) {
        return res.status(200).json(result.data);
      } else {
        return res.status(400).json(result?.data);
      }
    });
    // // req.body.location = JSON.stringify(req.body.location);
    // const categories = [];
    // req.body.categories.forEach((ele) => {
    //   categories.push({ id: ele.value, name: ele.label });
    // });
    // req.body.categories = JSON.stringify(categories);
    // req.body.deliveryType = JSON.stringify(req.body.deliveryType);
    // req.body.dietary = JSON.stringify(req.body.dietary);
    // // req.body.rawRatingStats = JSON.stringify(req.body.rawRatingStats);
    // // req.body.publicContact = JSON.stringify(req.body.publicContact);
    // const rows = await Restaurants.updateOne({ _id: req.body.id }, {
    //   imageUrl: req.body.imageUrl,
    //   largeImageUrl: req.body.largeImageUrl,
    //   location: req.body.location,
    //   categories: req.body.categories,
    //   tags: req.body.tags,
    //   etaRange: req.body.etaRange,
    //   rawRatingStats: req.body.rawRatingStats,
    //   publicContact: req.body.publicContact,
    //   priceBucket: req.body.priceBucket,
    //   timings: req.body.timings,
    //   deliveryType: req.body.deliveryType,
    //   dietary: req.body.dietary,
    // });
    // console.log(rows);
    // if (rows.modifiedCount === 1) {
    //   res.status(200).json({ msg: 'Successfully updated a restaurant entry' });
    // } else {
    //   throw new Error("DB didn't return success response");
    // }
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
    req.body.path = 'restaurantLogin';
    kafka.make_request('restaurantBasic', req.body, (error, result) => {
      if (result?.status === 200) {
        return res.status(200).json(result.data);
      } else if (result?.status === 401) {
        return res.status(401).json(result.data);
      } else if (result?.status === 400) {
        return res.status(400).json(result.data);
      } else {
        return res.status(500).json(result?.data);
      }
    });
    // let rows = await Restaurants.find({});
    // let flag = false;
    // let restaurantData;
    // if (rows.length > 0) {
    //   rows = JSON.parse(JSON.stringify(rows));
    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < rows.length; i++) {
    //     const row = rows[i];
    //     if (row.email === req.body.email) {
    //       // eslint-disable-next-line no-await-in-loop
    //       const result = await bcrypt.compare(req.body.password, row.Password);
    //       if (result) {
    //         const categories = [];
    //         if (row.categories) {
    //           row.categories = JSON.parse(row.categories);
    //           row.categories.forEach((ele) => {
    //             categories.push({ value: ele.id, label: ele.name });
    //           });
    //         }
    //         restaurantData = {
    //           // eslint-disable-next-line no-underscore-dangle
    //           id: row._id,
    //           title: row.title,
    //           email: row.email,
    //           publicContact: parseFloat(row.publicContact),
    //           largeImageUrl: row.largeImageUrl,
    //           imageUrl: row.imageUrl,
    //           location: row.location,
    //           timings: row.timings,
    //           categories,
    //           deliveryType: JSON.parse(row.deliveryType),
    //           dietary: row.dietary ? JSON.parse(row.dietary) : row.dietary,
    //         };
    //         flag = true;
    //         break;
    //       }
    //     }
    //   }
    //   if (flag) {
    //     const payload = { _id: restaurantData.id, username: restaurantData.title };
    //     const token = `JWT ${jwt.sign(payload, configurations.secret, {
    //       expiresIn: 1008000,
    //     })}`;
    //     console.log('Restaurant User credentials are valid');
    //     res.status(200).json({ restaurantData, token });
    //   } else {
    //     console.log('Restaurant User credentials are Invalid');
    //     res.status(401).json({ msg: 'Restaurant User name or password is invalid' });
    //   }
    // } else {
    //   res.status(400).json({ msg: 'No Restaurant users  present' });
    // }
  } catch (e) {
    console.error('Error checking login credentials:');
    console.error(e);
    res.status(400).json({
      msg: `Error checking login credentials: ${e}`,
    });
  }
});

router.post('/addDish', checkAuth, async (req, res) => {
  try {
    req.body.path = 'addDish';
    kafka.make_request('restaurantDishnOrder', req.body, (error, result) => {
      if (result?.status === 200) {
        return res.status(200).json(result.data);
      } else {
        return res.status(400).json(result?.data);
      }
    });
    // req.body.category = JSON.stringify(req.body.category);
    // const newDish = new Dishes({
    //   title: req.body.title,
    //   imageUrl: req.body.imageUrl,
    //   ingredients: req.body.ingredients,
    //   description: req.body.description,
    //   price: req.body.price,
    //   category: req.body.category,
    //   rules: req.body.rules,
    //   customizationIds: req.body.customizationIds,
    //   restaurantID: req.body.restaurantID,
    // });
    //
    // const rows = await newDish.save();
    // console.log(rows);
    // // eslint-disable-next-line no-underscore-dangle
    // if (rows._doc) {
    //   res.status(200).json({ msg: 'Successfully created a dish' });
    // } else {
    //   throw new Error("DB didn't return success response");
    // }
  } catch (e) {
    console.error('Error creating a dish:');
    console.error(e);
    res.status(400).json({
      msg: `Error creating a dish: ${e}`,
    });
  }
});

router.put('/editDish', checkAuth, async (req, res) => {
  try {
    req.body.path = 'editDish';
    kafka.make_request('restaurantDishnOrder', req.body, (error, result) => {
      if (result?.status === 200) {
        return res.status(200).json(result.data);
      } else {
        return res.status(400).json(result?.data);
      }
    });
    // req.body.category = JSON.stringify(req.body.category);
    // const rows = await Dishes.updateOne({ _id: req.body.id }, {
    //   title: req.body.title,
    //   imageUrl: req.body.imageUrl,
    //   ingredients: req.body.ingredients,
    //   description: req.body.description,
    //   price: req.body.price,
    //   category: req.body.category,
    //   rules: req.body.rules,
    //   customizationIds: req.body.customizationIds,
    //   restaurantID: req.body.restaurantID,
    // });
    // console.log(rows);
    // if (rows.modifiedCount === 1) {
    //   res.status(200).json({ msg: 'Successfully updated a dish' });
    // } else {
    //   throw new Error("DB didn't return success response");
    // }
  } catch (e) {
    console.error('Error updating a dish:');
    console.error(e);
    res.status(400).json({
      msg: `Error updating a dish: ${e}`,
    });
  }
});

router.post('/orders', checkAuth, async (req, res) => {
  try {
    req.body.path = 'restaurantOrders';
    kafka.make_request('restaurantDishnOrder', req.body, (error, result) => {
      if (result?.status === 200) {
        return res.status(200).json(result.data);
      } else {
        return res.status(400).json(result?.data);
      }
    });
    // const rows = await Orders.aggregate([
    //   {
    //     $match: {
    //       $and: [{ restaurantID: req.body.restaurantID }],
    //     },
    //   },
    //   { $set: { useObjID: { $toObjectId: '$customerID' } } },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'useObjID',
    //       foreignField: '_id',
    //       as: 'userRow',
    //     },
    //   },
    //   { $unwind: '$userRow' },
    //   {
    //     $project: {
    //       _id: 1,
    //       description: 1,
    //       totalCost: 1,
    //       dateTime: 1,
    //       deliveryStatus: 1,
    //       deliveryType: 1,
    //       status: 1,
    //       customerID: 1,
    //       restaurantID: 1,
    //       name: '$userRow.name',
    //       nickname: '$userRow.nickname',
    //       number: '$userRow.number',
    //       email: '$userRow.email',
    //       dob: '$userRow.dob',
    //       address: '$userRow.address',
    //       imageUrl: '$userRow.imageUrl',
    //       favorites: '$userRow.favorites',
    //     },
    //   },
    // ]);
    // if (rows.length > 0) {
    //   const rowData = rows.map((row) => ({
    //     // eslint-disable-next-line no-underscore-dangle
    //     id: row._id,
    //     description: row.description,
    //     totalCost: parseFloat(row.totalCost.toJSON().$numberDecimal),
    //     dateTime: row.dateTime,
    //     deliveryStatus: row.deliveryStatus,
    //     status: row.status,
    //     deliveryType: row.deliveryType,
    //     customerID: row.customerID,
    //     restaurantID: row.restaurantID,
    //     // address: row.address,
    //     name: row.name,
    //     nickname: row.nickname,
    //     number: row.number,
    //     email: row.email,
    //     dob: JSON.parse(row.dob),
    //     address: JSON.parse(row.address),
    //     imageUrl: row.imageUrl,
    //     favorites: row.favorites,
    //   }));
    //   console.log(rowData);
    //   console.log('Fetched the restaurant orders from DB');
    //   res.status(200).json(rowData);
    // }
  } catch (e) {
    console.error('Error fetching orders from DB:');
    console.error(e);
    res.status(400).json({
      msg: `Error fetching data from DB: ${e}`,
    });
  }
});

router.put('/orderUpdate', checkAuth, async (req, res) => {
  try {
    req.body.path = 'updateOrder';
    kafka.make_request('restaurantDishnOrder', req.body, (error, result) => {
      if (result?.status === 200) {
        return res.status(200).json(result.data);
      } else {
        return res.status(400).json(result?.data);
      }
    });
    // const rows = await Orders.updateOne({ _id: req.body.id }, {
    //   deliveryStatus: req.body.deliveryStatus,
    // });
    // if (req.body.status) {
    //   await Orders.updateOne({ _id: req.body.id }, {
    //     status: req.body.status,
    //   });
    // }
    // console.log(rows);
    // if (rows.modifiedCount === 1) {
    //   res.status(200).json({ msg: 'Successfully updated the delivery status' });
    // } else {
    //   throw new Error("DB didn't return success response");
    // }
  } catch (e) {
    console.error('Error updating the delivery status:');
    console.error(e);
    res.status(400).json({
      msg: `Error updating the delivery status: ${e}`,
    });
  }
});

module.exports = router;
