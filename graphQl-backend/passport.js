const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const Users = require('./models/UsersModel');
const Restaurants = require('./models/RestaurantsModel');
const configurations = require('./config.json');
// const pool = require('./dbConnection');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: configurations.secret,
};

module.exports = (passport) => {
  passport.use(new JwtStrategy(options, async (jwtPayload, callback) => {
    // eslint-disable-next-line no-underscore-dangle
    const { _id } = jwtPayload;
    try {
      const rows = await Users.findOne({ _id });
      if (rows && rows.name === jwtPayload.username) {
        callback(null, rows);
      } else {
        const rowse = await Restaurants.findOne({ _id });
        if (rowse && rowse.title === jwtPayload.username) {
          callback(null, rowse);
        } else {
          callback(null, false);
        }
      }
    } catch (e) {
      callback(e, null);
    }
  }));
};
