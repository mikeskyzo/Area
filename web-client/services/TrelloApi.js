var OAuth = require('oauth').OAuth;
var url = require('url');

/* General settings */
const generalSettings = {
	// Api
	trelloApi: 'https://trello.com/1',

	// App related
	appName: 'Area_Dashboard++',
	clientId: 'cfd14732f1e65ebbfc3521de87b214a1',
	clientSecret: '8efc48c0d75ff42474c06c236c3b85684c534cfab5f7538e026ea35bebd82eb5',
	redirectUri: 'http://localhost:8081/authorizations/trello',

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

module.exports = {

	generalSettings: generalSettings,

	/* Get access token (require to get code first) */
	requestTokenUrl: function (res) {
		oauth.getOAuthRequestToken(function(error, token, tokenSecret, results) {
			const scope = 'read';
			const expiration = '1hour';

			oauthSecrets[token] = tokenSecret;
			res.redirect(`${generalSettings.trelloApi}/OAuthAuthorizeToken` +
				`?oauth_token=${token}` +
				`&name=${generalSettings.appName}` +
				`&scope=${scope}` +
				`&expiration=${expiration}`
			);
		});
	},

	getAccessToken: function (req, res) {
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
					function(error, data, response) {
						generalSettings.authorizationToken = accessToken;
						generalSettings.secretAuthorizationToken = accessTokenSecret;
						res.redirect('/authorizations/trello/post-steps');
					}
				)
		});
	}

};
