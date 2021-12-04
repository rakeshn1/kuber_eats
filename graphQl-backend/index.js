/*
index file to run backend
 */
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { graphqlHTTP } = require('express-graphql');
// const passport = require('passport');
const mongoose = require('mongoose');
const configurations = require('./config.json');
const schema = require('./graphQL/schema');
// const connectionPool = require('./dbConnection');
// const passPortConfig = require('./passport');

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
  res.header('Access-Control-Allow-Origin', `http://${configurations.frontEndHost}:${configurations.frontEndPort}`);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// app.use(passport.initialize());
// passPortConfig(passport);

app.use('/users', usersRouter);
app.use('/restaurants', restaurantRouter);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

// (async () => {
//   try {
//     const [rows] = await connectionPool.query('SELECT * FROM users');
//     if (rows) {
//       console.log('DB connection successful..');
//       app.listen(configurations.port, () => {
//         console.log(`Backend server started listening on port ${configurations.port}`);
//       });
//     }
//   } catch (e) {
//     console.error('Error fetching data from DB:');
//     console.error(e);
//     process.exit(0);
//   }
// })();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 500,
};

(async () => {
  try {
    const res = await mongoose.connect(configurations.mongoDbConfiguration, options);
    if (res) {
      console.log('MongoDB Connected Successfully...');
      app.listen(configurations.port, () => {
        console.log(`Backend server started listening on port ${configurations.port}`);
      });
    }
  } catch (e) {
    console.error('MongoDB Connection Failed:');
    console.error(e);
    process.exit(0);
  }
})();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION IN THE PROCESS:');
  console.error(err.stack);
  process.exit(0);
});
