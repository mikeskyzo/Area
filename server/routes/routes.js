const express = require('express');

const utils = require('../src/utils');
const getArea = require('../src/GetArea');

const area = require('./areaCreator');
const about = require('./aboutJson');
const authToken = require('./tokens');

var users = require('./users');

var router = express.Router();

router.patch('/user/changeUsername', function(req, res) {
	utils.verifyToken(req, res, users.changeUsername);
});

router.patch('/user/changePassword', function(req, res) {
	utils.verifyToken(req, res, users.changePassword);
});

router.post('/connectUser', function(req, res) {
	users.connectUser(req, res);
});

router.post('/createUser', function(req, res) {
	users.creatUser(req, res);
});

router.post('/CreateArea', function(req, res) {
	utils.verifyToken(req, res, area.CreateArea);
});

router.get('/GetArea/:AreaId', function(req, res) {
	utils.verifyToken(req, res, getArea.getArea);
});

router.get('/GetAreas', function(req, res) {
	utils.verifyToken(req, res, getArea.getAreas);
});

router.get('/GetAreas/name', function(req, res) {
	utils.verifyToken(req, res, getArea.getNameAreas);
});

router.get('/getActions', function(req, res) {
	utils.verifyToken(req, res, about.getActions);
});

router.get('/getReactions', function(req, res) {
	utils.verifyToken(req, res, about.getReactions);
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
