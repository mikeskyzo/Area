const fetch = require('node-fetch');

exports.is_service_active = async function (user_id)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : user_id, service : global.Services.Slack});
	if (!token || !token.access_token)
		return false;
	return true;
}

exports.generate_url = function (token)
{
	return 'https://slack.com/oauth/v2/authorize?client_id=' + process.env.SLACK_ID + '&user_scope=chat:write%20channels:read%20groups:read%20mpim:read%20im:read&state=' + token;
}

exports.redirect_auth = async function (req, json)
{
	const code = req.query.code;

	var token = await global.findSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.Services.Slack})
	if (token)
        global.deleteSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.Services.Slack});

	const url = 'https://slack.com/api/oauth.v2.access?client_id=' + process.env.SLACK_ID + '&client_secret=' + process.env.SLACK_SECRET + '&code=' + code;
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
		json.access_token = resjson.authed_user.access_token;
		global.saveInDbAsync(global.CollectionToken, json);
	})
	.catch(function (err){
		console.log(err);
	})
}

exports.send_message = async function (area, res)
{
	let channel_id = global.getParam(area.reaction.params, 'channel_id');
	let message = global.getParam(area.reaction.params, 'message');

	if (!channel_id || !message) {
		global.sendResponse(res, 401, 'Missing channel ID or a message')
		return;
	}

	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Slack});
	if (!token || !token.access_token) {
		global.sendResponse(res, 401, 'No access token provide');
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
		global.sendResponse(res, 500, 'err : ' + error)
	});
}

exports.send_message_check_args = function(json)
{
    if (!global.getParam(json.reaction.params, 'channel_id'))
        return 'Missing channel ID';
    else if (!global.getParam(json.reaction.params, 'message'))
		return 'Missing a message to send';
    else
		return null;
}