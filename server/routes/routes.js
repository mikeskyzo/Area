var express = require('express');
var uniqid = require('uniqid');
var jwt = require('jsonwebtoken');

var utils = require('../src/utils')

var area = require('./areaCreator')
var about = require('./aboutJson');
var authToken = require('./tokens')

var router = express.Router();

router.post('/CreateArea', function(req, res) {
	utils.verifyToken(req, res, area.CreateArea);
});

router.get('/GetArea', function(req, res) {
	utils.verifyToken(req, res, area.getAreas);
});

router.get('/getActionsReactions', function(req, res) {
	utils.verifyToken(req, res, about.getActionsReaction);
});

router.delete('/DeleteArea', function(req, res) {
	utils.verifyToken(req, res, area.deleteArea);
});

router.get('/about.json', function(req, res) {
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
router.get('/caca', function(req, res) {
	//console.log(req.body);
		console.log(req.query["hub.challenge"]);
	res.send(req.query["hub.challenge"], 202);
});
router.post('/caca', function(req, res) {
	console.log(req.body);
	res.send();
});

router.get('/sex', function(req, res) {
	console.log(req.body);
	res.send();
});

router.post('/sex', function(req, res) {
	console.log(req.body);
	res.send();
});
var twitch = require ('../services/Twitch');

router.get('/penis', function(req, res) {
	twitch.Twitch_Create_Webhook_NewSubscriber(req, res,'a_very_good_test');
	//console.log(req.query["hub.challenge"]);

});



module.exports = router;
