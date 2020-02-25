var servicesJson = require('../services.json');

exports.getAreas = function (req, res)
{
    global.db.collection(global.CollectionArea).find({user_id : req.body.user_id}).toArray(function (err, result) {
        if (err) {
            global.responseError(res, 401, err.message)
			return;
		}
		result.forEach(element => {
			delete element._id;
		});
		res.json(result);
    });
}

exports.getNameAreas = function (req, res)
{
    global.db.collection(global.CollectionArea).find({user_id : req.body.user_id}).toArray(function (err, result) {
        if (err) {
            global.responseError(res, 401, err.message);
			return;
		}
		result.forEach(element => {
			delete element._id;
			delete element.user_id;
			element.action = getService(element.action.name, 'actions');
			element.reaction = getService(element.reaction.name, 'reactions');
			if (element.reaction == null || element.action == null) {
				console.error('ERROR');
				element = null;
			}
		});
		res.json({areas : result});
    });
}

function getService(actionName, field)
{
	for (nb in servicesJson.services)
		for (i in servicesJson.services[nb][field])
			if (servicesJson.services[nb][field][i].name === actionName)
				return servicesJson.services[nb].name;
	return null;
}

exports.getArea = function (req, res)
{
    global.db.collection(global.CollectionArea).findOne({user_id : req.body.user_id, area_id : req.params.AreaId}, function (err, result) {
        if (err) {
            global.responseError(res, 401, err.message)
			return;
		}
		if (!result)
			global.responseError(res, 401, 'Area not found');
		else
			res.json(result);
    });
}
