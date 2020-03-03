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
	redirectUri: `${global.url}/auth/redirect/`,

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
	return `https://trello.com/1/authorize?callback_method=frament&return_url=${global.url}/auth/flow/${token}/&scope=read,write,account&expiration=never&name=Area_Dashboard++&key=cfd14732f1e65ebbfc3521de87b214a1&response_type=token`;
};

exports.redirect_auth = async function(req, json)
{
	// As tokens are valid, add them to the json to save them in db
	json.APIToken = req.query.token;
	json.APIKey = generalSettings.clientId;
	// Save tokens in db
	global.saveInDbAsync(global.CollectionToken, json);
};
