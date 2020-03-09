const axios = require('axios');

/* General settings */
const generalSettings = {
	// Api
	twitchApi: `https://api.twitch.tv/helix`,

	// App related
	clientId: process.env.TWITCH_ID,
	clientSecret: process.env.TWITCH_SECRET
};

/* Initialize axios */
const api = axios.create({
	baseURL: generalSettings.twitchApi,
	crossDomain: true
});

module.exports = {

	generalSettings: generalSettings,
	api: api,

	// Convert the login passed as param into a twitch user.
	getTwitchUser: async function (login) {

		// Request the id corresponding to the login
		let response = await api
			.get(`${generalSettings.twitchApi}/users` +
				`?login=${login}`, {
					headers: {
						'Client-ID': generalSettings.clientId
					}
				}
			)
			.catch((error) => {
				console.log(error);
			});

		// Check if the user has been found.
		if (response.data && response.data.data && response.data.data[0] && response.data.data[0].id)
			return {valid: true, value:response.data.data[0]};
		return {valid: false};

	}

};