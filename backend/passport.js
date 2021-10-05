const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const configurations = require('./config.json');
const pool = require('./dbConnection');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: configurations.secret,
};

module.exports = (passport) => {
  passport.use(new JwtStrategy(options, async (jwtPayload, callback) => {
    // eslint-disable-next-line no-underscore-dangle
    const { _id } = jwtPayload;
    const query = `select * from users where id = ${_id}`;
    const query2 = `select * from restaurants where id = ${_id}`;
    try {
      const [rows] = await pool.query(query);
      if (rows && rows.length > 0 && rows[0].name === jwtPayload.username) {
        callback(null, rows[0]);
      } else {
        const [rowse] = await pool.query(query2);
        if (rowse && rowse.length > 0 && rowse[0].title === jwtPayload.username) {
          callback(null, rows[0]);
        } else {
          callback(null, false);
        }
      }
    } catch (e) {
      callback(e, null);
    }
  }));
};
