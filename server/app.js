var createError = require('http-errors');
var express = require('express');
const bodyParser= require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');

var usersRouter = require('./routes/users');
var routes = require('./routes/routes');
var webhooks = require('./routes/webhooks');
var weather = require('./services/weather')

var utils = require('./src/utils')
var mongoDb = require('./src/manageDb')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}))

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
    res.json({});
});

app.listen(8080, function (req, res) {
    console.log("server listen on 8080")
})

module.exports = app;
