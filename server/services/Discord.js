const fetch = require("node-fetch");
const FormData = require('form-data');

exports.is_service_active = async function (user_id)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : user_id, service : global.Services.Discord});
	if (!token)
		return false;
	return true;
}

exports.generate_url = function (token)
{
	return 'https://discordapp.com/api/oauth2/authorize?client_id=' + process.env.DISCORD_ID + '&redirect_uri=' + global.redirect_url + '&response_type=code&scope=webhook.incoming&state=' + token
}

exports.redirect_auth = async function (req, json)
{
    const code = req.query.code;
    if (!code) {
        return ;
    }

	var token = await global.findSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.Services.Discord})
	if (token)
        global.deleteSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.Services.Discord});

    const url = 'https://discordapp.com/api/v6/oauth2/token';
    const data = new FormData();

    data.append('client_id', process.env.DISCORD_ID);
    data.append('client_secret', process.env.DISCORD_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', 'https://areacoon-api.eu.ngrok.io/auth/redirect');
    data.append('scope', 'webhook.incoming');
    data.append('code', code);
	fetch(url, {
		method: 'POST',
        body : data,
	})
	.then(function (response) {
        return response.json();
	})
	.then(function (resjson) {
        if (resjson.error) {
            throw resjson.error_description;
        }
        json.webhook_token = resjson.webhook.token;
        json.webhook_id = resjson.webhook.id
        if (!json.webhook_id || !json.webhook_token)
            return ;
		global.saveInDbAsync(global.CollectionToken, json);
	})
	.catch(function (err){
		console.log(err);
	})
}

exports.send_message = async function (area, res)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Discord});
    if (!token) {
		global.responseError(res, 401, 'No access token provide');
		return;
    }
    let body = {
        'content' : global.getParam(area.reaction.params, 'message'),
        username : global.getParam(area.reaction.params, 'username'),
        avatar_url : global.getParam(area.reaction.params, 'avatar')
    };
    let url = 'https://discordapp.com/api/webhooks/' + token.webhook_id + '/' + token.webhook_token;
    let response = await fetch(url, {
        'method': 'POST',
        'body' : JSON.stringify(body),
        'headers' : {'Content-Type' : 'application/json'}
    });
    if (response.status != 200 && response.status != 204)
        global.responseError(res, 401, 'Can\'t send a discord message : ' + response.statusText);
    else
        res.send();
}

exports.send_message_check_args = function(json)
{
    if (!global.getParam(json.reaction.params, 'username'))
        global.addParam(json.reaction.params, 'username', 'Mike')
    let avatar = global.getParam(json.reaction.params, 'avatar')
    if (!avatar || avatar.trim() == '')
        global.modifyParam(json.reaction.params, 'avatar', 'https://i.imgur.com/GMo6l8u.jpg')
    if (!global.getParam(json.reaction.params, 'message'))
       return 'Missing a message to send';
    else
        return null;
}