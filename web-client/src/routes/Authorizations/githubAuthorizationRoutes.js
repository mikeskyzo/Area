const GithubApi = require('../../services/GithubApi');
const ServerApi = require('../../services/ApplicationServer');

module.exports = {

	enableGithubAuthorizationRoute: async function (app) {
		app.get('/authorizations/github', async function (req, res) {

			app.logger.log(1, '\n   ====== Github authorization ======\n');
			GithubApi.generalSettings.code = req.query.code;
			const newres = await GithubApi.getAccessToken();
			GithubApi.generalSettings.authorizationToken = newres.data.split('&')[0].split('=')[1];
			ServerApi.setGithubAccessToken(req, res, GithubApi.generalSettings.authorizationToken);

		});
	}

};
