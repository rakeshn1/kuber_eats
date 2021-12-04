const mongoose = require('mongoose');

const { Schema } = mongoose;

const restaurantSchema = new Schema({
  title: { type: 'string' },
  imageUrl: { type: 'string' },
  largeImageUrl: { type: 'string' },
  location: { type: 'string' },
  categories: { type: 'string' },
  tags: { type: 'string' },
  etaRange: { type: 'string' },
  rawRatingStats: { type: 'string' },
  publicContact: { type: 'string' },
  priceBucket: { type: 'string' },
  email: { type: 'string' },
  Password: { type: 'string' },
  timings: { type: 'string' },
  deliveryType: { type: 'string' },
  dietary: { type: 'string' },
},
{
  versionKey: false,
});

const restaurantModel = mongoose.model('restaurant', restaurantSchema);
module.exports = restaurantModel;
