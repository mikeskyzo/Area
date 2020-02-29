const fetch = require("node-fetch");

//https://trello.com/app-key

function isInArray (elem, arr) {
	for (let i = 0; i < arr.length; i++)
		if (elem.startsWith(arr[i]))
			return (true);
	return (false);
}

const events = ["updateBoard", "updateCard", "updateList", "updateChecklist", "updateMember", "createCard", "createlist", "commentCard", "deleteCard", "removeChecklistFromCard"];

exports.confirmWebhookFunctionTrello = async function(req, res, area)
{
	res.send();
}

exports.createNewWebhook = async function(res, json, next)
{
	const idModel = global.getParam(json.action.params, "idModel");
	const event = global.getParam(json.action.params, "event");

	if (!idModel || idModel.trim() === "" || !event || event.trim() === "" && isInArray(req.body.action.type, events)) {
		global.responseError(res, 401, "Trello needs a idModel and a event to trigger");
		return;
	}

	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}

	await global.saveInDbAsync(global.CollectionArea, json);
	const callback = `${global.url}/webhooks/${json.area_id}`;
	const url = `https://api.trello.com/1/webhooks/?idModel=${idModel}&description=WebhookAREACOON&callbackURL=${callback}&key=${token.APIKey}&token=${token.APIToken}`;
	fetch(url, {
		method: "POST"
	})
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
		} else {
			return response.json();
		}
	})
	.then(function (resJson) {
		console.log(resJson);
		json.action.webhook_id = resJson.id;
		res.send(`Trello's webhook well created with id : ${resJson.id}`);
	})
	.catch(function (error) {
		global.responseError(res, 500, error);
	});
}

exports.deleteWebhook = async function (area, req, res) {
	if (!area.action.webhook_id) {
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
	if (!req.body.APIToken || req.body.APIToken.trim() === "") {
		global.responseError(res, 401, "Trello needs a APIToken");
		return;
	}
	if (!req.body.APIKey || req.body.APIKey.trim() === "") {
		global.responseError(res, 401, "Trello needs a APIKey");
		return;
	}

	fetch(`https://api.trello.com/1/members/me/?key=${req.body.APIKey}&token=${req.body.APIToken}`)
	.then(function (response) {
		if (response.status === 200) {
			let json = {
				user_id : req.body.user_id,
				service : global.service.Trello,
				APIToken : req.body.APIToken,
				APIKey : req.body.APIKey
			};
			global.saveInDb(global.CollectionToken, json, res, "Token saved");
			return;
		}
		throw `Token not valid : ${response.statusText}`;
	})
	.catch(function (error) {
		global.responseError(res, 500, error);
	});
};

exports.FormatWebhookUpdateModel = function (req, res, area, next)
{
	const event = global.getParam(area.action.params, "event");

	if (req.body.action.type && isInArray(req.body.action.type, events) && req.body.action.type === event)
		next(area, res);
	else
		res.send();

/*	if (area.message) {
		console.log("Area.message : " + area.message);
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
	}*/
}

exports.checkArgsCreateCard = async function (json)
{
	const idList = global.getParam(json.reaction.params, "idList");
	const name = global.getParam(json.reaction.params, "name");
	const description = global.getParam(json.reaction.params, "description");
	const event = global.getParam(json.action.params, "event");

	if (!idList)
		return "Missing list ID";
	else if (!name)
		return "Missing name";
	else if (!description)
		return "Missing description";
	else if (event && event === "createCard")
		return "Reaction can't be same as action";
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	fetch(`https://api.trello.com/1/lists/${idList}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200)
			return `Bad response from Trello : ${response.error}`;
		return null;
	})
	.then(function (res) {
		return res;
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	return null;
}

exports.trelloCreateCard = async function (area, res)
{
	const idList = global.getParam(area.reaction.params, "idList");
	const name = global.getParam(area.reaction.params, "name");
	const description = global.getParam(area.reaction.params, "description");

	if (!idList || !name || !description) {
		global.responseError(res, 401, "Missing list ID, a name or a description");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.service.Trello});
	if (!token) {
		global.responseError(res, 401, "Can't get tokens for Trello");
		return;
	}
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	const url = `https://api.trello.com/1/cards?name=${name}&desc=${description}&pos=bottom&idList=${idList}&key=${token.APIKey}&token=${token.APIToken}`;
	fetch(url, {
  		method: "POST"
	})
	.then(function (response) {
		if (response.status !== 200) {
			console.log(`Bad response from Trello : ${response.error}`);
			res.status(500).send();
		} else
			return response.json();
	})
	.then(function (resjson) {
		res.send();
		return;
	})
	.catch(function (error) {
		global.responseError(res, 500, `err : ${error}`);
	});
}

exports.checkArgsCreateList = async function (json)
{
	const idBoard = global.getParam(json.reaction.params, "idBoard");
	const name = global.getParam(json.reaction.params, "name");
	const event = global.getParam(json.action.params, "event");

	if (!idBoard)
		return "Missing board ID";
	else if (!name)
		return "Missing name";
	else if (event && event === createList)
		return "Reaction can't be same as action";
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token.APIToken)
		return "No APIToken provided";
	if (!token.APIKey)
		return "No APIKey provided";
	fetch(`https://api.trello.com/1/boards/${idBoard}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200)
			return `Bad response from Trello : ${response.error}`;
		return null;
	})
	.then(function (res) {
		return res;
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	return null;
}

exports.trelloCreateList = async function (area, res)
{
	const idBoard = global.getParam(area.reaction.params, "idBoard");
	const name = global.getParam(area.reaction.params, "name");

	if (!idBoard || !name) {
		global.responseError(res, 401, 'Missing board ID or a name')
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : res.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	const url = `https://api.trello.com/1/lists?name=${name}&idBoard=${idBoard}&pos=bottom&key=${token.APIKey}&token=${token.ApiToken}`;
	fetch(url, {
  		method: "POST"
	})
	.then(function (response) {
		if (response.status !== 200) {
			console.log(`Bad response from Trello : ${response.error}`);
			res.status(500).send();
		} else
			return response.json();
	})
	.then(function (resjson) {
		res.send();
		return;
	})
	.catch(function (error) {
		global.responseError(res, 500, `err : ${error}`);
	});
}

exports.checkArgsCreateLabel = async function (json)
{
	const idBoard = global.getParam(json.reaction.params, "idBoard");
	const name = global.getParam(json.reaction.params, "name");

	if (!idBoard)
		return "Missing board ID";
	else if (!name)
		return "Missing name";
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token.APIToken) 
		return "No APIToken provided";
	if (!token.APIKey)
		return "No APIKey provided";
	fetch(`https://api.trello.com/1/boards/${idBoard}?fileds=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200)
			return `Bad response from Trello : ${response.error}`;
		return null;
	})
	.then(function (res) {
		return res;
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	return null;
}

const labelColors = ["yellow", "purple", "blue", "red", "green", "orange", "black", "sky", "pink", "lime"];

exports.trelloCreateLabel = async function (area, res)
{
	const idBoard = global.getParam(area.reaction.params, "idBoard");
	const name = global.getParam(area.reaction.params, "name");

	if (!idBoard || !name) {
		global.responseError(res, 401, 'Missing board ID or a name');
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : res.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	const color = labelColors[Math.floor(Math.random() * (labelColors.length - 1))];
	const url = `https://api.trello.com/1/labels?name=${name}&color=${color}&idBoard=${idBoard}&key=${token.APIKey}&token=${token.ApiToken}`;
	fetch(url, {
  		method: "POST"
	})
	.then(function (response) {
		if (response.status !== 200) {
			console.log(`Bad response from Trello : ${response.error}`);
			res.status(500).send();
		} else
			return response.json();
	})
	.then(function (resjson) {
		res.send();
		return;
	})
	.catch(function (error) {
		global.responseError(res, 500, `err : ${error}`);
	});
}

exports.checkArgsCreateBoard = async function (json)
{
	const name = global.getParam(json.reaction.params, "name");
	const description = global.getParam(json.reaction.params, "description");
	const event = global.getParam(json.action.params, "event");

	if (!name)
		return "Missing name";
	else if (!description)
		return "Missing description";
	else if (event && event === createBoard)
		return "Reaction can't be as same action";
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token.APIToken)
		return "No APIToken provided";
	if (!token.APIKey)
		return "No APIKey provided";
	return null;
}

const boardColors = ["blue", "orange", "green", "red", "purple", "pink", "lime", "sky", "grey"];

exports.trelloCreateBoard = async function (area, res)
{
	const name = global.getParam(area.reaction.params, "name");
	const description = global.getParam(area.reaction.params, "description");

	if (!name || !description) {
		global.responseError(res, 401, 'Missing board name or description');
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : res.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		global.responseError(res, 401, "No APIToken provided");
		return;
	}
	if (!token.APIKey) {
		global.responseError(res, 401, "No APIKey provided");
		return;
	}
	const color = boardColors[Math.floor(Math.random() * (boardColors.length - 1))];
	const url = `https://api.trello.com/1/boards/?name=${name}&defaultLabels=true&defaultLists=true&desc=${description}&keepFromSource=none&prefs_permissionLevel=private&prefs_voting=disabled&prefs_comments=members&prefs_invitations=members&prefs_selfJoin=true&prefs_cardCovers=true&prefs_background=${color}&prefs_cardAging=regular&key=${token.APIKey}&token=${token.ApiToken}`
	fetch(url, {
  		method: "POST"
	})
	.then(function (response) {
		if (response.status !== 200) {
			console.log(`Bad response from Trello : ${response.error}`);
			res.status(500).send();
		} else
			return response.json();
	})
	.then(function (resjson) {
		res.send();
		return;
	})
	.catch(function (error) {
		global.responseError(res, 500, `err : ${error}`);
	});
}