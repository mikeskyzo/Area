var uniqid = require('uniqid');

exports.CreateArea = function (req, res)
{
	checkAndSaveAREA(uniqid(), req, res);
}

async function checkAndSaveAREA(area_id, req, res)
{
	if (!req.body.action || !req.body.reaction) {
		res.status(401);
        res.json({
            success : false,
            message : 'Bad Body'
        });
		return;
	}

	var json = new Object();
	json.area_id = area_id;
	json.user_id = req.body.user_id;

	if (!req.body.area_name)
		json.area_name = 'Raccoon area'
	else
		json.area_name = req.body.area_name

	json.color = '#E3FF33'
	if (req.body.color)
		json.color = req.body.color

	json.action = req.body.action;
	json.reaction = req.body.reaction;

	if (!global.ReactionCheckArgsMap.get(json.reaction.name))
		global.sendResponse(res, 403, 'Reaction not found');
	else if (global.ActionMap.get(json.action.name)) {
		let err = await global.ReactionCheckArgsMap.get(json.reaction.name)(json);
		if (!err)
			err = await global.ActionMap.get(json.action.name)(json);
		if (err)
			global.sendResponse(res, 403, err);
		else {
			global.saveInDbAsync(global.CollectionArea, json);
			global.sendResponse(res, 200, 'Area created')
		}
	}
	else
		global.sendResponse(res, 403, 'Action not found');
}

exports.deleteArea = async function (req, res) {
	if (!req.body.area_id) {
		global.sendResponse(res, 401, 'Need a area id');
		return ;
	}
	let result = await global.findInDbAsync(global.CollectionArea, {user_id : req.body.user_id, area_id : req.body.area_id})
	if (!result) {
		global.sendResponse(res, 401, 'Area not found');
		return;
	}
	if (global.ActionDeleteWebhookMap.get(result.action.name)) {
		result = await global.ActionDeleteWebhookMap.get(result.action.name)(result)
		if (typeof result == 'String')
			global.sendResponse(res, 401, result)
		else {
			if (!(result === false))
				await global.deleteInDbAsync(global.CollectionArea, {area_id : req.body.area_id});
			global.sendResponse(res, 200, 'Area deleted')
		}
	}
	else
		global.sendResponse(res, 500, 'Service not found')
}