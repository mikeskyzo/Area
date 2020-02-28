var axios = require('axios');

	/* General settings */
const generalSettings = {
	// Api
	redditApi: `https://www.reddit.com/api/v1/`,
	redditAuthApi: `https://oauth.reddit.com/api/v1/`,

	// App related
	clientId: 'xxa4cp-hsWE_iA',
	clientSecret: '466F9UWdI-Eh1iz7AhN8zNyszE8',
	redirectUri: 'http://localhost:8081/authorizations/reddit',

	// Session related
	code: '', // To get in redirectUri req after calling GENERATE CODE
	authorizationToken: '' // to get in res after calling GET AUTHORIZATION TOKEN
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

	/* Generate code */
function generateCodeUrl () {
	const responseType = 'code';
	const scope = 'edit identity flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread';
	const duration = 'permanent';
	const state = 'NONE';

	return `authorize` +
		`?client_id=${generalSettings.clientId}` +
		`&redirect_uri=${generalSettings.redirectUri}` +
		`&scope=${scope}` +
		`&response_type=${responseType}` +
		`&duration=${duration}` +
		`&state=${state}`
}


module.exports = {

	generalSettings: generalSettings,

/* Creating Api methods */

	/* Authorization */
	authorize: function () {
		const responseType = 'code';
		return RedditApi.get(`authorize?client_id=${generalSettings.clientId}&response_type=${responseType}`)
	},

	/* Get access token (require to get code first) */
	// Need Basic Auth =>
	//   username: clientId
	//   password: clientSecret
	getAccessToken: async function () {
		const grantType = 'authorization_code';
		return await RedditApi.post(`access_token` +
			`?grant_type=${grantType}` +
			`&code=${generalSettings.code}` +
			`&redirect_uri=${generalSettings.redirectUri}`,
			{},
			{
				auth: {
					username: generalSettings.clientId,
					password: generalSettings.clientSecret
				}
			}
		)
	},

	/* Get profile */
	// Need Header => Authorization: `bearer ${generalSettings.authorizationCode}`
	getProfile: function () {
		return RedditAuthApi
			.get(`me`, {
				headers: {
					Authorization: `bearer ${generalSettings.authorizationToken}`
				}
			})
			.catch(function (error) {
				console.log(error)
			})
	}

};
