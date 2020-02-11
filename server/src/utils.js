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
global.service.slack = 'Slack'


var Discord = require('../services/discord')
var Github = require('../services/github')
var Trello = require('../services/trello')
var Slack = require('../services/slack')

// Map of the verification of tokens
global.ServiceTokenCheckMap = new Map();
global.ServiceTokenCheckMap.set(global.service.Github, Github.CheckToken)
global.ServiceTokenCheckMap.set(global.service.Trello, Trello.CheckToken)
global.ServiceTokenCheckMap.set(global.service.slack, Slack.CheckToken)


// Action name
global.Action = new Object();
global.Action.github_new_push = 'github_new_push'

// Map Action creation Function
global.ActionMap = new Map();
global.ActionMap.set(global.Action.github_new_push, Github.createWebhookPushOnRepo)

// Map of formating the result of the webhooks
global.ActionFormatResultMap = new Map();
global.ActionFormatResultMap.set(global.Action.github_new_push, Github.FormatWebhookPushOnRepo)

// Map for the deletion of the webhooks
global.ActionDeleteWebhookMap = new Map();
global.ActionDeleteWebhookMap.set(global.Action.github_new_push, Github.deleteWebhook)


// Reaction name
global.Reaction = new Object();
global.Reaction.discord_send_message = 'discord_send_message'
global.Reaction.slack_send_message = 'slack_send_message'
global.Reaction.reddit_new_post = 'reddit_new_post'

// Map Reaction Function
global.ReactionMap = new Map();
global.ReactionMap.set(global.Reaction.discord_send_message, Discord.send_message)
global.ReactionMap.set(global.Reaction.slack_send_message, Slack.send_message)

// Map of the function to add the argument in Db and check if there are correct
global.ReactionCheckArgsMap = new Map();
global.ReactionCheckArgsMap.set(global.Reaction.discord_send_message, Discord.send_message_check_args)
global.ReactionCheckArgsMap.set(global.Reaction.slack_send_message, Slack.send_message_check_args)

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
    if (!req.headers.authorization)  return res.status(401).send({ success: false, message: 'No token provided.' });
	var token = req.headers.authorization.split(' ')[1];
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

global.findInDbAsync = async function (collection, param) {
	return db.collection(collection).findOne(param);
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

global.deleteInDb = function (collection, params, req, res)
{
	global.db.collection(collection).deleteOne(params, function (err, result) {
		if (err) {
			global.responseError(res, 500, err.message)
			return;
		}
		res.status(201);
		res.json({
			success : true,
			message : 'Deleted',
		});
		return;
	});
}

global.findInDb = function (collection, params, req, res, next)
{
	global.db.collection(collection).findOne(params, (err, result) => {
		if (err) {
			global.responseError(res, 401, err.message)
			return;
		}
		if (next)
			next(result, req, res);
	});

}