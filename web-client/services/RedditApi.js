import axios from 'axios';

// General settings
const generalSettings = {
		// Api
	redditApi: `https://www.reddit.com/api/v1/`,
	redditAuthApi: `https://oauth.reddit.com/api/v1`,

		// App related
	clientId: 'xxa4cp-hsWE_iA',
	clientSecret: '466F9UWdI-Eh1iz7AhN8zNyszE8',
	redirectUri: 'http://localhost:8081/authorizations/reddit',

		// Session related
	code: '', // To get in redirectUri req after calling GENERATE CODE
	authorizationToken: '' // to get in res after calling GET AUTHORIZATION TOKEN
};

	// Initialize axios
const RedditApi = axios.create({baseURL: generalSettings.redditApi});
const RedditAuthApi = axios.create({baseURL: generalSettings.redditAuthApi});

	// Creating Api methods
//export default {

	// Authorization
const authorize = function () {
	const responseType = 'code';
	return RedditApi.get(`authorize?client_id=${generalSettings.clientId}&response_type=${responseType}`)
};

	// Generate code
const generateCode = function () {
	const responseType = 'code';
	const scope = 'edit identity flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread';
	const duration = 'permanent';
	const state = 'NONE';

	console.log("Oui");
	return RedditApi.get(`authorize?client_id=${generalSettings.clientId}&redirect_uri=${generalSettings.redirectUri}&scope=${scope}&response_type=${responseType}&duration=${duration}&state=${state}`)
};

	// Get access token (require to get code first)
const getAccessToken = function () {
	// Need Basic Auth =>
	//   username: clientId
	//   password: clientSecret
	const grantType = 'authorization_code';
	return RedditApi.post(`access_token?grant_type=${grantType}&code=${generalSettings.code}&redirect_uri=${generalSettings.redirectUri}`)
};

	// Get profile
const getProfile = function () {
	// Need Header => Authorization: `bearer ${generalSettings.authorizationCode}`
	return RedditAuthApi.get(me)
};
