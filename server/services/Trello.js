const fetch = require("node-fetch");

//https://trello.com/app-key

const defaultAPIToken = "c8887634117393563544827e99aa9f686075145c59d04ced3d9e9de63193ce4b";
const defaultAPIKey = "72a7e8b763bbbb4e1a3ba4ff68c7de00";
const defaultIDModel = "5e1448b8dedfc220293e78d8";
const defaultIDWebhook = "5e4283e30c5aef816f8e53d3";

exports.createNewWebhook = async function (res, json, next) {
	if (!json.action.idModel || json.action.idModel.trim() == "") {
		global.responseError(res, 401, "Trello needs a idModel")
		return;
	}
	json.idModel = req.body.idModel;

	const token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	const callback = `${global.url}/webhooks/${json.area_id}`;
	const url = `https://api.trello.com/1/webhooks/?idModel=${json.action.IDModel}&description=WebhookAREACOON&callbackURL=${callback}&key=${token.APIKey}&token=${token.APIToken}`;
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
	const url = `https://api.trello.com/1/webhooks/${area.webhook_id}?key=${token.APIKey}&token=${token.APIToken}`;
	fetch(url, {
		method: "DELETE"
	});
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
		if (req.body.type && area.message.includes("{event}")) {
			if (req.body.type === "updateBoard")
				area.message = area.message.replace("{event}", `updated board in ${req.body.model.name}`);
			if (req.body.type === "updateCard")
				area.message = area.message.replace("{event}", `updated card in ${req.body.model.name}`);
			if (req.body.type === "updateList")
				area.message = area.message.replace("{event}", `updated list in ${req.body.model.name}`);
			if (req.body.type === "updateChecklist")
				area.message = area.message.replace("{event}", `updated checklist in ${req.body.model.name}`);
			if (req.body.type === "updateMember")
				area.message = area.message.replace("{event}", `updated member in ${req.body.model.name}`);
			if (req.body.type === "createCard")
				area.message = area.message.replace("{event}", `created card in ${req.body.model.name}`);
			if (req.body.type === "createlist")
				area.message = area.message.replace("{event}", `created list in ${req.body.model.name}`);
			if (req.body.type === "commentCard")
				area.message = area.message.replace("{event}", `new comment card in ${req.body.model.name}`);
			if (req.body.type === "deleteCard")
				area.message = area.message.replace("{event}", `deleted card in ${req.body.model.name}`);
			if (req.body.type === "removeChecklistFromCard")
				area.message = area.message.replace("{event}", `removed checklist from card in ${req.body.model.name}`);
		} else
			res.send();
	}
	console.log("Area.message : " + area.message);
	next(area, res);
}

exports.checkArgsCreateCard = async function (res, json)
{
	if (!json.reaction.IDBoard)
		global.responseError(res, 401, "Missing board ID")
	else if (!json.reaction.name)
		global.responseError(res, 401, "Missing name")
	else if (!json.reaction.description)
		global.responseError(res, 401, "Missing description")
	else {
		const token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Trello});
		if (!token.APIToken) {
			global.responseError(res, 401, "No APIToken provided");
			return;
		}
		if (!token.APIKey) {
			global.responseError(res, 401, "No APIKey provided");
			return;
		}
		fetch(`https://api.trello.com/1/lists/${json.reaction.IDBoard}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
		.then(function (response) {
			return response.json();
		})
		.then(function (resjson) {
			if (resjson.ok == false) {
				console.error(`Bad response from Trello : ${resjson.error}`);
				res.status(500).send();
			} else {
				res.send();
			}
			return;
		})
		.catch(function (error) {
			global.responseError(res, 500, `err : ${error}`)
		});
		global.saveAREA(res, json);
	}
}

exports.trelloCreateCard = async function (area, res)
{
	if (!area.reaction.IDList || !area.reaction.name || !area.reaction.description) {
		global.responseError(res, 401, 'Missing list ID, a name or a description')
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	const url = `https://api.trello.com/1/cards?name=${area.reaction.name}&desc=${area.reaction.description}&pos=bottom&idList=${area.reaction.IDList}&key=${token.APIKey}&token=${token.APIToken}`;
	fetch(url, {
  		method: "POST"
	})
	.then(function (response) {
		return response.json();
	})
	.then(function (resjson) {
		if (resjson.ok == false) {
			console.error(`Bad response from Trello : ${resjson.error}`);
			res.status(500).send();
		} else {
			res.send();
		}
		return;
	})
	.catch(function (error) {
		global.responseError(res, 500, `err : ${error}`)
	});
}

exports.checkArgsCreateList = async function (res, json)
{
	if (!json.reaction.IDBoard)
		global.responseError(res, 401, "Missing board ID")
	else if (!json.reaction.name)
		global.responseError(res, 401, "Missing name")
	else {
		const token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Trello});
		if (!token.APIToken) {
			global.responseError(res, 401, "No APIToken provided");
			return;
		}
		if (!token.APIKey) {
			global.responseError(res, 401, "No APIKey provided");
			return;
		}
		fetch(`https://api.trello.com/1/boards/${json.reaction.IDBoard}?&key=${token.APIKey}&token=${token.APIToken}`)
		.then(function (response) {
			return response.json();
		})
		.then(function (resjson) {
			if (resjson.ok == false) {
				console.error(`Bad response from Trello : ${resjson.error}`);
				res.status(500).send();
			} else {
				res.send();
			}
			return;
		})
		.catch(function (error) {
			global.responseError(res, 500, `err : ${error}`)
		});
		global.saveAREA(res, json);
	}
}

exports.trelloCreateList = async function (area, res)
{
	if (!area.reaction.IDBoard || !area.reaction.name) {
		global.responseError(res, 401, 'Missing board ID or a name')
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	const url = `https://api.trello.com/1/lists?name=${area.reaction.name}&idBoard=${area.reaction.IDBoard}&pos=bottom&key=${token.APIKey}&token=${token.ApiToken}`;
	fetch(url, {
  		method: "POST"
	})
	.then(function (response) {
		return response.json();
	})
	.then(function (resjson) {
		if (resjson.ok == false) {
			console.error(`Bad response from Trello : ${resjson.error}`);
			res.status(500).send();
		} else {
			res.send();
		}
		return;
	})
	.catch(function (error) {
		global.responseError(res, 500, `err : ${error}`)
	});
}

exports.checkArgsCreateLabel = async function (res, json)
{
	if (!json.reaction.IDBoard)
		global.responseError(res, 401, "Missing board ID")
	else if (!json.reaction.name)
		global.responseError(res, 401, "Missing name")
	else {
		const token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Trello});
		if (!token.APIToken) {
			global.responseError(res, 401, "No APIToken provided");
			return;
		}
		if (!token.APIKey) {
			global.responseError(res, 401, "No APIKey provided");
			return;
		}
		fetch(`https://api.trello.com/1/boards/${json.reaction.IDBoard}?fileds=all&key=${token.APIKey}&token=${token.APIToken}`)
		.then(function (response) {
			return response.json();
		})
		.then(function (resjson) {
			if (resjson.ok == false) {
				console.error(`Bad response from Trello : ${resjson.error}`);
				res.status(500).send();
			} else {
				res.send();
			}
			return;
		})
		.catch(function (error) {
			global.responseError(res, 500, `err : ${error}`)
		});
		global.saveAREA(res, json);
	}
}

const labelColors = ["yellow", "purple", "blue", "red", "green", "orange", "black", "sky", "pink", "lime"];

exports.trelloCreateLabel = async function (area, res)
{
	if (!area.reaction.IDBoard || !area.reaction.name) {
		global.responseError(res, 401, 'Missing board ID or a name')
		return;
	}
	const color = labelColors[Math.floor(Math.random() * (labelColors.length - 1))];
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	const url = `https://api.trello.com/1/labels?name=${area.reaction.name}&color=${color}&idBoard=${area.reaction.IDBoard}&key=${token.APIKey}&token=${token.ApiToken}`;
	fetch(url, {
  		method: "POST"
	})
	.then(function (response) {
		return response.json();
	})
	.then(function (resjson) {
		if (resjson.ok == false) {
			console.error(`Bad response from Trello : ${resjson.error}`);
			res.status(500).send();
		} else {
			res.send();
		}
		return;
	})
	.catch(function (error) {
		global.responseError(res, 500, `err : ${error}`)
	});
}