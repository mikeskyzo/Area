var express = require('express');
var router = express.Router();

router.post('/webhooks/:areaId', async function(req, res) {
	let area = await global.findInDbAsync(global.CollectionArea, {area_id : req.params.areaId});
	redirectToArea(area, req, res);
});

router.get('/webhooks/:areaId', async function(req, res) {
	let area = await global.findInDbAsync(global.CollectionArea, {area_id : req.params.areaId});
	redirectToFinishWebhook(area, req, res);
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
	if (global.ActionFinishWebhook.get(area.action.name)) {
		let result = global.ActionFinishWebhook.get(area.action.name)(req, res, area);
		if (result === true)
			global.deleteInDbAsync(global.CollectionArea, {area_id : area.area_id});
		return;
	}
	global.sendResponse(res, 500, 'Action not found')
}
