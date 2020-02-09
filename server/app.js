var createError = require('http-errors');
var express = require('express');
const bodyParser= require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
const localtunnel = require('localtunnel');

var usersRouter = require('./routes/users');
var routes = require('./routes/routes');
var webhooks = require('./routes/webhooks');

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

const fetch = require('node-fetch');

app.route('/test').get(function(req, res) {

    res.json({
        test : 'success'
    })
});

var server = app.listen(8080, function (req, res) {
    console.log("server listen on 8080");
})

process.on('SIGINT', function() {
    tunnel.close();
    server.close();
});

const tunnel = localtunnel(8080, { subdomain: 'areacoon-api'})
.then(function (err, tunnel)
{
    global.url = err.url;
    console.log(global.url);
})
.catch( function (err) {
    console.log(err);
})

module.exports = app;
