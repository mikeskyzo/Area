exports.sendAbout = function(req, res) {
	res.json({
		"client": {
			"host": req.connection.remoteAddress
		},
		"server": {
			"current_time": Date.now() ,
			"services": [
				{
					"name": "facebook",
					"actions": [
						{
							"name ": "new_message_in_group",
							"description ": "A new message is posted in the group"
						},
						{
							"name": "new_message_inbox",
							"description": "A new private message is received by the user"
						}
					],
					"reactions": [
						{
							"name": "like_message" ,
							"description": "The user likes a message"
						}
					]
				}
			]
		}
	});
};