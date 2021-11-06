const Users = require('../models/UsersModel');
const Orders = require('../models/OrdersModel');

const viewUserOrders = async (msg, callback) => {
  const res = {};
  try {
    const rows = await Orders.aggregate([
      {
        $match: {
          $and: [{ customerID: msg.userID }],
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
      res.status = 200;
      res.data = rowData;
      callback(null, res);
    }
  } catch (e) {
    console.error('Error fetching orders from DB:');
    console.error(e);
    res.status = 400;
    res.data = {
      msg: `Error fetching data from DB: ${e}`,
    };
    callback(null, res);
  }
};

const createOrder = async (msg, callback) => {
  const res = {};
  try {
    msg.description = JSON.stringify(msg.description);
    msg.address = JSON.stringify(msg.address);
    // msg.dateTime = JSON.stringify(msg.dateTime);
    const newOrder = new Orders({
      description: msg.description,
      email: msg.email,
      totalCost: msg.totalCost,
      dateTime: msg.dateTime,
      deliveryStatus: msg.deliveryStatus,
      status: msg.status,
      deliveryType: msg.deliveryType,
      customerID: msg.customerID,
      restaurantID: msg.restaurantID,
      address: msg.address,
      deliveryNote: msg.deliveryNote,
    });
    const rows = await newOrder.save();
    console.log(rows);
    // eslint-disable-next-line no-underscore-dangle
    if (rows._doc) {
      res.status = 200;
      res.data = {
        msg: 'Successfully created an Order',
      };
      callback(null, res);
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error creating an Order:');
    console.error(e);
    res.status = 400;
    res.data = {
      msg: `Error creating an Order: ${e}`,
    };
    callback(null, res);
  }
};

const updateUserFavorites = async (msg, callback) => {
  const res = {};
  try {
    const updated = msg.favorites;
    const index = updated.indexOf(msg.restaurantID);
    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(msg.restaurantID);
    }
    const rows = await Users.updateOne({ _id: msg.id }, {
      favorites: JSON.stringify(updated),
    });
    console.log(rows);
    if (rows.modifiedCount === 1) {
      res.status = 200;
      res.data = {
        msg: 'Successfully updated the user favorites',
      };
      callback(null, res);
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating the user favorites:');
    console.error(e);
    res.status = 400;
    res.data = {
      msg: `Error updating  updating the user favorites: ${e}`,
    };
    callback(null, res);
  }
};

handle_request = (msg, callback) => {
  if (msg.path === 'viewUserOrders') {
    delete msg.path;
    viewUserOrders(msg, callback);
  }
  if (msg.path === 'createOrder') {
    delete msg.path;
    createOrder(msg, callback);
  }
  if (msg.path === 'updateUserFavorites') {
    delete msg.path;
    updateUserFavorites(msg, callback);
  }
};

exports.handle_request = handle_request;
