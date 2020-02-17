var express = require('express');
var uniqid = require('uniqid');
var jwt = require('jsonwebtoken');

var utils = require('../src/utils')

var area = require('./areaCreator')
var about = require('./aboutJson');
var authToken = require('./tokens')

var router = express.Router();

router.post('/CreateArea', function(req, res, next) {
	utils.verifyToken(req, res, area.CreateArea);
});

router.get('/GetArea', function(req, res, next) {
	utils.verifyToken(req, res, area.getAreas);
});

router.get('/getActionsReactions', function(req, res, next) {
	var json = {
		services : [
			{
				"name" : global.service.Github,
				"actions" : [
					{
						"name" : global.Action.github_new_push,
						"title" : "Repository push",
						"description" : "Trigger when someone push on a repo",
						"params" : [
							{
								"name" : "repository",
								"description" : "Name of the repository"
							},
							{
								"name" : "owner",
								"description" : "Name of the owner of the repository"
							}
						]
					},
					{
						"name" : global.Action.github_issue_event,
						"title" : "Issue event",
						"description" : "Trigger when a issue is update or created",
						"params" : [
							{
								"name" : "repository",
								"description" : "Name of the repository"
							},
							{
								"name" : "owner",
								"description" : "Name of the owner of the repository"
							}
						]
					}
				]
			},
			{
				"name" : global.service.Slack,
				"reactions" : [
					{
						"name" : global.Reaction.slack_send_message,
						"title" : "Send a message",
						"description" : "Send a message on a slack channel",
						"params" : [
							{
								"name" : "channel_id",
								"description" : "ID of the channel"
							},
							{
								"name" : "message",
								"description" : "message to send on the channel"
							}
						]
					}
				]
			}
		]
	}
	res.json(json);
});

router.delete('/DeleteArea', function(req, res, next) {
	utils.verifyToken(req, res, area.deleteArea);
});

router.get('/about.json', function(req, res, next) {
	about.sendAbout(req, res);
});

router.post('/auth/addToken', function(req, res) {
	utils.verifyToken(req, res, authToken.newAuth);
});

router.delete('/auth/token', function(req, res) {
	utils.verifyToken(req, res, authToken.deleteToken);
});

router.get('/auth/getServices', function(req, res) {
	utils.verifyToken(req, res, authToken.getServices);
});

module.exports = router;
