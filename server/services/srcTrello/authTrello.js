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


exports.generate_url = function(token)
// {
// 	// return 'https://trello.com/1/authorize?expiration=never&name=Area_Dashboard++&scope=read&response_type=fragment&key=cfd14732f1e65ebbfc3521de87b214a1&callback_method=fragment&redirect_uri=https://localhost:8080/auth/redirect/' + token;
// 	return 'https://trello.com/1/authorize?expiration=never&name=Area_Dashboard++&scope=read&response_type=fragment&key=cfd14732f1e65ebbfc3521de87b214a1&callback_method=fragment&redirect_uri=' + 'http://localhost:8080/auth/redirect/' + token;
// }
{
	oauth.getOAuthRequestToken(function(error, token, tokenSecret, results) {
		if (error)
			console.log(error);
		const scope = 'read,write,account';
		const expiration = 'never';
		oauthSecrets[token] = tokenSecret;
	});
	return 'https://trello.com/1/authorize?expiration=never&name=Area_Dashboard++&scope=read&response_type=fragment&key=cfd14732f1e65ebbfc3521de87b214a1&callback_method=token&redirect_uri=https://areacoon-api.eu.ngrok.io/auth/redirect/' + token;
	// return 'https://trello.com/1/authorize?expiration=never&name=Area_Dashboard++&scope=read&response_type=fragment&key=cfd14732f1e65ebbfc3521de87b214a1&callback_method=fragment&redirect_uri=' + 'http://localhost:8080/auth/redirect/' + token;
}

exports.redirect_auth = async function(req, json)
{
	// const query = url.parse(req.url);
	// const token = query.oauth_token;
	// const tokenSecret = oauthSecrets[token];
	// const verifier = query.oauth_verifier;
	console.log('=========================');
	// console.log(query);
	console.log(req.query);
	// console.log(token);
	console.log('=========================');

	let url = 'http://eu.httpbin.org/basic-auth/user/passwd';
	let username = 'user';
	let password = 'passwd';

	// let headers = new Headers();
	// headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));

	// fetch(url, {method:'GET',
    //     headers: headers,
    // })
	// .then(response => response.json())
	// .then(json => console.log(json));
}