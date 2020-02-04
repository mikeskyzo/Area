"use strict";

var uniqid = require('uniqid');

// Collections name
global.CollectionToken = 'Tokens'
global.CollectionUsers = 'Users'
global.CollectionArea = 'Area'

// Services name
global.serviceDiscord = 'Discord'
global.serviceWeather = 'Weather'
global.serviceImgur = 'Imgur'
global.serviceReddit = 'Reddit'
global.serviceClock = 'Clock'
global.serviceSteam = 'Steam'
global.serviceYoutube = 'Youtube'

// Reaction name
global.Reaction_discord_send_message = 'discord_send_message'
global.Reaction_discord_message_reaction = 'discord_message_reaction'
global.Reaction_imgur_upload_picture = 'imgur_upload_picture'
global.Reaction_reddit_post_a_post = 'reddit_post_a_post'
global.Reaction_reddit_post_vote = 'reddit_post_vote'

// Action name
global.Action_weather_time = 'weather_time'
global.Action_weather_change = 'weather_change'
global.Action_imgur_new_post = 'imgur_new_post'
global.Action_reddit_new_post_sub = 'reddit_new_post_sub'
global.Action_reddit_new_post_follower = 'reddit_new_post_follower'
global.Action_reddit_new_notification = 'reddit_new_notification'
global.Action_clock_time_place = 'clock_time_place'
global.Action_steam_players_on_game = 'steam_players_on_game'
global.Action_steam_friend_online = 'steam_friend_online'
global.Action_discord_new_message = 'discord_new_message'
global.Action_discord_user_send_message = 'discord_user_send_message'
global.Action_youtube_channel_sub = 'youtube_channel_sub'
global.Action_youtube_channel_views = 'youtube_channel_views'


global.secret = 'secret';

global.saveInDb = function (collection, json, req, res, success_message){

	global.db.collection(collection).insertOne(json, (err, result) => {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
            });
        } else {
            res.status(201);
            res.json({
                success : true,
                message : success_message,
            })
        }
	});
};

global.responseError = function(res, status, massage) {
	res.status(status);
	res.json({
		success : false,
		message : massage
    });
    return;
};

var jwt = require('jsonwebtoken');

exports.verifyToken = function(req, res, next)
{
    var token = req.headers.access_token;
	if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });

	jwt.verify(token, global.secret, function(err, decoded) {
        if (err) {
		    res.json({ success: false, message: 'Failed to authenticate token.' });
		    return;
        }
        if (decoded.exp > Date.now()){
		    res.json({ success: false, message: 'Token expired' });
		    return;
        }
        req.body.user_id = decoded.id;
        DoesUserExist(decoded.id, req, res, next);
	});
}

global.DoesUserExist = function (user_id, req, res, next) {
    global.db.collection(global.CollectionUsers).findOne({id : user_id}, (err, result) => {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
            });
            return;
        }
        if(!result) {
            res.status(401);
            res.json({
                success : false,
                message : 'User not found'
            })
            return;
        }
        if (next)
            next(req, res);
    });
}

global.getToken = function (user_id, service, result, next) {
    global.db.collection(global.CollectionToken).findOne({id : user_id, service : service}, (err, rslt) => {
        if (err) return;
        if(!rslt) return;
        if (next)
            next(params, result, rslt);
    });
}

global.enhanceMessage = function (message, json) {
    return message;
}