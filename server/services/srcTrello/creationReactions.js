const fetch = require("node-fetch");

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
	if (!token || !token.APIToken) {
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
	if (!token || !token.APIToken) 
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
	if (!token || !token.APIToken) {
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
	if (!token || !token.APIToken) {
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