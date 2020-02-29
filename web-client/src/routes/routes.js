const ServerApi = require('../services/ApplicationServer');

const enableViewsRoutes = async function(app) {

	app.get('/', function(req, res) {
		res.redirect(req.cookies.access_token ? '/dashboard' : '/register');
	});

	// Account related
	app.get('/register', function (req, res) {
		res.render('register.ejs');
	});
	app.get('/login', function (req, res) {
		res.render('login.ejs');
	});
	app.get('/disconnect', function (req, res) {
		res.clearCookie('access_token');
		res.clearCookie('githubConnect');
		res.clearCookie('redditConnect');
		res.clearCookie('slackConnect');
		res.clearCookie('trelloConnect');
		res.redirect('/login');
	});

	app.get('/home', function (req, res) {
		res.render('home.ejs');
	});

	app.get('/dashboard', function (req, res) {
		res.render('dashboard.ejs');
	});

	app.get('/profil', function (req, res) {
		res.render('profil.ejs');
	});

	app.get('/mobile', function (req, res) {
		res.render('mobile.ejs');
	});

	app.get('/error', function (req, res) {
		res.render('error.ejs');
	});

};

// error routes
const errorLogicRoutes = require('./logic/errorLogicalRoutes');
// Enable authorizations routes function
const enableLogicRoutes = async function (app) {

	// This route download the mobile client apk
	app.get('/client.apk', function (req, res) {
		const path = require('path');
		const fs = require('fs');

		const filePath = "./public/app/release/";
		const fileName = "app-release.apk";

		fs.access(path.join(filePath, fileName), fs.F_OK, (err) => {
			if (err)
				console.error(err);
			else
				res.download(path.join(filePath, fileName));
		});
	});

	app.post('/client/:action', async (req, res) => {
		if (req.params.action === 'register') {
			var email = req.body.emailRegister;
			var username = req.body.usernameRegister;
			var password = req.body.passwordRegister;
			var server = req.body.serverRegister;

			ServerApi.createUser(email, username, password, server, req, res);
		} else if (req.params.action === 'login') {
			var username = req.body.usernameLogin;
			var password = req.body.passwordLogin;
			var serverAddress = req.body.serverLogin;

			ServerApi.connectUser(username, password, serverAddress, req, res);
		} else if (req.params.action == 'changeUsername') {
			var newUsername = req.body.newUsername;

			ServerApi.changeUsername(req, res, req.cookies.server, newUsername);
		} else if (req.params.action == 'changePassword') {
			var newPassword = req.body.newPassword;

			//ServerApi.connectUser();
		} else {
			res.redirect('/error');
		}
	});

	app.get('/client/:action', async function (req, res) {
		if (req.params.action === 'getServerAddress') {
			res.json({
				success : true,
				token : req.cookies.access_token,
				server : req.cookies.server
			})
		} else if (req.params.action === 'getInitAction') {
			const result = await ServerApi.initGetActions(req, res, req.cookies.server, req.cookies.access_token);
			res.json({
				success : true,
				data : result.data.actions
			})
		} else if (req.params.action === 'getInitReaction') {
			const result = await ServerApi.initGetReactions(req, res, req.cookies.server, req.cookies.access_token);
			res.json({
				success: true,
				data: result.data.reactions
			})
		} else if (req.params.action === 'getInitArea') {
			const result = await ServerApi.initGetAreas(req, res, req.cookies.server, req.cookies.access_token);
			res.json({
				success : true,
				data : result.data
			})
		} else if (req.params.action === 'getGithubLoginStatus') {
			res.json({
				success : true,
				service : req.cookies.githubConnect
			})
		} else if (req.params.action === 'getRedditLoginStatus') {
			res.json({
				success : true,
				service : req.cookies.redditConnect
			})
		} else if (req.params.action === 'getSlackLoginStatus') {
			res.json({
				success : true,
				service : req.cookies.slackConnect
			})
		} else if (req.params.action === 'getTrelloLoginStatus') {
			res.json({
				success : true,
				service : req.cookies.trelloConnect
			})
		}
	});

	await errorLogicRoutes.enableErrorLogicRoutes(app);

};

// authorizations routes
const githubAuthorizationRoutes = require('./Authorizations/githubAuthorizationRoutes');
const redditAuthorizationRoutes = require('./Authorizations/redditAuthorizationRoutes');
const slackAuthorizationRoutes = require('./Authorizations/slackAuthorizationRoutes');
const trelloAuthorizationRoutes = require('./Authorizations/trelloAuthorizationRoutes');
// Enable authorizations routes function
const enableAuthorizationsRoutes = async function(app) {
	await githubAuthorizationRoutes.enableGithubAuthorizationRoute(app);
	await redditAuthorizationRoutes.enableRedditAuthorizationRoute(app);
	await slackAuthorizationRoutes.enableSlackAuthorizationRoute(app);
	await trelloAuthorizationRoutes.enableTrelloAuthorizationRoute(app);
};

module.exports = {

	enableAllRoutes: async function (app) {
		await enableViewsRoutes(app);
		await enableLogicRoutes(app);
		await enableAuthorizationsRoutes(app);
	}

};
