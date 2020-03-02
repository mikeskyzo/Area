const OAuth = require('oauth').OAuth;
const url = require('url');
/* General settings */
const generalSettings = {
	// Api
	trelloApi: 'https://trello.com/1',

	// App related
	appName: 'Area_Dashboard++',
	clientId: 'cfd14732f1e65ebbfc3521de87b214a1',
	clientSecret: '8efc48c0d75ff42474c06c236c3b85684c534cfab5f7538e026ea35bebd82eb5',
	redirectUri: 'https://areacoon-api.eu.ngrok.io/auth/redirect/',

	// Session related
	authorizationToken: '', // to get in res after calling GET AUTHORIZATION TOKEN
	secretAuthorizationToken: '' // to get in res after calling GET AUTHORIZATION TOKEN
};
/* Initializing OAuth instance */
const oauthSecrets = {};
const oauth = new OAuth(
	`${generalSettings.trelloApi}/OAuthGetRequestToken`,
	`${generalSettings.trelloApi}/OAuthGetAccessToken`,
	generalSettings.clientId, 
	generalSettings.clientSecret,
	"1.0A",
	generalSettings.redirectUri,
	"HMAC-SHA1"
);

let sel = "";

exports.generate_url = function(token)
{
	console.log('===========================================================================');
	console.log(`\nYou made it up here ! Now I'll tru to allow you to authorize Trello !\n`);
	console.log('===========================================================================');
	return `https://trello.com/1/authorize?callback_method=fragment&return_url=${global.url}/auth/redirect/&scope=read,write,account&expiration=never&name=Area_Dashboard++&key=cfd14732f1e65ebbfc3521de87b214a1&response_type=token`;
}

exports.redirect_auth = async function(req, json)
{
	console.log(`=======================`);
	console.log(`\nI'll try to parse url\n`);
	const query = url.parse(req.url, true).query;
	console.log(query);
	const token = req.query.oauth_token;
	const tokenSecret = oauthSecrets[token];
	const verifier = req.query.oauth_verifier;
	console.log(`=======================`);

	oauth.getOAuthAccessToken(
		token, tokenSecret, verifier,
		function(error, accessToken, accessTokenSecret, results) {
			oauth.getProtectedResource(
				"https://api.trello.com/1/members/me",
				"GET", accessToken, accessTokenSecret,
				async function(error, data, response) {
					json.access_token = accessToken;
					json.accessTokenSecret = accessTokenSecret;
					let token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.Services.Trello})
					if (token)
						global.deleteSomeInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.Services.Trello});
					await global.saveInDbAsync(global.CollectionArea, json);
				}
			);
	});
}