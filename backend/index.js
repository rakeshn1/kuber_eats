/*
index file to run backend
 */
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const configurations = require('./config.json');

const connectionPool = require('./dbConnection');

app.use(express.static(`${__dirname}/public`));

const usersRouter = require('./routes/users');
const restaurantRouter = require('./routes/restaurants');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'IamBatman',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(`${__dirname}/public`));
app.use('/images', express.static(`${__dirname}/public/images`));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use('/users', usersRouter);
app.use('/restaurants', restaurantRouter);

async function main() {
  try {
    const [rows] = await connectionPool.query('SELECT * FROM users');
    if (rows) {
      console.log('DB connection successful..');
      app.listen(configurations.port, () => {
        console.log(`Backend server started listening on port ${configurations.port}`);
      });
    }
  } catch (e) {
    console.error('Error fetching data from DB:');
    console.error(e);
    process.exit(0);
  }
}
// eslint-disable-next-line no-unused-vars
const start = main();
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION IN THE PROCESS:');
  console.error(err.stack);
  process.exit(0);
});
