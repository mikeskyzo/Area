const fetch = require('node-fetch');

exports.send_message = async function (area, res)
{
	let channel_id = global.getParam(area.reaction.params, 'channel_id');
	let message = global.getParam(area.reaction.params, 'message');

	if (!channel_id || !message) {
		global.responseError(res, 401, 'Missing channel ID or a message')
		return;
	}

	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Slack});
	if (!token || !token.access_token) {
		global.responseError(res, 401, 'No access token provide');
		return;
	}
	var url = 'https://slack.com/api/chat.postMessage?token=' + token.access_token + '&channel=' + channel_id + '&text=' + message;
	fetch(url, {
		'method': 'POST',
	})
	.then(function (response) {
		return response.json();
	})
	.then(function (resjson) {
		if (resjson.ok == false) {
			console.error('Bad response from slack : ' + resjson.error);
			res.status(500).send();
		} else {
			res.send();
		}
		return;
	})
	.catch(function (error) {
		global.responseError(res, 500, 'err : ' + error)
	});
}

exports.send_message_check_args = function(res, json)
{
    if (!global.getParam(json.reaction.params, 'channel_id'))
        global.responseError(res, 401, 'Missing channel ID')
    else if (!global.getParam(json.reaction.params, 'message'))
       global.responseError(res, 401, 'Missing a message to send')
    else {
		// #### TODO : check if channel exist
        global.saveAREA(res, json);
    }
}

exports.check_token = async function (req, res)
{
	if (!req.body.access_token) {
		global.responseError(res, 401, 'Need an access token for slack');
		return;
	}
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : req.body.service})
	if (token)
	{
		global.responseError(res, 409, "You have already a token saved for " + req.body.service);
		return;
	}
	var json = {
		user_id : req.body.user_id,
		service : global.Services.Slack,
		access_token : req.body.access_token
	}
	var url =  'https://slack.com/api/auth.test?token=' + req.body.access_token;
	fetch(url, {
		'method': 'POST',
	})
	.then(function (response) {
		return response.json();
	})
	.then(function (resjson) {
		if (resjson.ok == false) {
			global.responseError(res, 401, 'Token is invalid : ' + resjson.error)
		} else {
			global.saveInDb(global.CollectionToken, json, res, 'Token Slack saved for ' + resjson.user  + ' on ' + resjson.team);
		}
	})
	.catch(function (error) {
		global.responseError(res, 500, 'err : ' + error)
	});
}