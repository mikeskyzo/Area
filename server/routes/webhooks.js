var express = require('express');
var router = express.Router();

router.post('/webhooks/:areaId', function(req, res) {
	global.findInDb(global.CollectionArea, {area_id : req.params.areaId}, req, res, redirectToArea);
});

router.get('/webhooks/:areaId', function(req, res) {
	global.findInDb(global.CollectionArea, {area_id : req.params.areaId}, req, res, redirectToFinishWebhook);
});

module.exports = router;

async function redirectToArea(area, req, res)
{
	if (!area) {
		global.sendResponse(res, 403, 'Area not is not existing')
		return;
	}
	if (!global.ReactionMap.get(area.reaction.name)) {
		global.sendResponse(res, 500, 'Reaction not found')
		return;
	}
	if (global.ActionFormatResultMap.get(area.action.name)) {
		let result = global.ActionFormatResultMap.get(area.action.name)(req);
		if (result == null) {
			global.sendResponse(res, 200)
			return;
		}
		let err = await global.ReactionMap.get(area.reaction.name)(area, result);
		if (err)
			console.log(err); // Write in the log
		global.sendResponse(res, 200)
		return;
	}
	global.sendResponse(res, 500, 'Action not found')
}

function redirectToFinishWebhook(area, req, res)
{
	if (!area) {
		global.sendResponse(res, 401, 'Area is not existing')
		return;
	}
	if (global.ActionFinishWebhook.get('Twitch_Create_Webhook_New_Subscriber')) {
		global.ActionFinishWebhook.get('Twitch_Create_Webhook_New_Subscriber')(req, res, area);
		return;
	}
	global.sendResponse(res, 500, 'Action not found')
}
