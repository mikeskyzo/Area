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

function checkAndSaveAREA(area_id, req, res)
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
	json.action = req.body.action;
	json.reaction = req.body.reaction;

	if (!global.ReactionCheckArgsMap.get(json.reaction)) {
		responseError(res, 401, 'Reaction not found');
		return;
	}
	if (global.ActionMap.get(json.action)) {
		global.ActionMap.get(json.action)(req, res, json, global.ReactionCheckArgsMap.get(json.reaction));
		return;
	}
	responseError(res, 401, 'Action not found');
}

exports.getAreas = function (req, res)
{
    global.db.collection(global.CollectionArea).find({user_id : req.body.user_id}).toArray(function (err, result) {
        if (err) {
            global.responseError(res, 401, err.message)
			return;
		}
		res.json(result);
    });
}

exports.deleteArea = function (req, res) {
	if (!req.body.area_id || !req.body.user_id) {
		global.responseError(res, 401, 'Need a area id');
		return ;
	}
	var json = {user_id : req.body.user_id, area_id : req.body.area_id}
    global.db.collection(global.CollectionArea).deleteOne(json, function (err, result) {
		if (err) {
            global.responseError(res, 500, err.message)
			return;
		}
		// console.log(result);
		res.status(201);
        res.json({
            success : true,
            message : 'Area deleted',
        });
		return;
		});
}
