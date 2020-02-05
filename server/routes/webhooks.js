var express = require('express');
var jwt = require('jsonwebtoken');

var utils = require('../src/utils')

var area = require('./areaCreator')
var authToken = require('./tokens')

var Discord = require('../services/discord')

var router = express.Router();

router.post('/github', function(req, res, next) {
	Discord.send_message({
		message : req.body.pusher.name + ' just push on ' + req.body.repository.name,
		channel_id : '664031224855265291'
	 }, '', req.body, {});

	//  if (global.ReactionMap.get(json.reaction)) {
	// 	return;
	// }
});

module.exports = router;
