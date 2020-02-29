const express = require('express');

const utils = require('../src/utils');
const getArea = require('../src/GetArea');

const area = require('./areaCreator');
const authHandler = require('../src/AuthHandler');
const about = require('./aboutJson');

const users = require('./users');

const router = express.Router();

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

router.get('/auth/getServices', function(req, res) {
	// To change with the new oauth update
	res.send();
	// utils.verifyToken(req, res, authToken.getServices);
});

router.get('/auth/connect/:service', function(req, res) {
	utils.verifyToken(req ,res, authHandler.redirectToService);
});

router.get('/auth/redirect/:token?', function(req, res) {
	authHandler.getTokenFromService(req, res);
});


module.exports = router;
