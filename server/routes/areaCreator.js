var uniqid = require('uniqid');

exports.CreateArea = function (req, res)
{
	global.new_area = true;
	switchAction(uniqid(), req, res);
}

function switchAction(area_id, req, res)
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

	// for (var key in global.Action) {
	// 	global.ActionMap.set()
	// }

	responseError(res, 401, 'Bad Action');
}

function redirectToReaction(req, res, json)
{
	json.reaction = req.body.reaction;
	responseError(res, 401, 'Bad Reaction');
}

function saveAREA(req, res, json)
{
	if (global.new_area)
		global.saveInDb(global.CollectionArea, json, req, res, 'Area created successfully');
	else {
		global.db.collection(global.CollectionArea).update({'area_id' : json.area_id, 'user_id' : json.user_id}, json, function(err, result) {
			if (err){
				res.status(500);
				res.json({
					success : false,
					message : err.message
				});
				return;
			}
			res.status(201);
            res.json({
                success : true,
                message : 'Area updated',
            });
		});
	}
}

exports.getAreas = function (req, res)
{
    global.db.collection(global.CollectionArea).find({user_id : req.body.user_id}).toArray(function (err, result) {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
			});
			return;
		}
		res.json(result);
    });
}

exports.updateArea = function (req, res) {
	if (!req.body.area_id || !req.body.action || !req.body.reaction) {
		global.responseError(res, 401, 'Bad body');
		return ;
	}
	global.new_area = false;
	switchAction(req.body.area_id, req, res);
};

exports.deleteArea = function (req, res) {
	if (!req.body.area_id || !req.body.user_id) {
		global.responseError(res, 401, 'Need a area id');
		return ;
	}
	var json = {user_id : req.body.user_id, area_id : req.body.area_id}
    global.db.collection(global.CollectionArea).deleteOne(json, function (err, result) {
		if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
			});
		}
			console.log(result);
			res.status(201);
            res.json({
                success : true,
                message : 'Area deleted',
            });
			return;
		});
}
