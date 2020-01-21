var express = require('express');
var uniqid = require('uniqid');

var router = express.Router();

var users = require('./users');
var weather = require('../services/weather')

router.post('/CreateArea', function(req, res, next) {
	var action = req.body.action,
		reaction = req.body.reaction;
	if (!action || !reaction || !req.body.user_id) {
		res.status(401);
        res.json({
            success : false,
            message : 'Bad Body'
        });
		return;
	}
	users.DoesUserExist(req.body.user_id, req, res, redirectToAction);
});

function redirectToAction(req, res)
{
	var json = new Object();
	json.area_id = uniqid();
	json.user_id = req.body.user_id;
	json.action = req.body.action;

	switch (req.body.action) {
		case global.Action_weather_time:
			if (req.body.time && req.body.city) {
				json.actionParams = {
					'city' : req.body.city,
					'time' : req.body.time
				}
				weather.DoesCityExist(req.body.city, req, res, json, redirectToReaction)
				return;
			}
			break;
		default:
			responseError(res, 401, 'Bad header');
			return;
	}
	responseError(res, 401, 'Bad header');
}

function redirectToReaction(req, res, json)
{
	json.reaction = req.body.reaction;
	switch (req.body.reaction) {
		case global.Reaction_discord_send_message:
			if (req.body.channel_id && req.body.message) {
				json.reactionParams = {
					'channel_id' : req.body.channel_id,
					'message' : req.body.message
				};
				createAREA(req, res, json);
				return;
			}
			break;
		default:
			responseError(res, 401, 'Bad header');
			return;
	}
	responseError(res, 401, 'Bad header');
}

function createAREA(req, res, json){
	global.saveInDb(global.CollectionArea, json, req, res, 'Area created successfully');
}

router.get('/GetArea', function(req, res, next) {
	var user_id = req.body.user_id;
	if (!user_id) {
		res.status(401);
        res.json({
            success : false,
            message : 'Bad Body'
        });
		return;
	}
    global.db.collection(global.CollectionArea).find({user_id : user_id}).toArray(function (err, result) {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
            });
		}
		res.json(result);
    })
});

module.exports = router;