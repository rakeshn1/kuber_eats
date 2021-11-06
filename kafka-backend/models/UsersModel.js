const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: 'string' },
  nickname: { type: 'string' },
  password: { type: 'string' },
  number: { type: 'string' },
  email: { type: 'string' },
  dob: { type: 'string' },
  address: { type: 'string' },
  imageUrl: { type: 'string' },
  favorites: { type: 'string' },
  additionalAddresses: { type: 'string' },
},
{
  versionKey: false,
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
