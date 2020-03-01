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
			//RedditApi.postInSubreddit();
			RedditApi.sendPrivateMessage(
				'lefevre_leo',
				'Reddit api in code',
				'And that\'s how you do it ! ;)'
			);
			ServerApi.setRedditAccessToken(app, req, res,
				RedditApi.generalSettings.authorizationToken,
				RedditApi.generalSettings.refreshToken);

		});

		app.get('/auth/connect/reddit', async function (req, res) {
			console.log(ServerApi.generalSettings.access_token);
			res.redirect(`${ServerApi.generalSettings.url}/auth/connect/Reddit?token=${ServerApi.generalSettings.access_token}`);
		})
	}

};
