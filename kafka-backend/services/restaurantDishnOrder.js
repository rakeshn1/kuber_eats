const Dishes = require('../models/DishesModel');
const Orders = require('../models/OrdersModel');

const addDish = async (msg, callback) => {
  const res = {};
  try {
    msg.category = JSON.stringify(msg.category);
    const newDish = new Dishes({
      title: msg.title,
      imageUrl: msg.imageUrl,
      ingredients: msg.ingredients,
      description: msg.description,
      price: msg.price,
      category: msg.category,
      rules: msg.rules,
      customizationIds: msg.customizationIds,
      restaurantID: msg.restaurantID,
    });

    const rows = await newDish.save();
    console.log(rows);
    // eslint-disable-next-line no-underscore-dangle
    if (rows._doc) {
      res.status = 200;
      res.data = { msg: 'Successfully created a dish' };
      callback(null, res);
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error creating a dish:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error creating a dish: ${e}` };
    callback(null, res);
  }
};

const editDish = async (msg, callback) => {
  const res = {};
  try {
    msg.category = JSON.stringify(msg.category);
    const rows = await Dishes.updateOne({ _id: msg.id }, {
      title: msg.title,
      imageUrl: msg.imageUrl,
      ingredients: msg.ingredients,
      description: msg.description,
      price: msg.price,
      category: msg.category,
      rules: msg.rules,
      customizationIds: msg.customizationIds,
      restaurantID: msg.restaurantID,
    });
    console.log(rows);
    if (rows.modifiedCount === 1) {
      res.status = 200;
      res.data = { msg: 'Successfully updated a dish' };
      callback(null, res);
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating a dish:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error updating a dish: ${e}` };
    callback(null, res);
  }
};

const restaurantOrders = async (msg, callback) => {
  const res = {};
  try {
    const rows = await Orders.aggregate([
      {
        $match: {
          $and: [{ restaurantID: msg.restaurantID }],
        },
      },
      { $set: { useObjID: { $toObjectId: '$customerID' } } },
      {
        $lookup: {
          from: 'users',
          localField: 'useObjID',
          foreignField: '_id',
          as: 'userRow',
        },
      },
      { $unwind: '$userRow' },
      {
        $project: {
          _id: 1,
          description: 1,
          totalCost: 1,
          dateTime: 1,
          deliveryStatus: 1,
          deliveryType: 1,
          status: 1,
          deliveryNote: 1,
          customerID: 1,
          restaurantID: 1,
          name: '$userRow.name',
          nickname: '$userRow.nickname',
          number: '$userRow.number',
          email: '$userRow.email',
          dob: '$userRow.dob',
          address: '$userRow.address',
          imageUrl: '$userRow.imageUrl',
          favorites: '$userRow.favorites',
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
        // address: row.address,
        deliveryNote: row.deliveryNote,
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
      res.status = 200;
      res.data = rowData;
      callback(null, res);
    } else {
      res.status = 200;
      res.data = [];
      callback(null, res);
    }
  } catch (e) {
    console.error('Error fetching orders from DB:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error fetching data from DB: ${e}` };
    callback(null, res);
  }
};

const updateOrder = async (msg, callback) => {
  const res = {};
  try {
    const rows = await Orders.updateOne({ _id: msg.id }, {
      deliveryStatus: msg.deliveryStatus,
    });
    if (msg.status) {
      await Orders.updateOne({ _id: msg.id }, {
        status: msg.status,
      });
    }
    console.log(rows);
    if (rows.modifiedCount === 1) {
      res.status = 200;
      res.data = { msg: 'Successfully updated the delivery status' };
      callback(null, res);
    } else {
      throw new Error("DB didn't return success response");
    }
  } catch (e) {
    console.error('Error updating the delivery status:');
    console.error(e);
    res.status = 400;
    res.data = { msg: `Error updating the delivery status: ${e}` };
    callback(null, res);
  }
};

handle_request = (msg, callback) => {
  if (msg.path === 'addDish') {
    delete msg.path;
    addDish(msg, callback);
  }
  if (msg.path === 'editDish') {
    delete msg.path;
    editDish(msg, callback);
  }
  if (msg.path === 'restaurantOrders') {
    delete msg.path;
    restaurantOrders(msg, callback);
  }
  if (msg.path === 'updateOrder') {
    delete msg.path;
    updateOrder(msg, callback);
  }
};

exports.handle_request = handle_request;
