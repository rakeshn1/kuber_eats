const mongoose = require('mongoose');

const { Schema } = mongoose;

const dishSchema = new Schema({
  title: { type: 'string' },
  imageUrl: { type: 'string' },
  ingredients: { type: 'string' },
  description: { type: 'string' },
  price: { type: 'Decimal128' },
  category: { type: 'string' },
  rules: { type: 'string' },
  customizationIds: { type: 'string' },
  restaurantID: { type: 'string' },
},
{
  versionKey: false,
});

const dishModel = mongoose.model('dish', dishSchema);
module.exports = dishModel;
