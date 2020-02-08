exports.createWebhookPushOnRepo = function (req, res, json, next)
{
	console.log("Set webhook gitHub new push");
	next(req, res, json);
}

exports.FormatWebhookPushOnRepo = function (req, res, area, next)
{
	if (area.message) {
		if (area.message.includes('{name}') && req.body.pusher && req.body.pusher.name)
			area.message.replace('{name}', req.body.pusher.name)
		if (area.message.includes('{repository_name}') && req.body.pusher && req.body.repository.name)
			area.message.replace('{repository_name}', req.body.repository.name)
	}
	next(area, res);
}