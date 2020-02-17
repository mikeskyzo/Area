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
	about.getActionsReaction(req, res);
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

module.exports = router;
