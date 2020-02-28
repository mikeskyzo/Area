const SlackApi = require('../../services/SlackApi');
const ServerApi = require('../../services/ApplicationServer');

module.exports = {

	enableSlackAuthorizationRoute: async function (app) {
		app.get('/authorizations/slack', async function (req, res) {

			app.logger.log(1, '\n   ====== Slack authorization ====== \n');
			SlackApi.generalSettings.code = req.query.code;
			const newres = await SlackApi.getAccessToken();
			SlackApi.generalSettings.authorizationToken = newres.data.authed_user.access_token;
			ServerApi.setSlackAccessToken(req, res, SlackApi.generalSettings.authorizationToken);

		});
	}

};
