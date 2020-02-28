var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

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

exports.connectUser = function(username, password, server, req, res) {
	var url = server + '/connectUser';

	$.ajax({
		method : "post",
		data : "username=" + username + "&password=" + password,
		crossDomain : true,
		url : url,
		success : function (data) {
			res.cookie('access_token', data.token);
			generalSettings.access_token = data.token;
			res.cookie('server', server);
			generalSettings.url = server;
			res.redirect('/dashboard');
		},
		error : function (data, status, error) {
			res.redirect('/error');
		}
	});
};

exports.createUser = function(email, Uname, Pword, server, req, res) {
	var url = server + '/createUser';

	$.ajax({
		method : "post",
		data : 'username=' + Uname + '&password=' + Pword,
		crossDomain : true,
		crossOrigin : true,
		url : url,
		success : async (data) => {
			res.cookie('access_token', data.token);
			generalSettings.access_token = data.token;
			res.cookie('server', server);
			generalSettings.url = server;
			res.redirect('/dashboard');
		},
		error : function (data, status, error) {
			res.redirect('/error');
		}
	});
};

exports.initGetActions = function(req, res, server, token) {
	const ApplicationApi = axios.create({
		baseURL: server,
		crossDomain: true
	});
	return ApplicationApi.get(`/getActions`,
		{
			headers: {
				Authorization: `token ${token}`
			}
		}
	)
};

exports.initGetReactions = function(req, res, server, token) {
	const ApplicationApi = axios.create({
		baseURL: server,
		crossDomain: true
	});
	return ApplicationApi.get(`/getReactions`,
		{
			headers: {
				Authorization: `token ${token}`
			}
		}
	)
};

// Authorizations
exports.setGithubAccessToken = function(req, res, token) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	ApplicationApi.post(
		`/auth/addToken`,
		{}, {
			data: {
				'service': 'Github',
				'access_token': token
			},
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).then(function(response) {
		res.cookie('githubConnect', true);
		res.redirect('/profil')
	}).catch(function(error) {
		console.log(error);
		res.cookie('githubConnect', false);
		res.redirect('/error')
	})
};
exports.setRedditAccessToken = function(app, req, res, accessToken, refreshToken) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	ApplicationApi.post(`/auth/addToken`,
		{},
		{
			data: {
				'service': 'Reddit',
				'access_token': accessToken,
				'refresh_token': refreshToken
			},
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).then(function(response) {
		res.cookie('redditConnect', true);
		app.logger.log(1, `Reddit connected ;)`);
		app.logger.log(1,'\n   ================================== \n');
		res.redirect('/profil')
	}).catch(function(error) {
		app.logger.log(1, `  An error occured : ${error.code}`);
		app.logger.log(2, '\t--------------------------');
		app.logger.log(2, error);
		app.logger.log(2, '\t--------------------------');
		app.logger.log(1,'\n   ================================== \n');
		res.cookie('redditConnect', false);
		res.redirect('/error')
	})
};
exports.setSlackAccessToken = function(req, res, token) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	ApplicationApi.post(
		`/auth/addToken`,
		{}, {
			data: {
				'service': 'Slack',
				'access_token': token
			},
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).then(function(response) {
		res.cookie('slackConnect', true);
		res.redirect('/profil')
	}).catch(function(error) {
		console.log(error);
		res.cookie('slackConnect', true);
		res.redirect('/error')
	})
};
exports.setTrelloAccessToken = function(req, res, apiToken, apiKey) {
	ApplicationApi.baseURL = generalSettings.url;
	ApplicationApi.defaults.baseURL = generalSettings.url;
	ApplicationApi.post(
		`/auth/addToken`,
		{}, {
			data: {
				'service': 'Trello',
				'APIToken': apiToken,
				'APIKey': apiKey
			},
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).then(function(response) {
		res.cookie('trelloConnect', true);
		res.redirect('/profil')
	}).catch(function(error) {
		//console.log(error);
		res.cookie('trelloConnect', true);
		res.redirect('/error')
	})
};
