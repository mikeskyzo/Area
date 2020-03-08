const fetch = require('node-fetch');

exports.is_service_active = async function (user_id)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : user_id, service : global.Services.Github});
	if (!token || !token.access_token)
		return false;
	return true;
}

exports.generate_url = function (token)
{
	return 'https://github.com/login/oauth/authorize?client_id=' + process.env.GITHUB_ID + '&scope=admin:repo_hook%20repo&state=' + token;
}

exports.redirect_auth = async function (req, json)
{
	const code = req.query.code;
	const url = 'https://github.com/login/oauth/access_token?client_id=' + process.env.GITHUB_ID + '&client_secret=' + process.env.GITHUB_SECRET + '&code=' + code;
	fetch(url, {
		'method': 'POST',
		headers : {"Accept": "application/json"}
	})
	.then(function (response) {
		if (response.status == 200)
			return response.json();
		throw 'Failur : ' + res;
	})
	.then(function (resjson) {
		json.access_token = resjson.access_token
		global.saveInDbAsync(global.CollectionToken, json);
	})
	.catch(function (err){
		console.log(err);
	})
}

exports.createWebhookIssueEvent = function (res, json, next)
{
	createWebhook('issues', res, json, next);
}

exports.createWebhookPushOnRepo = function (res, json, next)
{
	createWebhook('push', res, json, next);
}

exports.createWebhookRepoPublic = function (res, json, next)
{
	createWebhook('public', res, json, next);
}

exports.createWebhookRepoLabeled = function (res, json, next)
{
	createWebhook('label', res, json, next);
}

exports.createWebhookRepoPullRequest = function (res, json, next)
{
	createWebhook('repository', res, json, next);
}

exports.createWebhookRepoStar = function (res, json, next)
{
	createWebhook('star', res, json, next);
}

exports.createWebhookCommitComment = function (res, json, next)
{
	createWebhook('commit_comment', res, json, next);
}

exports.createWebhookCreated = function (res, json, next)
{
	createWebhook('create', res, json, next);
}

exports.createWebhookRepoFork = function (res, json, next)
{
	createWebhook('fork', res, json, next);
}

async function createWebhook(event, res, json)
{
	let username = global.getParam(json.action.params, 'username');
	let repository = global.getParam(json.action.params, 'repository');

	if (!username || username.trim() == '') {
		global.sendResponse(res, 401, 'Github need a username')
		return;
	}
	if (!repository || repository.trim() == '') {
		global.sendResponse(res, 401, 'Github need a repository')
		return;
	}
	const url = 'https://api.github.com/repos/' + username + '/' + repository + '/hooks';

	var token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.Services.Github});
	if (!token || !token.access_token) {
		global.sendResponse(res, 401, 'No access token provide for Github');
		return;
	}
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
	fetch(url, {
		'method': 'POST',
		'headers' : {'Authorization' : 'token ' + token.access_token},
		'body' : JSON.stringify(body),
	})
	.then(function (response) {
		if (response.status == 201)
			return response.json();
		global.sendResponse(res, 401, 'failed to create webhook : ' + response.statusText);
		return null;
	})
	.then(function (resJson) {
		if (resJson) {
			json.action.webhook_id = resJson.id;
			global.saveAREA(res, json);
		}
	})
	.catch(function (error) {
		global.sendResponse(res, 500, error)
	});
}

exports.deleteWebhook = async function (area, req, res)
{
	let username = global.getParam(area.action.params, 'username');
	let repository = global.getParam(area.action.params, 'repository');

	if (!area.action.webhook_id) {
		console.error('The area has no webhook id');
		global.deleteInDb(global.CollectionArea, {user_id : req.body.user_id, area_id : req.body.area_id}, req, res);
		return;
	}

	var token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.Services.Github});
	if (!token.access_token) {
		global.sendResponse(res, 401, 'No access token provide');
		return;
	}
	var url =  'https://api.github.com/repos/' + username + '/' + repository + '/hooks/' + area.action.webhook_id;
	fetch(url, {
		'method': 'DELETE',
		'headers' : {'Authorization' : 'token ' + token.access_token}
	})
	.then(function (response) {
		if (response.status != 204) {
			console.log('Failed to delete webhook : ' + response.statusText);
		}
		global.deleteInDb(global.CollectionArea, {user_id : req.body.user_id, area_id : req.body.area_id}, req, res);
	})
	.catch(function (error) {
		global.sendResponse(res, 500, 'err : ' + error)
	});
}

exports.FormatWebhookCheckAction = function (req, res, area, next)
{
	if (!req.body.action) {
		res.send();
		return;
	}
	next(area, res);
}

exports.FormatWebhookCheckZen = function (req, res, area, next)
{
	if (req.body.zen) {
		res.send();
		return;
	}
	next(area, res);
}