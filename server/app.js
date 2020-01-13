var createError = require('http-errors');
var express = require('express');
const bodyParser= require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const MongoClient = require('mongodb').MongoClient;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}))


app.use('/', indexRouter);
app.use(usersRouter);

var db

MongoClient.connect('mongodb+srv://Admin:Admin44000@cluster0-boacc.mongodb.net/test?retryWrites=true&w=majority', (err, client) => {
  if (err) return console.log(err)
  db = client.db('Area51')
})

app.post('/create/:username/:pass', (req, res) => {
    db.collection('Users').insertOne({name : req.params.username, pass : req.params.pass}, (err, result) => {
        if (err) {
            res.json({
                success : false,
                message : err.message
            });
        }
        res.json({
            success : true,
            message : 'Created succesful'
        })
    })
})

app.get('/connect/:username/:pass', (req, res) => {
    db.collection('Users').findOne({name : req.params.username, pass : req.params.pass}, (err, result) => {
        if (err) {
            res.json({
                success : false,
                message : err.message
            });
        } else {
            if(!result) {
                res.json({
                    success : false,
                    message : 'User not found'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Connect succesful'
                })
            }
        }
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(8080, function (req, res) {
    console.log("server listen on 8080")
})

module.exports = app;
