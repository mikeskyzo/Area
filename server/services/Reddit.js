const axios = require('axios');
const fetch = require('node-fetch');
const base64 = require('base-64');

const submitReaction = require('./reddit/reactions/submitReaction');
const composeReaction = require('./reddit/reactions/composeReaction');

/* General settings */
const generalSettings = {
	// Api
	redditApi: `https://www.reddit.com`,
	redditAuthApi: `https://oauth.reddit.com`,

	// App related
	clientId: process.env.REDDIT_ID,
	clientSecret: process.env.REDDIT_SECRET,
	redirectUri: global.redirect_url
};

const saveToken = async function (json, access_token, refresh_token) {

	// Make sure that no token already saved for this service
	const token = await global.findInDbAsync(global.CollectionToken, {
		user_id: json.user_id,
		service: json.service
	});
	if (token)
		global.deleteInDbAsync(global.CollectionToken, {user_id : json.user_id, service : json.service});

	// As tokens are valid, add them to the json to save them in db
	json.access_token = access_token;
	json.refresh_token = refresh_token;
	// Save tokens in db
	global.saveInDbAsync(global.CollectionToken, json);

};

const getAccessToken = async function (code) {
	const grantType = 'authorization_code';
	const oauth = base64.encode(`${generalSettings.clientId}:${generalSettings.clientSecret}`)
	return await fetch(generalSettings.redditApi
		+ `/api/v1/access_token`
		+ `?grant_type=${grantType}`
		+ `&code=${code}`
		+ `&redirect_uri=${global.redirect_url}`,
		{
			'method': 'POST',
			headers : {'Authorization' : `Basic ${oauth}`}
		}
	);
}

module.exports = {

	generalSettings: generalSettings,

	//
	isServiceActive: async function (user_id) {
		let token = await global.findInDbAsync(
			global.CollectionToken, {
				user_id: user_id,
				service: global.Services.Reddit
			}
		);
		return !(!token || !token.access_token);
	},

	// Return the service url to redirect the user to as a string
	generateUrl: function (token) {
		const responseType = 'code';
		const scope = 'edit identity flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread';
		const duration = 'permanent';

		return `${generalSettings.redditApi}/api/v1/authorize` +
			`?client_id=${generalSettings.clientId}` +
			`&redirect_uri=${global.redirect_url}` +
			`&scope=${scope}` +
			`&response_type=${responseType}` +
			`&duration=${duration}` +
			`&state=${token}`;
	},

	// Called after authorized by user, used to save token in db
	redirectAuth: async function (req, json) {
		const newreq = await getAccessToken(req.query.code);
		let resJson = await newreq.json();
		console.log(resJson);
		await saveToken(json, resJson.access_token, resJson.refresh_token);
	},

	// SUBMIT
	postInSubreddit: async (area) => {
		await submitReaction.submitReaction(area);
	},
	postInSubredditCheck: (json) => {
		return submitReaction.submitReactionCheck(json);
	},

	// COMPOSE
	composePrivateMessage: async (area) => {
		await composeReaction.composeReaction(area);
	},
	composePrivateMessageCheck: (json) => {
		return composeReaction.composeReactionCheck(json);
	},
};