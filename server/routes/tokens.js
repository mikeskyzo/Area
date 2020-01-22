var express = require('express');
var router = express.Router();

router.post('/auth/:app', function(req, res) {
	if (!req.body.user_id) {
		res.status(401);
		res.json({
			success : false,
			message : 'Bad body'
		});
		return;
	}
	global.DoesUserExist(req.body.user_id, req ,res, redirectApp);
});

function redirectApp(req, res)
{
	if (!req.body.access_token || !req.body.refresh_token || !req.body.expires_in) {
		res.status(401);
		res.json({
			success : false,
			message : 'Bad body'
		});
		return;
	}

	var json = new Object();
	json.user_id = req.body.user_id;
	json.created_the = Date.now();
	json.access_token = req.body.access_token;
	json.refresh_token = req.body.refresh_token;
	json.expires_in = req.body.expires_in;

	switch (req.params.app) {
		case global.serviceDiscord:
			json.service = global.serviceDiscord
			break;
		default:
			global.responseError(res, 401, 'Application not found');
			return;
		};
	global.saveInDb(global.CollectionToken, json, req, res, 'Token saved');
};

router.get('auth/getServices', function(req, res) {
	if (!req.body.user_id) {
		res.status(401);
		res.json({
			success : false,
			message : 'Bad body'
		});
		return;
	}
	global.DoesUserExist(req.body.user_id, req ,res, getServices);
});

function getServices(req, res)
{
	global.db.collection(global.CollectionToken).find({user_id : req.body.user_id}).toArray(function (err, result) {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
			});
			return;
		}
		res.json(result);
    })
}

module.exports = router;
