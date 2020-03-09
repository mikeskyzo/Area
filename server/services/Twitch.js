const fetch = require("node-fetch");

async function Twitch_UserId (login)
{
    var url = 'https://api.twitch.tv/helix/users?login=';
    url += login;
    var object = await fetch(url,{
        'method': 'GET',
        'headers' : {'Client-ID' : process.env.TWITCH_ID}
    });
    var json = await object.json()
    if(json.data != [])
        if(json.data[0].hasOwnProperty('id'))
            return(json.data[0].id);
    return(-1);
};

exports.newSubscriberWebhookCreate = async function(json)
{
    var user_id = await Twitch_UserId(global.getParam(json.action.params, 'login'));
    if (user_id === -1)
        return 'User not found'
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/users/follows?to_id=${user_id}&hub.mode=subscribe&hub.callback=${global.url}/webhooks/${json.area_id}&hub.lease_seconds=86400&hub.secret=qj183vwtldxe1k62knihlw0i5cti70`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : process.env.TWITCH_ID}
    });

    if (resp.status == 202)
        return;
    let resjson;
    try {
        resJson = await resp.json();
    } catch (err) {
        return 'Failed to create webhook on Twitch : ' + resp.statusText;
    }
    return resjson.message;
};

exports.newSubscriberWebhookDelete = async function(area, req, res)
{
    var user_id = await Twitch_UserId(global.getParam(area.action.params, 'login'));
    if (user_id === -1)
        return 'Can\'t find the user'
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/users/follows?to_id=${user_id}&hub.mode=unsubscribe&hub.callback=${global.url}/webhooks/${area.area_id}&hub.lease_seconds=86400&hub.secret=qj183vwtldxe1k62knihlw0i5cti70`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : process.env.TWITCH_ID}
    });

    if (resp.status != 202)
        ; // write in a log
};



exports.streamChangingOfStateWebhookCreate = async function(res, json, next)
{
    var user_id = await Twitch_UserId(global.getParam(json.action.params, 'login'));
    if (user_id === -1)
        return 'Can\'t find the user'
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/streams?user_id=${user_id}&hub.mode=subscribe&hub.callback=${global.url}/webhooks/${json.area_id}&hub.lease_seconds=86400`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : process.env.TWITCH_ID}
    });
    if (resp.status == 202)
        return;
    let resjson;
    try {
        resJson = await resp.json();
    } catch (err) {
        return 'Failed to create webhook on Twitch : ' + resp.statusText;
    }
    return resjson.message;
};

exports.TwitchFormatResult = async function(req)
{
	return {};
}

exports.streamChangingOfStateWebhookDelete = async function(area, req, res)
{
    var user_id = await Twitch_UserId(global.getParam(area.action.params, 'login'));
    if (user_id === -1)
        return 'Can\'t find the user'
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/streams?user_id=${user_id}&hub.mode=unsubscribe&hub.callback=${global.url}/webhooks/${area.id}&hub.lease_seconds=86400`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : process.env.TWITCH_ID}
    });

    if (resp.status != 202)
        ; // write in a log
};

exports.confirmWebhookFunctionTwitch = function(req, res, area)
{
    res.send(req.query["hub.challenge"], 200);
}

exports.is_service_active = async function(user_id)
{
    return true
}
