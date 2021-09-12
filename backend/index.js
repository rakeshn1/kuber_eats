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
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));

// app.get('/', function (req, res) {
//     //check if user session exits
//     if (req.session.user) {
//         res.render('home', {
//             books: books
//         });
//     } else
//         res.render('login', {message:{}});
// });
//
// app.post('/login', function (req, res) {
//     if (req.session.user) {
//         res.render('home', {
//             books: books
//         });
//     } else {
//         console.log("Req Body : ", req.body);
//         let flag = true;
//         Users.filter(user => {
//             if (user.username === req.body.username && user.password === req.body.password) {
//                 req.session.user = user;
//                 flag = false;
//                 res.redirect('/home');
//             }
//         });
//         if(flag){
//             // req.flash('message', "Invalid Username/Password")
//             // res.render('login', {message:req.flash('message')});
//             alert("Invalid Username/Password")
//         }
//     }
//
// });
//
// app.get('/home', function (req, res) {
//     if (!req.session.user) {
//         res.redirect('/');
//     } else {
//         console.log("Session data : ", req.session);
//         res.render('home', {
//             books: books
//         });
//     }
// });
//
// app.get('/create', function (req, res) {
//     if (!req.session.user) {
//         res.redirect('/');
//     } else {
//         res.render('create',{message : {}});
//     }
// });
//
// app.post('/create', function (req, res) {
//     let flag = true;
//     for (const book of books) {
//         if(book.BookID === req.body.bookId){
//             flag = false;
//             // req.flash('message', "A book with the same book ID already exits")
//             // res.render('create', {message:req.flash('message')});
//             alert("A book with the same book ID already exits")
//         }
//     }
//     if(flag){
//         let newBook =  {"BookID": req.body.bookId, "Title": req.body.bookName, "Author": req.body.author }
//         books.push(newBook);
//         res.redirect('/home');
//     }
//
// });
//
// app.get('/delete', function (req, res) {
//     console.log("Session Data : ", req.session.user);
//     if (!req.session.user) {
//         res.redirect('/');
//     } else {
//         res.render('delete', {message : {}});
//     }
// });
//
// app.post('/delete', function (req, res) {
//     let i = 0;
//     let flag = true;
//     while(i < books.length){
//         if(books[i].BookID === req.body.bookId){
//             books.splice(i,1);
//             flag = false;
//             break;
//         }
//         i++;
//     }
//     if(flag){
//         // req.flash('message', "Book ID doesn't exits")
//         // res.render('delete', {message:req.flash('message')});
//         alert("A book with given book ID doesn't exits")
//     }else{
//         res.redirect('/home');
//     }
// })
//
// app.get("/logout", function (req, res) {
//     //check if user session exits
//     console.log("Logout");
//     req.session.destroy();
//     res.redirect("/");
// });

app.use('/', usersRouter);

connectionPool.getConnection(function(err, connection) {
    if (err) {
        console.error("DB connection failed with following error:")
        console.error(err)
        process.exit(0)
    }

    connection.query('SELECT * FROM users', function (error, results, fields) {
        connection.release();
        app.listen(configurations.port, function () {
            console.log(`Backend server started listening on port ${configurations.port}`);
        });

        if (error) {
            console.error("Error fetching data from DB:")
            console.error(error)
            process.exit(0)
        }
    });
});

process.on('uncaughtException', function (err) {
    console.error("UNCAUGHT EXCEPTION IN THE PROCESS:");
    console.error(err.stack);
    process.exit(0)
});