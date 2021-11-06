const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Restaurants = require('../models/RestaurantsModel');
const Dishes = require('../models/DishesModel');
const configurations = require('../config.json');

const saltRounds = 10;

/* GET Restaurants listing. */
const getAllRestaurants = async (msg, callback) => {
  const res = {};
  try {
    const rows = await Restaurants.find({});
    let rowsToSend;
    if (rows) {
      rowsToSend = rows.map(async (row) => {
        const allDishes = await Dishes.find({ restaurantID: row.id }, { title: 1 });
        const rowData = {};
        rowData.uuid = row.id;
        rowData.title = row.title;
        rowData.imageUrl = row.imageUrl;
        rowData.largeImageUrl = row.largeImageUrl;
        rowData.location = row.location;
        rowData.categories = JSON.parse(row.categories);
        rowData.tags = allDishes;
        // rowData.etaRange = JSON.parse(row.etaRange);
        // rowData.rawRatingStats = JSON.parse(row.rawRatingStats);
        rowData.publicContact = row.publicContact;
        rowData.deliveryType = JSON.parse(row.deliveryType);
        rowData.dietary = JSON.parse(row.dietary);
        return Promise.resolve(rowData);
      });
      Promise.all(rowsToSend).then((to) => {
        console.log(rows);
        console.log('Fetched the restaurant data from DB');
        res.status = 200;
        res.data = to;
        callback(null, res);
      });
    }
  } catch (e) {
    console.error('Error fetching data from DB:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error fetching data from DB: ${e}` };
    callback(null, res);
  }
};

const getOneRestaurant = async (msg, callback) => {
  const res = {};
  try {
    const restaurantData = await Restaurants.find({ _id: msg.params.id });
    let dishData = await Dishes.find({ restaurantID: msg.params.id });
    if (restaurantData.length > 0) {
      const rows = restaurantData.map((row) => {
        // eslint-disable-next-line no-param-reassign
        const rowData = {};
        rowData.uuid = row.id;
        rowData.title = row.title;
        rowData.imageUrl = row.imageUrl;
        rowData.largeImageUrl = row.largeImageUrl;
        rowData.location = row.location;
        rowData.categories = row.categories ? JSON.parse(row.categories) : row.categories;
        rowData.tags = row.tags ? JSON.parse(row.tags) : row.tags;
        // rowData.etaRange = JSON.parse(row.etaRange);
        // rowData.rawRatingStats = JSON.parse(row.rawRatingStats);
        rowData.publicContact = row.publicContact;
        rowData.deliveryType = JSON.parse(row.deliveryType);
        rowData.dietary = row.dietary ? JSON.parse(row.dietary) : row.dietary;
        rowData.sections = [];
        rowData.items = {};
        const sectionMap = {};
        if (dishData.length > 0) {
          dishData = JSON.parse(JSON.stringify(dishData));
          dishData.forEach((dish) => {
            // eslint-disable-next-line no-param-reassign,no-underscore-dangle
            dish.uuid = dish._id;
            // eslint-disable-next-line no-param-reassign,no-underscore-dangle
            dish.id = dish._id;
            // eslint-disable-next-line no-param-reassign
            dish.itemDescription = dish.description;
            // eslint-disable-next-line no-param-reassign
            dish.price = parseFloat(dish.price.$numberDecimal);
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
      res.status = 200;
      res.data = rows[0];
      callback(null, res);
    }
  } catch (e) {
    console.error('Error fetching data from DB:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error fetching data from DB: ${e}` };
    callback(null, res);
  }
};

/* Create user */
// eslint-disable-next-line consistent-return
const createRestaurant = async (msg, callback) => {
  const res = {};
  try {
    const emailCheck = await Restaurants.findOne({ email: msg.email });
    if (emailCheck) {
      console.log('Email is already registered');
      res.status = 409;
      res.data = { msg: 'The email is already registered' };
      callback(null, res);
    } else {
      const hashedPassword = await bcrypt.hash(msg.password, saltRounds);
      const deliveryType = JSON.stringify(msg.deliveryType);

      const newRestaurant = new Restaurants({
        title: msg.title,
        email: msg.email,
        Password: hashedPassword,
        location: msg.location,
        deliveryType,
      });

      const rows = await newRestaurant.save();
      console.log(rows);
      // eslint-disable-next-line no-underscore-dangle
      if (rows._doc) {
        res.status = 200;
        res.data = { msg: 'Successfully created a Restaurant user' };
        callback(null, res);
      } else {
        throw new Error("DB didn't return success response");
      }
    }
  } catch (e) {
    console.error('Error creating a Restaurant user:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error creating a Restaurant user: ${e}` };
    callback(null, res);
  }
};

/* Update details */
const updateRestaurant = async (msg, callback) => {
  const res = {};
  try {
    // msg.location = JSON.stringify(msg.location);
    const categories = [];
    msg.categories.forEach((ele) => {
      categories.push({ id: ele.value, name: ele.label });
    });
    msg.categories = JSON.stringify(categories);
    msg.deliveryType = JSON.stringify(msg.deliveryType);
    msg.dietary = JSON.stringify(msg.dietary);
    // msg.rawRatingStats = JSON.stringify(msg.rawRatingStats);
    // msg.publicContact = JSON.stringify(msg.publicContact);
    const rows = await Restaurants.updateOne({ _id: msg.id }, {
      imageUrl: msg.imageUrl,
      largeImageUrl: msg.largeImageUrl,
      location: msg.location,
      categories: msg.categories,
      tags: msg.tags,
      etaRange: msg.etaRange,
      rawRatingStats: msg.rawRatingStats,
      publicContact: msg.publicContact,
      priceBucket: msg.priceBucket,
      timings: msg.timings,
      deliveryType: msg.deliveryType,
      dietary: msg.dietary,
    });
    console.log(rows);
    if (rows.modifiedCount === 1) {
      res.status = 200;
      res.data = { msg: 'Successfully updated a restaurant entry' };
      callback(null, res);
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating a restaurant entry:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error updating a restaurant entry: ${e}` };
    callback(null, res);
  }
};

/* Check Login credentials */
const restaurantLogin = async (msg, callback) => {
  const res = {};
  try {
    let rows = await Restaurants.find({});
    let flag = false;
    let restaurantData;
    if (rows.length > 0) {
      rows = JSON.parse(JSON.stringify(rows));
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.email === msg.email) {
          // eslint-disable-next-line no-await-in-loop
          const result = await bcrypt.compare(msg.password, row.Password);
          if (result) {
            const categories = [];
            if (row.categories) {
              row.categories = JSON.parse(row.categories);
              row.categories.forEach((ele) => {
                categories.push({ value: ele.id, label: ele.name });
              });
            }
            restaurantData = {
              // eslint-disable-next-line no-underscore-dangle
              id: row._id,
              title: row.title,
              email: row.email,
              publicContact: parseFloat(row.publicContact),
              largeImageUrl: row.largeImageUrl,
              imageUrl: row.imageUrl,
              location: row.location,
              timings: row.timings,
              categories,
              deliveryType: JSON.parse(row.deliveryType),
              dietary: row.dietary ? JSON.parse(row.dietary) : row.dietary,
            };
            flag = true;
            break;
          }
        }
      }
      if (flag) {
        const payload = { _id: restaurantData.id, username: restaurantData.title };
        const token = `JWT ${jwt.sign(payload, configurations.secret, {
          expiresIn: 1008000,
        })}`;
        console.log('Restaurant User credentials are valid');
        res.status = 200;
        res.data = { restaurantData, token };
        callback(null, res);
      } else {
        console.log('Restaurant User credentials are Invalid');
        res.status = 401;
        res.data = { msg: 'Restaurant User name or password is invalid' };
        callback(null, res);
      }
    } else {
      res.status = 400;
      res.data = { msg: 'No Restaurant users  present' };
      callback(null, res);
    }
  } catch (e) {
    console.error('Error checking login credentials:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error checking login credentials: ${e}` };
    callback(null, res);
  }
};

handle_request = (msg, callback) => {
  if (msg.path === 'restaurantLogin') {
    delete msg.path;
    restaurantLogin(msg, callback);
  }
  if (msg.path === 'createRestaurant') {
    delete msg.path;
    createRestaurant(msg, callback);
  }
  if (msg.path === 'updateRestaurant') {
    delete msg.path;
    updateRestaurant(msg, callback);
  }
  if (msg.path === 'getOneRestaurant') {
    delete msg.path;
    getOneRestaurant(msg, callback);
  }
  if (msg.path === 'getAllRestaurants') {
    delete msg.path;
    getAllRestaurants(msg, callback);
  }
};

exports.handle_request = handle_request;
