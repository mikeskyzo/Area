var createError = require('http-errors');
var express = require('express');
const bodyParser= require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');

var usersRouter = require('./routes/users');
var routes = require('./routes/routes');
var webhooks = require('./routes/webhooks');
var weather = require('./services/weather')

var logger = require('morgan');

var utils = require('./src/utils')
var mongoDb = require('./src/manageDb')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', usersRouter);
app.use('/', routes);
app.use('/', webhooks);

mongoDb.initDb();

// Init all services
weather.initWeather();

app.route('/home').get(function(req, res) {
});

app.route('/test').get(function(req, res) {
    res.json({ok : 'boomer'})
});

app.listen(8080, function (req, res) {
    console.log("server listen on 8080")
})

module.exports = app;
