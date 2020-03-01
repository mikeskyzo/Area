const fetch = require("node-fetch");

createNewWebhook = async function(res, json, next)
{
	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel || idModel.trim() === "") {
		global.responseError(res, 401, "Trello needs a idModel");
		return;
	}

	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
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
	await fetch(url, {
		method: "POST"
	})
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
		} else {
			return response.json();
		}
	})
	.then(async function (resJson) {
		json.action.webhook_id = resJson.id;
		await global.updateInDbAsync(global.CollectionArea, {area_id : json.area_id}, { $set: { 'webhook_id' : resJson.id}});
		res.status(201).send(`Trello's webhook well created with id : ${resJson.id}`);
	})
	.catch(function (error) {
		global.responseError(res, 500, error);
	});
}

exports.createNewWebhookUpdateCard = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "updateCard"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of card");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/cards/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a card");
		} else {
			goodType = true;
			createNewWebhook(res, json, next);
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/lists/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a list");
		} else {
			goodType = true;
			createNewWebhook(res, json, next);
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/boards/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			goodType = true;
			createNewWebhook(res, json, next);
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			goodType = true;
			createNewWebhook(res, json, next);
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a card, list, board or member");
}

exports.createNewWebhookUpdateList = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "updateList"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of list");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/lists/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a list");
			return;
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/boards/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			goodType = true;
			createNewWebhook(res, json, next);
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			goodType = true;
			createNewWebhook(res, json, next);
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a list, board or member");
}

exports.createNewWebhookUpdateChecklist = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "updateChecklist"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of checklist");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/boards/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
			return;
		} else {
			goodType = true;
			createNewWebhook(res, json, next);
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			goodType = true;
			createNewWebhook(res, json, next);
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;	
	global.responseError(res, 401, "idModel given isn't a board or member");
}

exports.createNewWebhookUpdateMember = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "updateMember"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of member");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/members/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			goodType = true;
			createNewWebhook(res, json, next);
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a member");
}

exports.createNewWebhookCreateCard = async function (res, json, next)
{
	let goodType = false;
	json.action.params.push({"name" : "event", "value" : "createCard"});
	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of list, board or member");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/lists/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/boards/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a list, board or member");
}

exports.createNewWebhookCreateList = async function (res, json, next)
{
	let goodType = false
	let params = json.action.params;

	params.push({"name" : "event", "value" : "createList"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of board or member");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/boards/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a board or member");
}

exports.createNewWebhookCommentCard = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "commentCard"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of card, list, board or member");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/cards/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a card");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/lists/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a list");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/boards/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a card, list, board or member");
}

exports.createNewWebhookDeleteCard = async function (res, json, next)
{
	let params = json.action.params;
	let goodType = false;

	params.push({"name" : "event", "value" : "deleteCard"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of card, list, board or member");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/cards/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a card");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/lists/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a list");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/boards/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a card, list, board or member");
}

exports.createNewWebhookRemoveChecklistFromCard = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "removeChecklistFromCard"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of card");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/cards/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a card");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/boards/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a card, board or member");
}

exports.createNewWebhookAddChecklistToCard = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "addChecklistToCard"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of card");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/cards/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a card");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/boards/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		console.log(response)
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
		.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a card, board or member!!");
}

exports.createNewWebhookRemoveMemberFromCard = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "removeMemberFromCard"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of card");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/cards/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a card");
			return;
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/boards/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
		global.responseError(res, 401, "idModel given isn't a card, board or member");
}

exports.createNewWebhookAddAttachmentToCard = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "addAttachmentToCard"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of card");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/cards/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a card");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/lists/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a lists");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/boards/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a board");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	await fetch(`https://api.trello.com/1/members/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a card, list, board or member");
}

exports.createNewWebhookCreateBoard = async function (res, json, next)
{
	let goodType = false;
	let params = json.action.params;

	params.push({"name" : "event", "value" : "CreateBoard"});
	json.action.params = params;

	const idModel = global.getParam(json.action.params, "idModel");

	if (!idModel) {
		global.responseError(res, 401, "Trello needs a idModel of member");
		return;
	}
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token || !token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	await fetch(`https://api.trello.com/1/members/${idModel}?&key=${token.APIKey}&token=${token.APIToken}`)
	.then(function (response) {
		if (response.status !== 200) {
			res.status(500).send(`Bad response from Trello : ${resJson.error}`);
			global.responseError(res, 401, "idModel given isn't a member");
			return;
		} else {
			createNewWebhook(res, json, next);
			goodType = true;
		}
	})
	.catch(function (error) {
		return `err : ${error}`;
	});
	if (goodType)
		return;
	global.responseError(res, 401, "idModel given isn't a member");
}