//const fetch = require('node-fetch');
const axios = require('axios');
const snoowrap = require('snoowrap');
const clientSecret = 'TMXP7_srRo0CGHrXsyAggv-WRms';
const clientId = 'xxa4cp-hsWE_iA';

const RedditApiUrl = `https://www.reddit.com/api/v1`;
const RedditAuthApiUrl = `https://oauth.reddit.com/api/v1`;

exports.check_token = async function (req, res)
{
	// Check if there is an access token provided
	if (!req.body.access_token) {
		global.responseError(res, 401, 'Reddit service requires an access token');
		return;
	}

	// Check if there is no token already saved for this service
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : req.body.service});
	if (token) {
		global.responseError(res, 409, "You already have a token saved for " + req.body.service);
		return;
	}

	// Verify token validity with '/me' request, then respond
	var json = {
		user_id : req.body.user_id,
		service : global.Services.Reddit,
		access_token : req.body.access_token
	};
	const RedditAuthApi = axios.create({
		baseURL: `${RedditAuthApiUrl}`,
		crossDomain: true
	});
	RedditAuthApi
		.get(`/me`, {
			headers: {
				Authorization: `bearer ${req.body.access_token}`
			}
		})
		.then(function(response) {
			if (200 !== response.status)
				global.responseError(res, 401, 'Token is invalid : ' + response.error);
			else
				global.saveInDb(global.CollectionToken, json, res, 'Token Reddit saved.');
		})
		.catch(function(error) {
		global.responseError(res, 500, 'err : ' + error)
	})
};

exports.Reddit_Submit_Url = function (req, res, json) {

	let token = check_token(req, res);
	const r = new snoowrap({
		userAgent: 'Area_Dashboard++ - Marcoleric',
		clientId: clientId,
		clientSecret: clientSecret,
		refreshToken: token
	});
	r.getSubreddit('sub').submitLink({
		title: 'title',
		url: 'url'
	});
}


/* FETCH BACKUP
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
