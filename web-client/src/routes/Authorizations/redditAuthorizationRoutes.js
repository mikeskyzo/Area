const RedditApi = require('../../services/RedditApi');
const ServerApi = require('../../services/ApplicationServer');

module.exports = {

	enableRedditAuthorizationRoute: async function (app) {
		app.get('/authorizations/reddit', async function (req, res) {

			app.logger.log(1,'\n   ====== Reddit authorization ====== \n');
			RedditApi.generalSettings.code = req.query.code;
			const newres = await RedditApi.getAccessToken();
			app.logger.log(2, `Reddit sent us those datas :`);
			app.logger.log(2, newres.data);
			RedditApi.generalSettings.authorizationToken = newres.data.access_token;
			RedditApi.generalSettings.refreshToken = newres.data.refresh_token;
			ServerApi.setRedditAccessToken(req, res,
				RedditApi.generalSettings.authorizationToken, RedditApi.generalSettings.refreshToken);

		});
	}

};
