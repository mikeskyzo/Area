//const fetch = require('node-fetch');
const axios = require('axios');
const snoowrap = require('snoowrap');
const clientSecret = 'TMXP7_srRo0CGHrXsyAggv-WRms';
const clientId = 'xxa4cp-hsWE_iA';

const RedditApiUrl = `https://www.reddit.com/api/v1`;
const RedditAuthApiUrl = `https://oauth.reddit.com/api/v1`;

const checkBody = function (req, res) {
	// Check if there is an access token provided
	if (!req.body.access_token) {
		global.responseError(res, 401, 'Reddit service requires an access token');
		return false;
	}

	// Check if there is an access token provided
	if (!req.body.refresh_token) {
		global.responseError(res, 401, 'Reddit service requires a refresh token');
		return false;
	}

	return true;
};

exports.check_token = async function (req, res)
{
	// Check if all required datas are in body
	if (!checkBody(req, res))
		return;

	// Make sure that no token already saved for this service
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : req.body.service});
	if (token) {
		global.responseError(res, 409, "You already have a token saved for " + req.body.service);
		return;
	}

	// Verify token validity with '/me' request, then respond
	const json = {
		user_id : req.body.user_id,
		service : global.Services.Reddit,
		access_token : req.body.access_token,
		refresh_token : req.body.refresh_token
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

exports.Reddit_Submit_Url = async function (req, res, json) {

	let token = await global.findInDbAsync(global.refresh_token, {user_id : area.user_id, service : global.Services.Reddit});
	let sub = await  global.getParam(area.reaction.params, 'subreddit');
	let title = await  global.getParam(area.reaction.params, 'title');
	let url = await  global.getParam(area.reaction.params, 'url');
	if (!token || !token.access_token) {
		global.responseError(res, 401, 'No access token provide');
		return;
	}
	const r = new snoowrap({
		userAgent: 'Area_Dashboard++ - Marcoleric',
		clientId: clientId,
		clientSecret: clientSecret,
		refreshToken: token
	});
	r.getSubreddit(sub).submitLink({
		title: title,
		url: url
	}).then(console.log);
};

exports.Reddit_Submit_Url_CheckArgs = async function (json){
	if (!global.getParam(json.reaction.params, 'subreddit'))
		return 'Missing subreddit';
	else if (!global.getParam(json.reaction.params, 'title'))
		return 'Missing title';
	else if (!global.getParam(json.reaction.params, 'url'))
		return 'Missing url';
	else
		return null;
};

exports.Reddit_Submit_post = async function (req, res, json){

	let token = await global.findInDbAsync(global.refresh_token, {user_id : area.user_id, service : global.Services.Reddit});
	let sub = await  global.getParam(area.reaction.params, 'subreddit');
	let title = await  global.getParam(area.reaction.params, 'title');
	let text = await  global.getParam(area.reaction.params, 'text');
	if (!token || !token.access_token) {
		global.responseError(res, 401, 'No access token provide');
		return;
	}
	const r = new snoowrap({
		userAgent: 'Area_Dashboard++ - Marcoleric',
		clientId: clientId,
		clientSecret: clientSecret,
		refreshToken: token
	});

	r.submitSelfpost({
		subredditName: sub,
		title: title,
		text: text
	}).then(console.log);
};

exports.Reddit_Submit_post_CheckArgs = async function (json){
	if (!global.getParam(json.reaction.params, 'subreddit'))
		return 'Missing subreddit';
	else if (!global.getParam(json.reaction.params, 'title'))
		return 'Missing title';
	else if (!global.getParam(json.reaction.params, 'text'))
		return 'Missing text';
	else
		return null;
};

exports.Reddit_create_sub = async function (req, res, json){

	let token = await global.findInDbAsync(global.refresh_token, {user_id : area.user_id, service : global.Services.Reddit});
	let name = await  global.getParam(area.reaction.params, 'name');
	let title = await  global.getParam(area.reaction.params, 'title');
	let description = await  global.getParam(area.reaction.params, 'description');
	let Pdescription = await  global.getParam(area.reaction.params, 'Pdescription');
	let type = await  global.getParam(area.reaction.params, 'Type');
	if (!token || !token.access_token) {
		global.responseError(res, 401, 'No access token provide');
		return;
	}
	const r = new snoowrap({
		userAgent: 'Area_Dashboard++ - Marcoleric',
		clientId: clientId,
		clientSecret: clientSecret,
		refreshToken: token
	});

	r.createSubreddit({
		name: name,
		title: title,
		public_description: Pdescription,
		description: description,
		type: type
	}).then(console.log);
};

exports.Reddit_create_sub_CheckArgs = async function (json){
	if (!global.getParam(json.reaction.params, 'name'))
		return 'Missing name';
	else if (!global.getParam(json.reaction.params, 'title'))
		return 'Missing title';
	else if (!global.getParam(json.reaction.params, 'description'))
		return 'Missing description';
	else if (!global.getParam(json.reaction.params, 'Pdescription'))
		return 'Missing public description';
	else if (!global.getParam(json.reaction.params, 'type'))
		return 'Missing type';
	else
		return null;
};

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
