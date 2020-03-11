generalSettings = {
	url: 'undefined2',
	access_token: 'undefined2'
};

// Initializing
var axios = require('axios');
const ApplicationApi = axios.create({
	baseURL: generalSettings.url,
	crossDomain: true
});

exports.generalSettings = generalSettings;

exports.connectUser = function(req, res, username, password, server) {
	ApplicationApi.baseURL = server;
	ApplicationApi.defaults.baseURL = server;
	ApplicationApi.post(
		`/connectUser`,
		{}, {
			data: {
				'username': username,
				'password': password
			},
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).then(function(response) {
		res.cookie('access_token', response.token);
		generalSettings.access_token = response.token;
		res.cookie('server', server);
		generalSettings.url = server;
		res.redirect('/dashboard');
	}).catch(function(error) {
		if (error.response.status < 300) {
			console.log(error.response.data.message);
		} else {
			res.redirect('/error');
		}
	});
};

exports.createUser = function(req, res, username, password, server) {
	ApplicationApi.baseURL = server;
	ApplicationApi.defaults.baseURL = server;
	ApplicationApi.post(
		`/createUser`,
		{}, {
			data: {
				'username': username,
				'password': password
			},
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).then(function(response) {
		res.cookie('access_token', response.token);
		generalSettings.access_token = response.token;
		res.cookie('server', server);
		generalSettings.url = server;
		res.redirect('/dashboard');
	}).catch(function(error) {
		if (error.response.status < 300) {
			console.log(error.response.data.message);
		} else {
			res.redirect('/error');
		}
	});
};

exports.initGetActions = function(req, res) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	return ApplicationApi.get(`/getActions`,
		{
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	)
};

exports.initGetReactions = function(req, res) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	return ApplicationApi.get(`/getReactions`,
		{
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	)
};

exports.initGetAreas = function(req, res) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	return ApplicationApi.get(`/GetAreas`,
		{
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	)
};

exports.createArea = async function(req, res, areaToCreate) {
	var result = "";

	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	await ApplicationApi.post(
		`/CreateArea`,
		{}, {
			data: areaToCreate,
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).then(function(response) {
		result = "Area created with success";
	}).catch(function(error) {
		result = "Something went wrong, please try again";
		console.log(error);
	});
	return result;
};

exports.deleteArea = function(req, res, areaId) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	ApplicationApi.delete(
		`/DeleteArea`,
		{
			data: {
				'area_id': areaId
			},
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).catch(function(error) {
		res.redirect('/error')
	})
};

exports.disconnectService = function(req, res, url) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	ApplicationApi.delete(
		url,
		{
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).catch(function(error) {
		res.redirect('/error')
	})
};

exports.getServices = function(req, res) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	return ApplicationApi.get(`/getServices`,
		{
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	)
};
