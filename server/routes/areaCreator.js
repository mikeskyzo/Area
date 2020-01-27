var uniqid = require('uniqid');

var weather = require('../services/weather');

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

function createAREA(req, res, json)
{
	if (global.new_area)
		global.saveInDb(global.CollectionArea, json, req, res, 'Area created successfully');
	else {
		global.db.collection(global.CollectionArea).updateOne({area_id : json.area_id}, json, function(err, res) {
			if (err){
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
	var json = new Object();
	if (!req.body.area_id || !req.body.user_id || !req.body.action || !req.body.reaction) {
		global.responseError(res, 401, 'Bad body');
		return ;
	}
	global.new_area = false;
	switchAction(req.body.area_id, req, res);
};
