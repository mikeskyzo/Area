var axios = require('axios');

	/* General settings */
const generalSettings = {
	// Api
	slackAuthApi: 'https://slack.com/oauth/v2',
	slackApi: 'https://slack.com/api',

	// App related
	clientId: '933637704274.970114402768',
	clientSecret: '0d2c1b05fd3296f6187800add7fca3ce',
	redirectUri: 'http://localhost:8081/authorizations/slack',

	// Session related
	code: '', // To get in redirectUri req after calling GENERATE CODE
	authorizationToken: '' // to get in res after calling GET AUTHORIZATION TOKEN
};

	/* Initialize axios */
const SlackAuthApi = axios.create({
	baseURL: generalSettings.slackAuthApi,
	crossDomain: true
});
const SlackApi = axios.create({
	baseURL: generalSettings.slackApi,
	crossDomain: true
});

	/* Generate code */
function generateCodeUrl () {
	return ``
}


module.exports = {

	generalSettings: generalSettings,

/* Creating Api methods */

	/* Get access token (require to get code first) */
	getAccessToken: async function () {
		return await SlackApi.post(`/oauth.v2.access` +
			`?client_id=${generalSettings.clientId}` +
			`&client_secret=${generalSettings.clientSecret}` +
			`&code=${generalSettings.code}`
		)
	},

};
