const fetch = require('node-fetch');

exports.send_message = async function (area, req, res)
{
	if (!area.channel_id || !req.body.message) {
		global.responseError(res, 401, 'Missing channel ID or a message')
		return;
	}

	var token = await global.findInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.service.Slack});
	if (!token.access_token) {
		global.responseError(res, 401, 'No access token provide');
		return;
	}
	var url = 'https://slack.com/api/chat.postMessage?token=' + token.access_token + '&channel=' + area.channel_id + '&text=' + area.message;
	fetch(url, {
		'method': 'POST',
	})
	.then(function (response) {
		return response.json();
	})
	.then(function (resjson) {
		if (resjson.ok == false) {
			console.error('Bad response from slack : ' + resjson.error);
			exports.status(500).send();
		} else {
			res.send();
		}
	})
	.catch(function (error) {
		global.responseError(res, 500, 'err : ' + error)
	});
}

exports.send_message_check_args = function(req, res, json)
{
    if (!req.body.channel_id)
        global.responseError(res, 401, 'Missing channel ID')
    else if (!req.body.message)
       global.responseError(res, 401, 'Missing a message to send')
    else {
        json.channel_id = req.body.channel_id;
        json.message = req.body.message;
        global.saveAREA(req, res, json);
    }
}

exports.CheckToken = function (req, res)
{
	if (!req.body.access_token) {
		global.responseError(res, 401, 'Need a access token for slack');
		return;
	}
	var json = {
		user_id : req.body.user_id,
		service : global.service.Slack,
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
			global.saveInDb(global.CollectionToken, json, req, res, 'Token Slack saved for ' + resjson.user  + ' on ' + resjson.team);
		}
	})
	.catch(function (error) {
		global.responseError(res, 500, 'err : ' + error)
	});
}