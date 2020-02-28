const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routes = require('./routes/routes');
const logs = require('./logs/logs');

// Settings
const port = 8081;
const logLevel = 1;

// App construction
const app = express();

// Initialize app, then activate it
const appInitialization = function () {
	app.set('view engine', 'ejs');
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(session({
		secret: "Dash_secret",
		resave: false,
		saveUninitialized: false
	}));
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	});
	app.logger = logs.logger;
	app.logger.logLevel = logLevel;
	routes
		.enableAllRoutes(app)
		.then(() => { activateApp(); });
};

// Activate app
const activateApp = function () {
	app.listen(port);
	app.on('listening', ()=>{});
};

appInitialization();
