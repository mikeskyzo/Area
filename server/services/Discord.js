const fetch = require("node-fetch");

exports.check_token = async function (req, res)
{
	if (!req.body.webhook_id || !req.body.webhook_token) {
		global.responseError(res, 401, 'Need a access webhook_token and a webhook_id for Discord');
		return;
    }
    let json = {
        user_id : req.body.user_id,
        service : global.Services.Discord,
        webhook_id : req.body.webhook_id,
        webhook_token : req.body.webhook_token
    };
    let url = 'https://discordapp.com/api/webhooks/' + req.body.webhook_id + '/' + req.body.webhook_token;
    let response = await (await fetch(url, {}));
    if (response.status != 200)
        global.responseError(res, 401, 'Webhook not valid : ' + response.statusText);
    else
		global.saveInDb(global.CollectionToken, json, res, "Webhook Discord saved");
}

exports.send_message = async function (area, res)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Discord});
    if (!token) {
		global.responseError(res, 401, 'No access token provide');
		return;
    }
    let body = {
        'content' : area.reaction.message,
        username : area.reaction.username,
        avatar_url : area.reaction.avatar
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

exports.send_message_check_args = function(res, json)
{
    if (!json.reaction.username)
        json.reaction.username = 'Mike'
    if (!json.reaction.avatar)
        json.reaction.avatar = 'https://i.imgur.com/GMo6l8u.jpg'
    if (!json.reaction.message)
       global.responseError(res, 401, 'Missing a message to send')
    else {
        global.saveAREA(res, json);
    }
}