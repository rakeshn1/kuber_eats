/*
index file to run backend
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const configurations = require('./config.json');

var connectionPool = require('./dbConnection')

app.use(express.static(__dirname + '/public'));

var usersRouter = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'IamBatman',
    resave: false,
    saveUninitialized: true
}));



app.use('/users', usersRouter);

async function main() {
    try{
        const [rows ,fields] = await connectionPool.query("SELECT * FROM users");
        if(rows){
            console.log("DB connection successful..")
            app.listen(configurations.port, function () {
                console.log(`Backend server started listening on port ${configurations.port}`);
            });
        }
    }catch (e) {
        console.error("Error fetching data from DB:")
        console.error(e)
        process.exit(0)
    }
}
const start = main()
process.on('uncaughtException', function (err) {
    console.error("UNCAUGHT EXCEPTION IN THE PROCESS:");
    console.error(err.stack);
    process.exit(0)
});