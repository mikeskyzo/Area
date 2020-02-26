var createError = require('http-errors');
var express = require('express');
const bodyParser= require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
const localtunnel = require('localtunnel');

var routes = require('./routes/routes');
var webhooks = require('./routes/webhooks');

var logger = require('morgan');
var process = require('process')

require('./src/serviceLoader');
var utils = require('./src/utils')
var mongoDb = require('./src/manageDb')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

require('events').EventEmitter.prototype._maxListeners = 100;

app.use('/', routes);
app.use('/', webhooks);

mongoDb.initDb();

const fetch = require('node-fetch');

app.route('/test').get(function(req, res) {

    res.json({
        test : 'success'
    })
});

const ngrok = require('ngrok');
const token = '1XKuDgkqMYnETxr5sEgd6faCkh1_3iQ2dASUNn2DVmr8dbi5R'

var server = app.listen(8080, function () {
    console.log("Server is up !");
    (async function() {
        try {
            // global.url = await ngrok.connect({authtoken: token, subdomain: 'GrosSex',}, 8080);
            global.url = await ngrok.connect({authtoken: token}, 8080);
            console.log('=================================================');
            console.log('Url of you\'r api : ' + global.url);
            console.log('=================================================');
        } catch (err) {
            console.error(err);
        }
    })();
}).on('error', function (err){
    console.error("something broke : ");
    console.error(err);
})

process.on('SIGINT', function() {
    global.terminateServer();
});

// const tunnel = localtunnel(8080, { subdomain: 'areacoon-api'})
// .then(function (err, tunnel)
// {
//     global.url = err.url;
//     console.log('=================================================');
//     console.log('Url of you\'r api : ' + global.url);
//     console.log('=================================================');
// })
// .catch( function (err) {
//     console.log(err);
// })

global.terminateServer = function (err)
{
    console.log('Shutting down the server');
    if (err)
        console.log(err);
    if (ngrok)
        ngrok.disconnect();
    server.close();
    if (global.clientDb)
        global.clientDb.close();
    process.exit(84);
}

module.exports = app;