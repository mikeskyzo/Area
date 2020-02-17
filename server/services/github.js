const fetch = require('node-fetch');

exports.createWebhookIssueEvent = function (req, res, json, next)
{
	createWebhook('issues', req, res, json, next);
}

exports.createWebhookPushOnRepo = function (req, res, json, next)
{
	createWebhook('push', req, res, json, next);
}

async function createWebhook(event, req, res, json, next)
{
	if (!req.body.user || req.body.user.trim() == '') {
		global.responseError(res, 401, 'Github need a username')
		return;
	}
	if (!req.body.repository || req.body.repository.trim() == '') {
		global.responseError(res, 401, 'Github need a repository')
		return;
	}
	json.repository = req.body.repository;
	json.user = req.body.user;
	const url = 'https://api.github.com/repos/' + req.body.user + '/' + req.body.repository + '/hooks';

	var token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Github});
	if (!token || !token.access_token) {
		global.responseError(res, 401, 'No access token provide');
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
		throw 'Failed to create webhook : ' + response.statusText
	})
	.then(function (resJson){
		json.webhook_id = resJson.id
		next(req, res, json);
	})
	.catch(function (error) {
		global.responseError(res, 500, error)
	});
}

exports.deleteWebhook = async function (area, req, res)
{
	if (!area.webhook_id) {
		global.responseError(res, 401, 'The area has no webhook id');
		return;
	}

	var token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Github});
	if (!token.access_token) {
		global.responseError(res, 401, 'No access token provide');
		return;
	}
	var url =  'https://api.github.com/repos/' + area.user + '/' + area.repository + '/hooks/' + area.webhook_id;
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
	if (!req.body.action) {
		res.send();
		return;
	}
	if (area.message) {
		if (area.message.includes('{event}'))
			area.message = area.message.replace('{event}', req.body.action)
		if (area.message.includes('{username}') && req.body.sender && req.body.sender.login)
			area.message = area.message.replace('{username}', req.body.sender.login)
		if (area.message.includes('{repository_name}') && req.body.repository && req.body.repository.name)
			area.message = area.message.replace('{repository_name}', req.body.repository.name)
	}
	next(area, res);
}

exports.FormatWebhookPushOnRepo = function (req, res, area, next)
{
	if (req.body.zen) {
		res.send();
		return;
	}
	if (area.message) {
		if (area.message.includes('{name}') && req.body.pusher && req.body.pusher.name)
			area.message = area.message.replace('{name}', req.body.pusher.name)
		if (area.message.includes('{repository_name}') && req.body.repository && req.body.repository.name)
			area.message = area.message.replace('{repository_name}', req.body.repository.name)
	}
	next(area, res);
}

exports.CheckToken = function (req, res)
{
	if (!req.body.access_token) {
		global.responseError(res, 401, 'Need a access token');
		return;
	}
	fetch('https://api.github.com/user', {
		'method': 'GET',
		'headers' : {'Authorization' : 'token ' + req.body.access_token},
	})
	.then(function (response) {
		if (response.status == 200) {
			var json = {
				user_id : req.body.user_id,
				service : global.service.Github,
				access_token : req.body.access_token
			}
			global.saveInDb(global.CollectionToken, json, req, res, 'Token saved');
			return;
		}
		global.responseError(res, 401, 'Token not valid : ' + response.statusText);
	})
	.catch(function (error) {
		global.responseError(res, 500, error)
	});
}

exports.create_board_check_args = function(req, res, json)
{
    if (!req.body.owner)
        global.responseError(res, 401, 'Missing the owner')
    else if (!req.body.repo)
       global.responseError(res, 401, 'Missing the repository')
   else if (!req.body.title)
       global.responseError(res, 401, 'Missing the title')
   else if (!req.body.body)
       global.responseError(res, 401, 'Missing the body')
    else {
		// #### TODO : check if le project exist and we have the right to create a project on it
        json.owner = req.body.owner;
        json.repo = req.body.repo;
        json.title = req.body.title;
        json.body = req.body.body;
        global.saveAREA(req, res, json);
    }
}

exports.create_board = async function (area, res)
{
	if (!area.owner || !area.repo || !area.title || !area.body) {
		global.responseError(res, 401, 'Missing something');
		return;
	}
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.service.Github});
	if (!token || !token.access_token) {
		global.responseError(res, 401, 'No access token provide');
		return;
	}

	var url =  'https://api.github.com/repos/' + area.user + '/' + area.repository + '/projects';
	const body = {
		"name" : area.title,
		"body" : area.body
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