const fetch = require("node-fetch");

//https://trello.com/app-key

function isInArray (elem, arr) {
	for (let i = 0; i < arr.length; i++)
		if (elem.startsWith(arr[i]))
			return (true);
	return (false);
}

exports.confirmWebhookFunctionTrello = async function(req, res, area)
{
	res.send();
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

exports.is_service_active = async function(user_id)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : user_id, service : global.Services.Trello});
	if (!token || !token.APIKey || !token.ApiToken)
		return false;
	return true;
}

const OAuth = require('oauth').OAuth;
const url = require('url');
/* General settings */
const generalSettings = {
	// Api
	trelloApi: 'https://trello.com/1',

	// App related
	appName: 'Area_Dashboard++',
	clientId: 'cfd14732f1e65ebbfc3521de87b214a1',
	clientSecret: '8efc48c0d75ff42474c06c236c3b85684c534cfab5f7538e026ea35bebd82eb5',
	redirectUri: 'http://localhost:8080/auth/redirect',

	// Session related
	authorizationToken: '', // to get in res after calling GET AUTHORIZATION TOKEN
	secretAuthorizationToken: '' // to get in res after calling GET AUTHORIZATION TOKEN
};
/* Initializing OAuth instance */
const oauthSecrets = {};
const oauth = new OAuth(
	`${generalSettings.trelloApi}/OAuthGetRequestToken`,
	`${generalSettings.trelloApi}/OAuthGetAccessToken`,
	generalSettings.clientId,
	generalSettings.clientSecret,
	"1.0A",
	generalSettings.redirectUri,
	"HMAC-SHA1"
);

exports.generate_url = async function(token)
{
	oauth.getOAuthRequestToken(function(error, token, tokenSecret, results) {
		const scope = 'read,write,account';
		const expiration = 'never';

		oauthSecrets[token] = tokenSecret;
		return `${generalSettings.trelloApi}/OAuthAuthorizeToken?oauth_token=${token}&name=${generalSettings.appName}&scope=${scope}&expiration=${expiration}`;
	});
}

exports.redirect_auth = async function(req, json)
{
	const query = url.parse(req.url, true).query;
	const token = query.oauth_token;
	const tokenSecret = oauthSecrets[token];
	const verifier = query.oauth_verifier;

	oauth.getOAuthAccessToken(
		token, tokenSecret, verifier,
		function(error, accessToken, accessTokenSecret, results) {
			oauth.getProtectedResource(
				"https://api.trello.com/1/members/me",
				"GET", accessToken, accessTokenSecret,
				async function(error, data, response) {
					generalSettings.authorizationToken = accessToken;
					generalSettings.secretAuthorizationToken = accessTokenSecret;
					let token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : json.service})
					if (token)
						global.deleteInDbAsync(global.CollectionToken, {user_id : json.user_id, service : json.service});
					json.APIToken = generalSettings.authorizationToken;
					json.APIKey = generalSettings.clientId;
					await global.saveInDbAsync(global.CollectionArea, json);
				}
			)
	});
}

exports.FormatWebhookUpdateModel = function (req, res, area, next)
{
	const event = global.getParam(area.action.params, "event");

	console.log(req.body.action.type)
	if (req.body.action.type && req.body.action.type === event)
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
	const idModel = global.getParam(json.reaction.params, "idModel");
	const name = global.getParam(json.reaction.params, "name");
	const description = global.getParam(json.reaction.params, "description");

	if (!idModel)
		return "Missing ID of list";
	else if (!name)
		return "Missing name";
	else if (!description)
		return "Missing description";
	else if (json.action["name"].includes("trello_create_card"))
		return "Reaction can't be same as action";
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.service.Trello});
	if (!token.APIToken) {
		return "No APIToken provided";
	}
	if (!token.APIKey) {
		return "No APIKey provided";
	}
	fetch(`https://api.trello.com/1/lists/${idModel}?fields=all&key=${token.APIKey}&token=${token.APIToken}`)
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
	const idModel = global.getParam(area.reaction.params, "idModel");
	const name = global.getParam(area.reaction.params, "name");
	const description = global.getParam(area.reaction.params, "description");

	if (!idModel || !name || !description) {
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
	const url = `https://api.trello.com/1/cards?name=${name}&desc=${description}&pos=bottom&idList=${idModel}&key=${token.APIKey}&token=${token.APIToken}`;
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
	const idBoard = global.getParam(json.reaction.params, "idModel");
	const name = global.getParam(json.reaction.params, "name");

	if (!idBoard)
		return "Missing ID of board";
	else if (!name)
		return "Missing name";
	else if (json.action["name"].includes("trello_create_list"))
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
	const idBoard = global.getParam(area.reaction.params, "idModel");
	const name = global.getParam(area.reaction.params, "name");

	if (!idBoard || !name) {
		global.responseError(res, 401, 'Missing ID of board or a name')
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
	const idBoard = global.getParam(json.reaction.params, "idModel");
	const name = global.getParam(json.reaction.params, "name");

	if (!idBoard)
		return "Missing ID of board";
	else if (!name)
		return "Missing name";
	else if (json.action["name"].includes("trello_create_label"))
		return "Reaction can't be same as action";
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
	const idBoard = global.getParam(area.reaction.params, "idModel");
	const name = global.getParam(area.reaction.params, "name");

	if (!idBoard || !name) {
		global.responseError(res, 401, 'Missing ID of board or a name');
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

	if (!name)
		return "Missing name";
	else if (!description)
		return "Missing description";
	else if (json.action["name"].includes("trello_create_board"))
		return "Reaction can't be same as action";
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