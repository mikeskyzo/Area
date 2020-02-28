var express = require('express');
var router = express.Router();

router.post('/webhooks/:areaId', function(req, res) {
	global.findInDb(global.CollectionArea, {area_id : req.params.areaId}, req, res, redirectToArea);
});

router.get('/webhooks/:areaId', function(req, res) {
	global.findInDb(global.CollectionArea, {area_id : req.params.areaId}, req, res, redirectToFinishWebhook);
});

module.exports = router;

function redirectToArea(area, req, res)
{
	if (!area) {
		global.responseError(res, 403, 'Area not is not existing')
		return;
	}
	if (!global.ReactionMap.get(area.reaction.name)) {
		global.responseError(res, 500, 'Reaction not found')
		return;
	}
	if (global.ActionFormatResultMap.get(area.action.name)) {
		global.ActionFormatResultMap.get(area.action.name)(req, res, area, global.ReactionMap.get(area.reaction.name));
		return;
	}
	global.responseError(res, 500, 'Action not found')
}

function redirectToFinishWebhook(area, req, res)
{
	if (!area) {
		global.responseError(res, 403, 'Area not is not existing')
		return;
	}
	if (global.ActionFinishWebhook.get(area.action.name)) {
		global.ActionFinishWebhook.get(area.action.name)(req, res, area);
		return;
	}
	global.responseError(res, 500, 'Action not found')
}
