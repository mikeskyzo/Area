exports.FormatWebhookUpdateModel = function (req, res, area, next)
{
	const event = global.getParam(area.action.params, "event");

	console.log(req.body.action.type)
	if (req.body.action.type && req.body.action.type === event)
		next(area, res);
	else
		res.send();
}