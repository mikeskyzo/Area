const Twitch = require('../utils');

module.exports = {

	createAction: async function(res, json) {

		// Check if the login provided corresponds to a correct twitch user
		let twitchUser = await Twitch.getTwitchUser(global.getParam(json.action.params, 'login'));
		if (!twitchUser.valid) {
			global.responseError(res, 404, 'error: the provided username does not match with any Twitch user.');
			return;
		}

		// Set params
		let hub = {
			mode: `subscribe`,
			callback: `${global.url}/webhooks/${json.area_id}`,
			lease: `86400`,
			secret: `${Twitch.generalSettings.clientSecret}`
		};
		// Set topic (webhook)
		let topic = `${Twitch.generalSettings.twitchApi}/streams` +
			`?user_id=${twitchUser.value.id}` +
			`&hub.mode=${hub.mode}` +
			`&hub.callback=${hub.callback}` +
			`&hub.lease_seconds=${hub.lease}`; //+
			//`&hub.secret=${hub.secret}`;

		// Create webhook
		await Twitch.api
			.post(`${Twitch.generalSettings.twitchApi}/webhooks/hub` +
				`?hub.topic=${topic}`, {}, {
					headers: {
						'Client-ID': Twitch.generalSettings.clientId
					}
				}
			)
			.then(async (twitchResponse) => {
				if (202 !== twitchResponse.status) {
					console.log('A');
					global.responseError(res, 401, 'error, webhook not created, maybe you created too much webhook at once');
					return;
				}
				await global.saveInDbAsync(global.CollectionArea, json);
				res.status(202).send();
			})
			.catch((error) => {
				console.log(error);
				global.responseError(res, 401, 'error, webhook not created, maybe you created too much webhook at once');
			});

	},

	deleteAction: async function(area, req, res) {

		console.log('deleting...');

		// Check if the login provided corresponds to a correct twitch user
		let twitchUser = await Twitch.getTwitchUser(global.getParam(area.action.params, 'login'));
		if (!twitchUser.valid) {
			global.responseError(res, 404, 'error: the provided username does not match with any Twitch user.');
			return;
		}

		// Set params
		let hub = {
			mode: `unsubscribe`,
			callback: `${global.url}/webhooks/${area.area_id}`,
			lease: `86400`,
			secret: `${Twitch.generalSettings.clientSecret}`
		};
		// Set topic (webhook)
		let topic = `https://api.twitch.tv/helix/streams` +
			`?user_id=${twitchUser.value.id}` +
			`&hub.mode=${hub.mode}` +
			`&hub.callback=${hub.callback}` +
			`&hub.lease_seconds=${hub.lease}`;// +
			//`&hub.secret=${hub.secret}`;

		// Create webhook
		await Twitch.api
			.post(`${Twitch.generalSettings.twitchApi}/webhooks/hub` +
				`?hub.topic=${topic}`, {}, {
					headers: {
						'Client-ID': Twitch.generalSettings.clientId
					}
				}
			)
			.then(async (twitchResponse) => {
				if (202 !== twitchResponse.status) {
					global.responseError(res, 401, 'error, webhook not deleted');
					return;
				}
				await global.deleteInDbAsync(global.CollectionArea, area);
				res.status(202).send();
			})
			.catch((error) => {
				console.log(error);
				global.responseError(res, 401, 'error, webhook not deleted');
			});
	}

};
