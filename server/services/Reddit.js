const axios = require('axios');

/* General settings */
const generalSettings = {
	// Api
	redditApi: `https://www.reddit.com`,
	redditAuthApi: `https://oauth.reddit.com`,

	// App related
	clientId: 'xxa4cp-hsWE_iA',
	clientSecret: '466F9UWdI-Eh1iz7AhN8zNyszE8',
	redirectUri: 'https://areacoon-api.eu.ngrok.io/auth/redirect',
};

/* Initialize axios */
const RedditApi = axios.create({
	baseURL: generalSettings.redditApi,
	crossDomain: true
});
const RedditAuthApi = axios.create({
	baseURL: generalSettings.redditAuthApi,
	crossDomain: true
});

const checkToken = async function (json, access_token, refresh_token) {

	// Make sure that no token already saved for this service
	const token = await global.findInDbAsync(global.CollectionToken, {
		user_id: json.user_id,
		service: json.service
	});
	if (token) {
		console.log(`You already have a token saved for ${json.service}`);
		return;
	}

	// As tokens are valid, add them to the json to save them in db
	json.access_token = access_token;
	json.refresh_token = refresh_token;
	// Save tokens in db
	global.saveInDbAsync(global.CollectionToken, json);

};

const getAccessToken = async function (code) {
	const grantType = 'authorization_code';
	return await RedditApi
		.post(`api/v1/access_token` +
			`?grant_type=${grantType}` +
			`&code=${code}` +
			`&redirect_uri=${generalSettings.redirectUri}`,
			{},
			{
				auth: {
					username: generalSettings.clientId,
					password: generalSettings.clientSecret
				}
			})
		.catch(function (error) {
			console.log(error);
		})
};

module.exports = {

	generalSettings: generalSettings,

	is_service_active: async function (user_id) {
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
			`&redirect_uri=${generalSettings.redirectUri}` +
			`&scope=${scope}` +
			`&response_type=${responseType}` +
			`&duration=${duration}` +
			`&state=${token}`;
	},

	redirectAuth: async function (req, json) {
		const newreq = await getAccessToken(req.query.code);
		await checkToken(json, newreq.data.access_token, newreq.data.refresh_token);
	},

	postInSubreddit: function (area, res) {
		let title = global.getParams(area.reaction.params, "title");
		let text = global.getParams(area.reaction.params, "text");
		let sr = global.getParams(area.reaction.params, "sr");
		let kind = 'self';

		RedditAuthApi
			.post(`/submit` +
				`?title=${title}` +
				`&text=${text}` +
				`&sr=${sr}` +
				`&kind=${kind}`,
				{}, {
					headers: {
						Authorization: `bearer ${generalSettings.authorizationToken}`
					}
				}
			)
			.catch((error) => {
				console.log(error);
			})
	},

	postInSubredditCheck: function (json) {
		let title = global.getParams(area.reaction.params, "title");
		let text = global.getParams(area.reaction.params, "text");
		let sr = global.getParams(area.reaction.params, "sr");

		if (!(title && text && sr))
			return "Missing the title of the subreddit";
		return null;
	}


};
