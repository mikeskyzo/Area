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

exports.setRedditAccessToken = function(req, res, token) {
	var url = generalSettings.url + '/auth/addToken';

	var axios = require('axios');
	const ApplicationApi = axios.create({
		baseURL: generalSettings.url,
		crossDomain: true
	});
	console.log('Requesting...');
	ApplicationApi.post(`/auth/addToken`,
		{},
		{
			data: {
				'service': 'Reddit',
				'token': token
			},
			headers: {
				Authorization: `token ${generalSettings.access_token}`
			}
		}
	).then(function(response) {
		console.log('RESPONSE DATA');
		console.log(response.data);
		console.log('RESPONSE STATUS');
		console.log(response.status);
		res.redirect('/profil')
	}).catch(function(error) {
		console.log('RESPONSE DATA');
		console.log(error);
		res.redirect('/error')
	})

	/*
	$.ajax({
		method : "post",
		data : {'service' : 'Reddit', 'token' : token},
		headers: {
			'Authorization': `token ${generalSettings.access_token}`
		},
		crossDomain : true,
		url : url,
		success : async (data) => {
			res.redirect('/profil');
		},
		error : function (data, status, error) {
			console.log(error);
			res.redirect('/error');
		}
	});*/
};

/*
var axios = require('axios');

/ * General settings * /
const generalSettings = {
	// Api
	serverApi: ``,

	// Session related
	token: '' // to get in res after calling GET AUTHORIZATION TOKEN
};
*/