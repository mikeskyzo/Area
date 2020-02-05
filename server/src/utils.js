"use strict";

// Collections name
global.CollectionToken = 'Tokens'
global.CollectionUsers = 'Users'
global.CollectionArea = 'Area'

// Services name
global.service = new Object();
global.service.Discord = 'Discord'
global.service.Reddit = 'Reddit'
global.service.Github = 'Github'
global.service.Trello = 'Trello'

// Reaction name
global.Reaction = new Object();
global.Reaction.discord_send_message = 'discord_send_message'
global.Reaction.discord_add_reaction = 'discord_message_reaction'
global.Reaction.reddit_new_post = 'reddit_new_post'

// Action name
global.Action = new Object();
global.Action.github_new_push = 'github_new_push'

var Discord = require('../services/discord')
var github = require('../services/github')

// Map Action Function
global.ActionMap = new Map();
global.ActionMap.set(global.Action.github_new_push, github.createWebhookPushOnRepo)

// Map Reaction Function
global.ReactionMap = new Map();
global.ReactionMap.set(global.Reaction.discord_send_message, Discord.send_message)
// global.reactionMap.set(global.Reaction.discord_add_reaction, null)
// global.reactionMap.set(global.Reaction.reddit_new_post, null)

global.ReactionCheckArgsMap = new Map();
global.ReactionCheckArgsMap.set(global.Reaction.discord_send_message, Discord.send_message_check_args)

var uniqid = require('uniqid');

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

global.saveAREA = function (req, res, json)
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