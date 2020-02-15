exports.sendAbout = function(req, res) {
	res.json({
		"client": {
			"host": req.connection.remoteAddress
		},
		"server": {
			"current_time": Date.now() ,
			"services": [
				{
					"name": "Github",
					"actions": [
						{
							"name ": "github_new_push",
							"description ": "A new push on a repository"
						},
						{
							"name": "github_issue_event",
							"description": "A issue a change of stat on a repository"
						}
					],
					"reactions": [
						{
							"name": "github_create_board" ,
							"description": "Create a new board project on github"
						}
					]
				}
			]
		}
	});
};