var express = require('express');
var router = express.Router();

router.post('/webhooks/:areaId', function(req, res) {
	global.findInDb(global.CollectionArea, {area_id : req.params.areaId}, req, res, redirectToArea)
});

module.exports = router;

function redirectToArea(area, req, res)
{
	if (!area) {
		global.responseError(res, 401, 'Area not is not existing')
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