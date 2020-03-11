const fetch = require('node-fetch');

exports.is_service_active = async function (user_id)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : user_id, service : global.Services.Slack});
	if (!token || !token.access_token)
		return false;
	return true;
};

exports.generate_url = function (token)
{
	return 'https://slack.com/oauth/v2/authorize?'
	+ 'client_id=' + process.env.SLACK_ID
	+ '&redirect_uri=' + global.redirect_url
	+ '&user_scope=chat:write%20channels:read%20groups:read%20mpim:read%20im:read'
	+ '&state=' + token;
};

exports.redirect_auth = async function (req, json)
{
	const code = req.query.code;

	var token = await global.findSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.Services.Slack})
	if (token)
        global.deleteSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.Services.Slack});

	const url = 'https://slack.com/api/oauth.v2.access?client_id=' + process.env.SLACK_ID
	+ '&client_secret='	+ process.env.SLACK_SECRET
	+ '&code=' + code
	+ '&redirect_uri=' + global.redirect_url;
	fetch(url, {
		'method': 'POST',
		headers : {"Accept": "application/json"}
	})
	.then(function (response) {
		if (response.status == 200)
			return response.json();
		throw 'Failure : ' + res;
	})
	.then(function (resjson) {
		json.access_token = resjson.authed_user.access_token;
		global.saveInDbAsync(global.CollectionToken, json);
	})
	.catch(function (err){
		console.error(err);
	})
};

exports.send_message = async function (area)
{
	let channel_id = global.getParam(area.reaction.params, 'channel_id');
	let message = global.getParam(area.reaction.params, 'message');

	if (!channel_id || !message)
		return 'Missing channel ID or message';
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Slack});
	if (!token || !token.access_token)
		return 'No access token provided';
	let url = 'https://slack.com/api/chat.postMessage?token=' + token.access_token + '&channel=' + channel_id + '&text=' + message;
	try {
		let resjson = await fetch(url, {
			'method': 'POST',
		}).json();
		if (resjson.ok == false)
			return 'Bad response from slack : ' + resjson.error
	} catch (err) {
		return 'Error from Slack response' + err
	}
};

exports.send_message_check_args = function(json)
{
    if (!global.getParam(json.reaction.params, 'channel_id'))
        return 'Missing channel ID';
    else if (!global.getParam(json.reaction.params, 'message'))
		return 'Missing message to send';
};