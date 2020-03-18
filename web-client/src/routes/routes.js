const ServerApi = require('../services/ApplicationServer');
var server_address = "https://areacoon-api.eu.ngrok.io";

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
		res.cookie('login_status', "true");
		res.cookie('register_status', "true");
		res.redirect('/login');
	});

	app.get('/dashboard', function (req, res) {
		if (req.cookies.access_token)
			res.render('dashboard.ejs');
		else
			res.redirect('/register');
	});

	app.get('/profil', function (req, res) {
		if (req.cookies.access_token)
			res.render('profil.ejs');
		else
			res.redirect('/register');
	});

	app.get('/mobile', function (req, res) {
		res.render('mobile.ejs');
	});

	app.get('/error', function (req, res) {
		res.render('error.ejs');
	});

};

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
			var username = req.body.usernameRegister;
			var password = req.body.passwordRegister;

			ServerApi.createUser(req, res, username, password, server_address);
		} else if (req.params.action === 'login') {
			var username = req.body.usernameLogin;
			var password = req.body.passwordLogin;

			ServerApi.connectUser(req, res, username, password, server_address);
		} else if (req.params.action == 'createArea') {
			var areaToCreate = JSON.parse(req.body.area);
			var result = await ServerApi.createArea(req, res, areaToCreate);
			res.json({
				result : result
			});
		} else if (req.params.action == 'deleteArea') {
		    var areaId = req.body.area_id;
		    ServerApi.deleteArea(req, res, areaId);
		    res.send();
		} else if (req.params.action == 'disconnectService') {
			var service = req.body.service;
			var url = "/auth/delete/" + service;
			ServerApi.disconnectService(req, res, url);
			res.send();
		} else if (req.params.action == 'changeServer') {
			server_address = req.body.newAddress;
			console.log(server_address);
			res.redirect('/register')
		} else {
			res.redirect('/error');
		}
	});

	app.get('/client/:action', async function (req, res) {
		if (req.params.action === 'getInitAction') {
			const result = await ServerApi.initGetActions(req, res);

			console.log(result);

			res.json({
				success : true,
				data : result.data
			})
		} else if (req.params.action === 'getInitReaction') {
			const result = await ServerApi.initGetReactions(req, res);
			res.json({
				success: true,
				data : result.data
			})
		} else if (req.params.action === 'getInitArea') {
			const result = await ServerApi.initGetAreas(req, res);
			res.json({
				success : true,
				data : result.data
			})
		} else if (req.params.action === 'getServices') {
            const result = await ServerApi.getServices(req, res);
            res.json({
				success : true,
				data : result.data,
				server : req.cookies.server,
				token : req.cookies.access_token
			})
		} else if (req.params.action === 'getRegisterStatus') {
			if (req.cookies.register_status === "false") {
				res.json({
					success : false,
					data: "Error : Username already taken"
				});
			} else {
				res.json({
					success : true
				})
			}
		} else if (req.params.action === 'getLoginStatus') {
			if (req.cookies.register_status === "false") {
				res.json({
					success : false,
					data: "Error : User not found"
				});
			} else {
				res.json({
					success : true
				})
			}
		}
	});
};

module.exports = {

	enableAllRoutes: async function (app) {
		await enableViewsRoutes(app);
		await enableLogicRoutes(app);
	}

};
