const fetch = require('node-fetch');

exports.createWebhookIssueEvent = function (res, json, next)
{
	createWebhook('issues', res, json, next);
}

exports.createWebhookPushOnRepo = function (res, json, next)
{
	createWebhook('push', res, json, next);
}

async function createWebhook(event, res, json, next)
{
	let username = global.getParam(json.action.params, 'username');
	let repository = global.getParam(json.action.params, 'repository');

	if (!username || username.trim() == '') {
		global.responseError(res, 401, 'Github need a username')
		return;
	}
	if (!repository || repository.trim() == '') {
		global.responseError(res, 401, 'Github need a repository')
		return;
	}
	const url = 'https://api.github.com/repos/' + username + '/' + repository + '/hooks';

	var token = await global.findInDbAsync(global.CollectionToken, {user_id : json.user_id, service : global.Services.Github});
	if (!token || !token.access_token) {
		global.responseError(res, 401, 'No access token provide for Github');
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
		global.responseError(res, 401, 'failed to cre\te webhook : ' + response.statusText);
		return null;
	})
	.then(function (resJson) {
		if (resJson) {
			json.action.webhook_id = resJson.id;
			next(res, json);
		}
	})
	.catch(function (error) {
		global.responseError(res, 500, error)
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
		global.responseError(res, 401, 'No access token provide');
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
		global.responseError(res, 500, 'err : ' + error)
	});
}

exports.FormatWebhookIssueEvent = function (req, res, area, next)
{
// 	if (!req.body.action) {
// 		res.send();
// 		return;
// 	}
// 	let message = area.reaction.message;
// 	if (message) {
// 		if (message.includes('{event}'))
// 			message = message.replace('{event}', req.body.action)
// 		if (message.includes('{username}') && req.body.sender && req.body.sender.login)
// 			message = message.replace('{username}', req.body.sender.login)
// 		if (message.includes('{repository_name}') && req.body.repository && req.body.repository.name)
// 			message = message.replace('{repository_name}', req.body.repository.name)
// 	}
// 	area.reaction.message = message
	next(area, res);
}

exports.FormatWebhookPushOnRepo = function (req, res, area, next)
{
	// if (req.body.zen) {
	// 	res.send();
	// 	return;
	// }
	// if (area.reaction.message) {
	// 	if (area.reaction.message.includes('{name}') && req.body.pusher && req.body.pusher.name)
	// 		area.reaction.message = area.reaction.message.replace('{name}', req.body.pusher.name)
	// 	if (area.reaction.message.includes('{repository_name}') && req.body.repository && req.body.repository.name)
	// 		area.reaction.message = area.reaction.message.replace('{repository_name}', req.body.repository.name)
	// }
	next(area, res);
}

exports.check_token = async function (req, res)
{
	if (!req.body.access_token) {
		global.responseError(res, 401, 'Need a access token');
		return;
	}
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : req.body.service})
	if (token)
		global.deleteInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : req.body.service});
	fetch('https://api.github.com/user', {
		'method': 'GET',
		'headers' : {'Authorization' : 'token ' + req.body.access_token},
	})
	.then(function (response) {
		if (response.status == 200) {
			var json = {
				user_id : req.body.user_id,
				service : global.Services.Github,
				access_token : req.body.access_token
			}
			global.saveInDb(global.CollectionToken, json, res, 'Token saved');
			return;
		}
		global.responseError(res, 401, 'Token not valid : ' + response.statusText);
	})
	.catch(function (error) {
		global.responseError(res, 500, error)
	});
}

exports.create_board_check_args = function(res, json)
{
    if (!global.getParam(json.reaction.params, 'owner'))
        global.responseError(res, 401, 'Missing the owner')
    else if (!global.getParam(json.reaction.params, 'repository'))
       global.responseError(res, 401, 'Missing the repository')
   else if (!global.getParam(json.reaction.params, 'title'))
       global.responseError(res, 401, 'Missing the title')
   else if (!global.getParam(json.reaction.params, 'body'))
       global.responseError(res, 401, 'Missing the body')
    else {
		// #### TODO : check if le project exist and we have the right to create a project on it
        global.saveAREA(res, json);
    }
}

exports.create_board = async function (area, res)
{
	let repository = global.getParam(area.reaction.params, 'repository');
	let owner = global.getParam(area.reaction.params, 'owner');
	let bodyGit = global.getParam(area.reaction.params, 'body');
	let title = global.getParam(area.reaction.params, 'title');

	if (!owner || !repository || !title || !bodyGit) {
		global.responseError(res, 401, 'Missing something');
		return;
	}
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Github});
	if (!token || !token.access_token) {
		global.responseError(res, 401, 'No access token provide');
		return;
	}
	var url =  'https://api.github.com/repos/' + owner + '/' + repository + '/projects';
	console.log(url)
	const body = {
		"name" : title,
		"body" : bodyGit
	}

	fetch(url, {
		'method': 'POST',
		'headers' : {'Authorization' : 'token ' + token.access_token,
						'Accept' : 'application/vnd.github.inertia-preview+json',
						'Content-Type' : 'application/x-www-form-urlencoded'
					},
		'body' : JSON.stringify(body),
	})
	.then(function (response) {
		if (response.status >= 300) {
			return response.json();
		}
		res.send();
		return ;
	})
	.then(function (resjson){
		if (resjson)
			console.error(resjson);
		res.send();
	})
	.catch(function (error) {
		global.responseError(res, 500, 'err : ' + error)
	});
}