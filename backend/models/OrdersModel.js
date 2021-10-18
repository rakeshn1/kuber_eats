const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  description: { type: 'string' },
  totalCost: { type: 'Decimal128' },
  dateTime: { type: 'string' },
  deliveryStatus: { type: 'string' },
  status: { type: 'string' },
  deliveryType: { type: 'string' },
  customerID: { type: 'string' },
  restaurantID: { type: 'string' },
  address: { type: 'string' },
  additionalAddresses: { type: 'string' },
},
{
  versionKey: false,
});

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;
