const TrelloApi = require('../../services/TrelloApi');
const ServerApi = require('../../services/ApplicationServer');

module.exports = {

	enableTrelloAuthorizationRoute: async function (app) {

		app.get('/authorizations/trello/pre-steps', async function (req, res) {
			app.logger.log(1, '\n   ====== Trello authorization - Part.1 ====== \n');
			TrelloApi.requestTokenUrl(res);
		});

		app.get('/authorizations/trello', async function (req, res) {
			app.logger.log(1, '\n   ====== Trello authorization - Part.2 ====== \n');
			TrelloApi.getAccessToken(req, res);
		});

		app.get('/authorizations/trello/post-steps', async function (req, res) {
			app.logger.log(1, '\n   ====== Trello authorization - Part.3 ====== \n');
			ServerApi.setTrelloAccessToken(req, res,
				TrelloApi.generalSettings.authorizationToken,
				TrelloApi.generalSettings.clientId
			);
		});

	}

};
