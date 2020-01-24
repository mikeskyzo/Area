var express = require('express');
var uniqid = require('uniqid');

var router = express.Router();

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
	global.DoesUserExist(req.body.user_id, req, res, redirectToAction);
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
				json.action_params = {
					'city' : req.body.city,
					'time' : req.body.time
				}
				weather.DoesCityExist(req.body.city, req, res, json, redirectToReaction)
				return;
			}
			break;
		case global.Action_weather_change :
			break;
		case global.Action_imgur_new_post :
			break;
		case global.Action_reddit_new_post_sub :
			break;
		case global.Action_reddit_new_post_follower :
			break;
		case global.Action_reddit_new_notification :
			break;
		case global.Action_clock_time_place :
			break;
		case global.Action_steam_players_on_game :
			break;
		case global.Action_steam_friend_online :
			break;
		case global.Action_discord_new_message :
			break;
		case global.Action_discord_user_send_message :
			break;
		case global.Action_youtube_channel_sub :
			break;
		case global.Action_youtube_channel_views :
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
				json.reaction_params = {
					'channel_id' : req.body.channel_id,
					'message' : req.body.message
				};
				createAREA(req, res, json);
				return;
			}
			break;
		case global.Reaction_discord_message_reaction :
			break;
		case global.Reaction_imgur_upload_picture :
			break;
		case global.Reaction_reddit_post_a_post :
			break;
		case global.Reaction_reddit_post_vote :
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
	global.DoesUserExist(user_id, req, res, getAreas);
});

function getAreas(req, res)
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
    })
}

module.exports = router;