const fetch = require("node-fetch");
const client_id = '5cfjsk5flx3vkouomr7a26y7usrxmz';

async function Twitch_UserId (login)
{
    var url = 'https://api.twitch.tv/helix/users?login=';
    url += login;
    var object = await fetch(url,{
        'method': 'GET',
        'headers' : {'Client-ID' : client_id}
    });
    var json = await object.json()
    if(json.hasOwnProperty('data')){
        return(json.data[0].id);
    }
    return(84);

};

exports.Twitch_Create_Webhook_NewSubscriber = async function(req, res, json, next)
{
    var user_id = await Twitch_UserId(json.action.login);
    if (user_id === 84) {
        global.responseError(res, 404, 'error, the username is does not match with Twitch databse');
        return ;
    }
    console.log(global.url);
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/users/follows?to_id=${user_id}&hub.mode=subscribe&hub.callback=${global.url}/caca&hub.lease_seconds=300&hub.secret=qj183vwtldxe1k62knihlw0i5cti70`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : client_id}
    });

    if (resp.status == 202)
        next(req, res, json);
    else
        global.responseError(res, 401, 'error, webhook not created, maybe you created too much webhook at once');
};

exports.Twitch_Delete_Webhook_NewSubscriber = async function(req, res, json, next)
{
    var user_id = await Twitch_UserId(json.action.login);
    if (user_id === 84) {
        global.responseError(res, 401, 'error 401, User not found');
        return ;
    }
    console.log(global.url);
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/users/follows?to_id=${user_id}&hub.mode=unsubscribe&hub.callback=${global.url}/caca&hub.lease_seconds=86400`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : client_id}
    });

    if (resp.status == 202)
        next(req, res, json);
    else
        global.responseError(res, 401, 'error, webhook not deleted');
};

exports.Twitch_Create_Webhook_StreamChangeState = async function(req, res, json, next)
{
    let user_id = Twitch_UserId(json.action.login);

    if (user_id == 84) {
        global.responseError(res, 401, 'error');
        return (0);
    }

    let url = `https://api.twitch.tv/helix/webhooks/hub?redirect_url=${global.url}/sex&hub.topic=https://api.twitch.tv/helix/streams?user_id=${user_id}&hub.mode=subscribe&hub.callback=${global.url}/caca&hub.lease_seconds=300`;
    let resp = await fetch(url,  {
        'method': 'POST',
        'headers' : {'client_id' : client_id}
    });
    if (resp.status == 202)
        next(req, res, json);
    else
        global.responseError(res, 401, 'error, webhook not created, maybe you created too much webhook at once');
};

exports.Twitch_Delete_Webhook_StreamChangeState = async function(req, res, json, next)
{
    let user_id = Twitch_UserId(json.action.login);
    if (user_id == 84) {
        global.responseError(res, 401, 'error');
        return (0);
    }

    let url = `https://api.twitch.tv/helix/webhooks/hub?redirect_url=${global.url}/sex&hub.topic=https://api.twitch.tv/helix/streams?user_id=${user_id}&hub.mode=unsubscribe&hub.callback=${global.url}/caca&hub.lease_seconds=300`;
    let resp = await fetch(url,  {
        'method': 'POST',
        'headers' : {'client_id' : client_id}
    });
    if (resp.status == 202)
        next(req, res, json);
    else
        global.responseError(res, 401, 'error, webhook not deleted');
};
