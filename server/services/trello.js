const fetch = require("node-fetch");

//https://trello.com/app-key

const defaultAPIToken = "c8887634117393563544827e99aa9f686075145c59d04ced3d9e9de63193ce4b";
const defaultAPIKey = "72a7e8b763bbbb4e1a3ba4ff68c7de00";
const defaultIDModel = "5e1448b8dedfc220293e78d8";
const defaultIDWebhook = "5e4283e30c5aef816f8e53d3";

exports.createNewWebhook = async function (req, res, json, next) {
	if (!req.body.APIToken || req.body.APIToken.trim() == "") {
		global.responseError(res, 401, "Trello needs a APIToken")
		return;
	}
	if (!req.body.APIKey || req.body.APIKey.trim() == "") {
		global.responseError(res, 401, "Trello needs a APIKey")
		return;
	}
	if (!req.body.idModel || req.body.idModel.trim() == "") {
		global.responseError(res, 401, "Trello needs a idModel")
		return;
	}
	json.idModel = req.body.idModel;

	const token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Github});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	if (!token.idModel) {
		global.responseError(res, 401, "No idModel provided");
		return;
	}
	const callback = `${global.url}/webhooks/${json.area_id}`;
	const url = `https://api.trello.com/1/webhooks/?idModel=${token.IDModel}&description=WebhookAREACOON&callbackURL=${callback}&key=${token.APIKey}&token=${token.APIToken}`;
	fetch(url, {
		method: "POST"
	})
	.then(function (response) {
		if (response.status == 201)
			return response.json();
		throw `Failed to create webhook : ${response.statusText}`
	})
	.then(function (resJson){
		json.webhook_id = resJson.id
		next(req, res, json);
	})
	.catch(function (error) {
		global.responseError(res, 500, error)
	});
}

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
	if (!token.idModel) {
		global.responseError(res, 401, "No idModel provided");
		return;
	}
	const url = `https://api.trello.com/1/webhooks/${area.webhook_id}?key=${token.APIKey}&token=${token.APIToken}`;
	fetch(url, {
		method: "DELETE"
	})
}

exports.CheckToken = function (req, res)
{
	if (!req.body.APIToken || req.body.APIToken.trim() == "") {
		global.responseError(res, 401, "Trello needs a APIToken")
		return;
	}
	if (!req.body.APIKey || req.body.APIKey.trim() == "") {
		global.responseError(res, 401, "Trello needs a APIKey")
		return;
	}
	if (!req.body.idModel || req.body.idModel.trim() == "") {
		global.responseError(res, 401, "Trello needs a idModel")
		return;
	}

	fetch(`https://api.trello.com/1/members/me/?key=${req.body.APIKey}&token=${req.body.APIToken}`)
	.then(function (response) {
		if (response.status == 200) {
			var json = {
				user_id : req.body.user_id,
				service : global.service.Trello,
				APIToken : req.body.APIToken,
				APIKey : req.body.APIKey,
				idModel : req.body.idModel,
			}
			global.saveInDb(global.CollectionToken, json, req, res, "Token saved");
			return;
		}
		throw `Token not valid : ${response.statusText}`;
	})
	.catch(function (error) {
		global.responseError(res, 500, error)
	});
}

exports.FormatWebhookUpdateModel = function (req, res, area, next)
{
	if (area.message) {
		if (area.message.includes("{name}") && req.body.action && req.body.action.memberCreator && req.body.action.memberCreator.username)
			area.message = area.message.replace("{name}", req.body.action.memberCreator.username)
		if (req.body.type && req.body.type === "updateBoard") {
			if (area.message.includes("{event}"))
				area.message = area.message.replace("{event}", `updated board ${req.body.model.name}`)
		} else
			res.send();
	}
	console.log("Area.message : " + area.message);
	next(area, res);
}