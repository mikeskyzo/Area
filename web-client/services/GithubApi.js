var axios = require('axios');

	/* General settings */
const generalSettings = {
	// Api
	githubApi: `https://github.com/login/oauth`,

	// App related
	clientId: 'c71306995aa8289f4818',
	clientSecret: '0e56e81c5a398c6d6219f184fd7cf741aaa31ee7',
	redirectUri: 'http://localhost:8081/authorizations/github',

	// Session related
	code: '', // To get in redirectUri req after calling GENERATE CODE
	authorizationToken: '' // to get in res after calling GET AUTHORIZATION TOKEN
};

	/* Initialize axios */
const GithubApi = axios.create({
	baseURL: generalSettings.githubApi,
	crossDomain: true
});

	/* Generate code */
function generateCodeUrl () {
	const scope = 'admin:repo_hook%20repo';

	return `https://github.com/login/oauth/authorize` +
		`?client_id=${generalSettings.clientId}` +
		`&scope=${scope}`
}


module.exports = {

	generalSettings: generalSettings,

/* Creating Api methods */

	/* Get access token (require to get code first) */
	getAccessToken: async function () {
		return await GithubApi.post(`/access_token` +
			`?client_id=${generalSettings.clientId}` +
			`&client_secret=${generalSettings.clientSecret}` +
			`&code=${generalSettings.code}`
		)
	},

};
