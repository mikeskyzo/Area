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
			console.log(generalSettings);
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

// Authorizations
exports.setGithubAccessToken = function(req, res, token) {
	var axios = require('axios');
	const ApplicationApi = axios.create({
		baseURL: generalSettings.url,
		crossDomain: true
	});
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
		res.redirect('/profil')
	}).catch(function(error) {
		//console.log(error);
		res.redirect('/error')
	})
};
exports.setRedditAccessToken = function(req, res, token) {
	var axios = require('axios');
	const ApplicationApi = axios.create({
		baseURL: generalSettings.url,
		crossDomain: true
	});
	ApplicationApi.post(`/auth/addToken`,
		{},
		{
			data: {
				'service': 'Reddit',
				'access_token': token
			},
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).then(function(response) {
		res.redirect('/profil')
	}).catch(function(error) {
		res.redirect('/error')
	})
};
exports.setSlackAccessToken = function(req, res, token) {
	var axios = require('axios');
	const ApplicationApi = axios.create({
		baseURL: generalSettings.url,
		crossDomain: true
	});
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
		res.redirect('/profil')
	}).catch(function(error) {
		console.log(error);
		res.redirect('/error')
	})
};
