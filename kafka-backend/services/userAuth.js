const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/UsersModel');
const configurations = require('../config.json');

const saltRounds = 10;
// const selectQuery = 'SELECT * FROM users';

/* GET users listing. */
// router.get('/', async (req, res) => {
//   try {
//     const rows = await Users.find({});
//     if (rows) {
//       console.log('Fetched the data from DB');
//       res.status(200).json(rows);
//     }
//   } catch (e) {
//     console.error('Error fetching data from DB:');
//     console.error(e);
//     res.status(400).json({
//       msg: `Error fetching data from DB: ${e}`,
//     });
//   }
// });
//
/* Create user */
const createUser = async (msg, callback) => {
  const res = {};
  try {
    const emailCheck = await Users.findOne({ email: msg.email });
    if (emailCheck) {
      console.log('Email is already registered');
      res.status = 409;
      res.data = { msg: 'The email is already registered' };
      callback(null, res);
    } else {
      const hashedPassword = await bcrypt.hash(msg.password, saltRounds);
      const newUser = new Users({
        name: msg.name,
        email: msg.email,
        password: hashedPassword,
        favorites: JSON.stringify(msg.favorites),
      });

      const rows = await newUser.save();
      console.log(rows);
      // eslint-disable-next-line no-underscore-dangle
      if (rows._doc) {
        console.log('Successfully created user');
        res.status = 200;
        res.data = { msg: 'Successfully created user' };
        callback(null, res);
      } else {
        throw new Error("DB didn't return success response");
      }
    }
  } catch (e) {
    console.error('Error creating the user:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error creating the user: ${e}` };
    callback(null, res);
  }
};

/* Update user */
const updateUser = async (msg, callback) => {
  const res = {};
  try {
    msg.dob = JSON.stringify(msg.dob);
    msg.address = JSON.stringify(msg.address);
    const rows = await Users.updateOne({ _id: msg.id }, {
      name: msg.name,
      nickname: msg.nickname,
      number: msg.number,
      email: msg.email,
      dob: msg.dob,
      address: msg.address,
      imageUrl: msg.imageUrl,
    });
    if (rows.modifiedCount === 1) {
      res.status = 200;
      res.data = { msg: 'Successfully updated the user details' };
      callback(null, res);
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating the user details:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error updating  updating the user details: ${e}` };
    callback(null, res);
  }
};

/* Check Login credentials */
const userLogin = async (msg, callback) => {
  const res = {};
  try {
    const rows = await Users.find({});
    let flag = false;
    let userData;
    if (rows.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.email === msg.email) {
          // eslint-disable-next-line no-await-in-loop
          const result = await bcrypt.compare(msg.password, row.password);
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
        res.status = 200;
        res.data = { userData, token };
        callback(null, res);
      } else {
        console.log('User credentials are Invalid');
        res.status = 401;
        res.data = { msg: 'User name or password is invalid' }
        callback(null, res);
      }
    } else {
      res.status = 400;
      res.data = { msg: 'No users  present' }
      callback(null, res);
    }
  } catch (e) {
    console.error('Error checking login credentials:');
    console.error(e);
    res.status = 500;
    res.data = { msg: `Error checking login credentials: ${e}` };
    callback(null, res);
  }
};

handle_request = (msg, callback) => {
  if (msg.path === 'userLogin') {
    delete msg.path;
    userLogin(msg, callback);
  }
  if (msg.path === 'createUser') {
    delete msg.path;
    createUser(msg, callback);
  }
  if (msg.path === 'updateUser') {
    delete msg.path;
    updateUser(msg, callback);
  }
};

exports.handle_request = handle_request;
