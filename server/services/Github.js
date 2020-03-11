const fetch = require("node-fetch");

exports.is_service_active = async function (user_id)
{
	const token = await global.findInDbAsync(global.CollectionToken, {user_id : user_id, service : global.Services.Github});
	if (!token || !token.access_token)
		return false;
	return true;
};

exports.generate_url = function (token)
{
	return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_ID}&scope=admin:repo_hook%20repo&state=${token}`;
};

exports.redirect_auth = async function (req, json)
{
	const code = req.query.code;
	const url = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${code}`;
	fetch(url, {
		"method": "POST",
		headers : {"Accept": "application/json"}
	})
	.then(function (response) {
		if (response.status == 200)
			return response.json();
		throw "Failure : " + res;
	})
	.then(function (resjson) {
		json.access_token = resjson.access_token;
		global.saveInDbAsync(global.CollectionToken, json);
	})
	.catch(function (err){
		console.error(err);
	});
};

exports.createWebhookIssueEvent = async function (json)
{
	return await createWebhook("issues", json);
};

exports.createWebhookPushOnRepo = async function (json)
{
	return await createWebhook("push", json);
};

exports.createWebhookRepoPublic = async function (json)
{
	return await createWebhook("public",json);
};

exports.createWebhookRepoLabeled = async function (json)
{
	return await createWebhook("label", json);
};

exports.createWebhookRepoPullRequest = async function (json)
{
	return await createWebhook("repository", json);
};

exports.createWebhookRepoStar = async function (json)
{
	return await createWebhook("star", json);
};

exports.createWebhookCommitComment = async function (json)
{
	return await createWebhook("commit_comment", json);
};

exports.createWebhookCreated = async function (json)
{
	return await createWebhook("create", json);
};

exports.createWebhookRepoFork = async function (json)
{
	return await createWebhook("fork", json);
};

async function createWebhook(event, json)
{
	const username = global.getParam(json.action.params, "username");
	const repository = global.getParam(json.action.params, "repository");

	if (!username || username.trim() == "")
		return "Github need a username";
	if (!repository || repository.trim() == "")
		return "Github need a repository name";
	const url = `https://api.github.com/repos/${username}/${repository}/hooks`;

	const token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.Services.Github});
	if (!token || !token.access_token)
		return "No access token provide for Github";
	const body = {
		"name": "web",
		"active": true,
		"events": [
		  event
		],
		"config": {
		  "url": global.url + "/webhooks/" + json.area_id,
		  "content_type": "json",
		  "insecure_ssl": "0"
		}
	}
	const response = await fetch(url, {
		"method": "POST",
		"headers" : {"Authorization" : "token " + token.access_token},
		"body" : JSON.stringify(body),
	})
	let resJson;
	try {
		resJson = await response.json();
		if (!resJson)
			throw null;
		if (response.status != 201)
			throw null;
	} catch (err) {
		return "Failed to create webhook on Github : " + response.statusText;
	}
	json.action.webhook_id = resJson.id;
}

exports.deleteWebhook = async function (area)
{
	const username = global.getParam(area.action.params, "username");
	const repository = global.getParam(area.action.params, "repository");

	if (!area.action.webhook_id)
		return;

	const token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Github});
	if (!tokenn || !token.access_token)
		return "No access token provide";
	const url =  `https://api.github.com/repos/${username}/${repository}/hooks/${area.action.webhook_id}`;
	fetch(url, {
		"method": "DELETE",
		"headers" : {"Authorization" : `token ${token.access_token}`}
	})
	.then(function (response) {
		if (response.status != 204)
			console.error(`Failed to delete webhook : ${response.statusText}`);
	})
	.catch(function (error) {
		console.error("Error while deleting webhook on github : ");
		console.error(error);
		return;
	});
};

exports.FormatWebhookCheckAction = function (req)
{
	if (!req.body.action) {
		return;
	}
	return {};
};

exports.FormatWebhookCheckZen = function (req)
{
	if (req.body.zen) {
		return;
	}
	return {};
};