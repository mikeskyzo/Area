const fetch = require("node-fetch");

exports.deleteWebhook = async function (area, req, res) {
	if (!area.webhook_id) {
		global.responseError(res, 401, "The area has no webhook id");
		return;
	}
	let token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	const url = `https://api.trello.com/1/webhooks/${area.webhook_id}?key=${token.APIKey}&token=${token.APIToken}`;
	await fetch(url, {
		method: "DELETE"
	})
	.then(function(response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
		} else {
			global.deleteInDb(global.CollectionArea, {user_id : req.body.user_id, area_id : req.body.area_id}, req, res);
		}
	});
}