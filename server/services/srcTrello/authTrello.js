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
	/*
	console.log('===========================================================================');
	console.log(`\nYou made it up here ! Now I'll try to allow you to authorize Trello !\n`);
	console.log('===========================================================================');
	 */
	/*
	const scope = 'read,write,account';
	const expiration = 'never';
	OAuth.getOAuthRequestToken((error, token, tokenSecret, results)=> {
		oauthSecrets[token] = tokenSecret;
		return `https://trello.com/1/OAuthAuthorizeToken` +
			`?oauth_token=${token}` +
			`&name=${generalSettings.appName}` +
			`&scope=${scope}` +
			`&expiration=${expiration}`;
	});*/
	console.log(`-----------------------`);
	console.log(token);
	console.log(`-----------------------`);
	return `https://trello.com/1/authorize?callback_method=frament&return_url=${global.url}/auth/flow/${token}/&scope=read,write,account&expiration=never&name=Area_Dashboard++&key=cfd14732f1e65ebbfc3521de87b214a1&response_type=token`;
};

exports.redirect_auth = async function(req, json)
{
	console.log(`=======================`);
	console.log(`\nI'll try to parse url\n`);
	console.log(req.query);
	console.log(req.query.token);
	console.log(`=======================`);
	console.log(json);
	console.log(`=======================`);
	// As tokens are valid, add them to the json to save them in db
	json.APIToken = req.query.token;
	json.APIKey = generalSettings.clientId;
	// Save tokens in db
	global.saveInDbAsync(global.CollectionToken, json);
};
