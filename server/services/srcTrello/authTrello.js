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
	return 'https://trello.com/1/OAuthAuthorizeToken?oauth_token=cfd14732f1e65ebbfc3521de87b214a1&name=Area_Dashboard++&scope=read,write,account&expiration=never&redirect_url=https://areacoon-api.eu.ngrok.io/auth/redirect/' + token;
}
// {
// 	oauth.getOAuthRequestToken(function(error, token, tokenSecret, results) {
// 		if (error)
// 			console.log(error);
// 		const scope = 'read,write,account';
// 		const expiration = 'never';
// 		oauthSecrets[token] = tokenSecret;
// 		sel = `${generalSettings.trelloApi}/OAuthAuthorizeToken?oauth_token=${token}&name=${generalSettings.appName}&scope=${scope}&expiration=${expiration}&redirect_uri=${generalSettings.redirectUri}` + ttoken;
// 		return `${generalSettings.trelloApi}/OAuthAuthorizeToken?oauth_token=${token}&name=${generalSettings.appName}&scope=${scope}&expiration=${expiration}&redirect_uri=${generalSettings.redirectUri}` + ttoken;
// 	});
// 	return sel;
// }

exports.redirect_auth = async function(req, json)
{
	const query = url.parse(req.url, true).query;
	const token = query.oauth_token;
	const tokenSecret = oauthSecrets[token];
	const verifier = query.oauth_verifier;

	oauth.getOAuthAccessToken(
		token, tokenSecret, verifier,
		function(error, accessToken, accessTokenSecret, results) {
			oauth.getProtectedResource(
				"https://api.trello.com/1/members/me",
				"GET", accessToken, accessTokenSecret,
				async function(error, data, response) {
					generalSettings.authorizationToken = accessToken;
					generalSettings.secretAuthorizationToken = accessTokenSecret;
					let token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : json.service})
					if (token)
						global.deleteInDbAsync(global.CollectionToken, {user_id : json.user_id, service : json.service});
					json.APIToken = generalSettings.authorizationToken;
					json.APIKey = generalSettings.clientId;
					await global.saveInDbAsync(global.CollectionArea, json);
				}
			);
	});
}