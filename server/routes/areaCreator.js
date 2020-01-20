var express = require('express');
var router = express.Router();

var users = require('./users');
var uniqid = require('uniqid');

const areaCollection = 'Area'

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
		case 'weather_time':
			if (req.body.time && req.body.city) {
				json.actionParams = {
					'city' : req.body.city,
					'time' : req.body.time
				};
				redirectToReaction(req, res, json, req.body.reaction);
				return;
			}
		default:
			returnError(res);
	}
	returnError(res);
}

function redirectToReaction(req, res, json, reaction)
{
	json.reaction = reaction;
	switch (reaction) {
		case 'discord_send_message':
			if (req.body.channel_id && req.body.message) {
				json.reactionParams = {
					'channel_id' : req.body.channel_id,
					'message' : req.body.message
				};
				createAREA(req, res, json);
				return;
			}
		default:
			returnError(res);
	}
	returnError(res);
}

function createAREA(req, res, json){
    global.db.collection(areaCollection).insertOne(json, (err, result) => {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
			});
			return;
		}
        res.status(201);
        res.json({
            success : true,
            message : 'Area created successfully'
        })
	});
}


function returnError(res) {
	res.status(401);
	res.json({
		success : false,
		message : 'Bad header, check all body'
	});
	return;
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
    global.db.collection(areaCollection).find({user_id : user_id}).toArray(function (err, result) {
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