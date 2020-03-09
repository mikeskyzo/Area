// Actions
const newSubscriber = require('./twitch/actions/newSubscriber');
const streamChangingOfState = require('./twitch/actions/streamChangingOfState');

module.exports = {

	// As Twitch doesn't require any account authorization, always return true
	isServiceActive: async function(user_id) {
		return true;
	},

	// Twitch webhooks don't need any formatting.
	// Therefore, formatting will be ignored thanks to this function
	ignore: async function(req, res, area, next) {
		next(area, res);
	},

	// ACTIONS

	// New subscriber
	newSubscriberWebhookCreate: async function(res, json, next) {
		await newSubscriber.createAction(res, json);
	},
	newSubscriberWebhookDelete: async function(area, req, res) {
		await newSubscriber.deleteAction(area, req, res);
	},

	// Stream changing state
	streamChangingOfStateWebhookCreate: async function(res, json, next) {
		await streamChangingOfState.createAction(res, json);
	},
	streamChangingOfStateWebhookDelete: async function(area, req, res) {
		await streamChangingOfState.deleteAction(area, req, res);
	},

	confirmWebhookFunctionTwitch: function(req, res, area) {
		res.send(req.query["hub.challenge"], 200);
	}

};
