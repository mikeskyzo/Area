var express = require('express');
var jwt = require('jsonwebtoken');

var utils = require('../src/utils')

var area = require('./areaCreator')
var authToken = require('./tokens')

var router = express.Router();

router.post('/Discord/NewMassageChannel', function(req, res, next) {
});

module.exports = router;
