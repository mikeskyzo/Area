const fetch = require('node-fetch');

const RedditApiUrl = `https://www.reddit.com/api/v1`;
const RedditAuthApiUrl = `https://oauth.reddit.com/api/v1`;

exports.check_token = async function (req, res)
{
	// Check if there is an access token provided
	if (!req.body.access_token) {
		global.responseError(res, 401, 'Reddit service requires an access token');
		return;
	}

	console.log(`The token provided to server is ${req.body.access_token}`);

	// Check if there is no token already saved for this service
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : req.body.service});
	if (token) {
		global.responseError(res, 409, "You already have a token saved for " + req.body.service);
		return;
	}

	// Respond
	var json = {
		user_id : req.body.user_id,
		service : global.Services.Reddit,
		access_token : req.body.access_token
	};
	var axios = require('axios');
	const RedditAuthApi = axios.create({
		baseURL: `${RedditAuthApiUrl}`,
		crossDomain: true
	});
	console.log(`Trying to get Reddit profile from axios...\n`);
	RedditAuthApi.get(`/me`,
		{
			headers: {
				Authorization: `bearer ${req.body.access_token}`
			}
		}
	).then(function(response) {
		console.log(`Response status : ${response.status}`);
		if (200 !== response.status)
			global.responseError(res, 401, 'Token is invalid : ' + response.error);
		else
			global.saveInDb(global.CollectionToken, json, res, 'Token Reddit saved.');
	}).catch(function(error) {
		console.log('RESPONSE ERROR');
		console.log(error);
		global.responseError(res, 500, 'err : ' + error)
	})
	/*
	fetch(
		`${RedditAuthApiUrl}/me`,
		{'method': 'GET', },
		{headers: { Authorization: `bearer ${req.body.access_token}` } }
	)
		.then(function (response) {
			console.log(response);
			if (response.ok === false) {
				global.responseError(res, 401, 'Token is invalid : ' + resjson.error)
			} else {
				global.saveInDb(global.CollectionToken, json, res, 'Token Reddit saved for ' + resjson.user  + ' on ' + resjson.team);
			}
		})
		.catch(function (error) {
			global.responseError(res, 500, 'err : ' + error)
		});
	 */
};
