const errorController = require('../../controllers/errorController');

module.exports = {

	enableErrorLogicRoutes: async function (app) {
		app.get('/error/:error', async function (req, res) {
		});
	}

};
