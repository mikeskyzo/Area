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

router.post('/UpdateArea', function(req, res, next) {
	utils.verifyToken(req, res, area.updateArea);
});

router.delete('/DeleteArea', function(req, res, next) {
	utils.verifyToken(req, res, area.deleteArea);
});

router.get('/about.json', function(req, res, next) {
	about.sendAbout(req, res);
});

router.post('/auth/:app', function(req, res) {
	utils.verifyToken(req, res, authToken.newAuth);
});

router.get('/auth/getServices', function(req, res) {
	utils.verifyToken(req, res, authToken.getServices);
});

module.exports = router;
