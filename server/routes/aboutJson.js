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
				},
				{
					"name" : "Slack",
					"reactions" : [
						{
							"name" : "slack_send_message",
							"description" : "Send a message on the channel"
						}
					]
				}
			]
		}
	});
};

exports.getActionsReaction = function (req, res)
{
	var json = {
		services : [
			{
				"name" : global.service.Github,
				"actions" : [
					{
						"name" : global.Action.github_new_push,
						"title" : "Repository push",
						"description" : "Trigger when someone push on a repo",
						"params" : [
							{
								"name" : "repository",
								"description" : "Name of the repository"
							},
							{
								"name" : "owner",
								"description" : "Name of the owner of the repository"
							}
						]
					},
					{
						"name" : global.Action.github_issue_event,
						"title" : "Issue event",
						"description" : "Trigger when a issue is update or created",
						"params" : [
							{
								"name" : "repository",
								"description" : "Name of the repository"
							},
							{
								"name" : "owner",
								"description" : "Name of the owner of the repository"
							}
						]
					}
				]
			},
			{
				"name" : global.service.Slack,
				"reactions" : [
					{
						"name" : global.Reaction.slack_send_message,
						"title" : "Send a message",
						"description" : "Send a message on a slack channel",
						"params" : [
							{
								"name" : "channel_id",
								"description" : "ID of the channel"
							},
							{
								"name" : "message",
								"description" : "message to send on the channel"
							}
						]
					}
				]
			}
		]
	};
	res.json(json);
}