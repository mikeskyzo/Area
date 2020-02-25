var express = require('express');
var uniqid = require('uniqid');
var jwt = require('jsonwebtoken');

var utils = require('../src/utils');
var getArea = require('../src/GetArea');

var area = require('./areaCreator')
var about = require('./aboutJson');
var authToken = require('./tokens')

var router = express.Router();

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

module.exports = router;
