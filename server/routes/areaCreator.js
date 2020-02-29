var uniqid = require('uniqid');

exports.CreateArea = function (req, res)
{
	global.new_area = true;
	checkAndSaveAREA(uniqid(), req, res);
}

exports.updateArea = function (req, res) {
	if (!req.body.area_id) {
		global.responseError(res, 401, 'Bad body');
		return ;
	}
	global.new_area = false;
	checkAndSaveAREA(req.body.area_id, req, res);
};

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
		responseError(res, 403, 'Reaction not found');
	else if (global.ActionMap.get(json.action.name)) {
		let err = await global.ReactionCheckArgsMap.get(json.reaction.name)(json);
		console.log(err);
		if (err)
			global.responseError(res, 403, err);
		else
			global.ActionMap.get(json.action.name)(res, json);
	}
	else
		responseError(res, 403, 'Action not found');
}

exports.deleteArea = function (req, res) {
	if (!req.body.area_id || !req.body.user_id) {
		global.responseError(res, 401, 'Need a area id');
		return ;
	}
	global.findInDb(global.CollectionArea, {area_id : req.body.area_id}, req, res, redirectToAreaDelete)
}

function redirectToAreaDelete(result, req, res)
{
	if (!result) {
		global.responseError(res, 401, 'Area not found');
		return;
	}
	if (global.ActionDeleteWebhookMap.get(result.action.name))
		global.ActionDeleteWebhookMap.get(result.action.name)(result, req, res)
	else
		responseError(res, 500, 'Error, Service not found, please contact Mike')
}
