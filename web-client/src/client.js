const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routes = require('./routes/routes');

const app = express();

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
	routes
		.enableAllRoutes(app)
		.then(() => { activateApp(); });
};

const activateApp = function () {
	app.listen(8081);
	app.on('listening', ()=>{});
};

appInitialization();
