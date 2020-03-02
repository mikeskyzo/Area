const express = require('express');
const bodyParser= require('body-parser')
const path = require('path');
const localtunnel = require('localtunnel');
const device = require('express-device');

const routes = require('./routes/routes');
const webhooks = require('./routes/webhooks');

const logger = require('morgan');
const process = require('process')

const utils = require('./src/utils')
const mongoDb = require('./src/manageDb')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(device.capture());

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

const ngrok = require('ngrok');
const token = '1XKuDgkqMYnETxr5sEgd6faCkh1_3iQ2dASUNn2DVmr8dbi5R'

var server = app.listen(8080, function () {
    console.log("Server is up !");
    (async function() {
        try {
            // global.url = await ngrok.connect({
            //     authtoken: token,
            //     subdomain: 'areacoon-api',
            //     proto: 'http',
            //     addr: 8080,
            //     region: 'eu'
            // }, 8080);
            global.url = await ngrok.connect(8080);
            global.redirect_url = global.url + '/auth/redirect'
            console.log('=================================================');
            console.log('Url of you\'r api : ' + global.url);
            console.log('=================================================');
        } catch (err) {
            console.log('=================================================');
            console.log('The tunnel to the domain is not up : ');
            console.error(err);
            console.log('=================================================');
        }
    })();
}).on('error', function (err){
    console.error("something broke : ");
    console.error(err);
})

process.on('SIGINT', function() {
    global.terminateServer();
});

global.terminateServer = function (err)
{
    console.log('Shutting down the server');
    if (err) {
        console.log('========== ERROR ===============');
        console.log(err);
        console.log('================================');
    }
    if (ngrok)
        ngrok.disconnect();
    server.close();
    if (global.clientDb)
        global.clientDb.close();
    process.exit(84);
}

global.app = app;
require('./src/serviceLoader');

module.exports = app;