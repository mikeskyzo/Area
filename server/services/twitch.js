const fetch = require("node-fetch");
let myHeaders = new Headers();
const client_id = '5cfjsk5flx3vkouomr7a26y7usrxmz';

myHeaders.append("client-id", client_id.length.toString());

exports.Twitch_webhook_confirm = function()
{
    return(0);
}

exports.Twitch_UserId = async function(login)
{
    let url = 'https://api.twitch.tv/helix/users?login=';
    let myInit = { method: 'GET',
        headers: myHeaders,
    };
    url += login;
    let object = await fetch(url,myInit).json();
    if(object.hasOwnProperty('data')){
        return(object.data[0]);
    }
    return(84);

};

exports.Twitch_Create_Webhook_NewSubscriber = async function(login, req, res, json)
{
    let user_id = Twitch_UserId(login);
    let myInit = { method: 'POST',
        headers: myHeaders,
    };

    if (user_id == 84) {
        global.responseError(res, 401, 'error');
        return (0);
    }

    let url = `https://api.twitch.tv/helix/webhooks/hub?redirect_url=${global.url/sex}&hub.topic=https://api.twitch.tv/helix/users/follows?to_id=${user_id}&hub.mode=subscribe
    &hub.callback=http://localhost:8080/`;
   let resp = await fetch(url, myInit);
   if (resp.status == 202)
       next(req, res, json);
    else
        global.responseError(res, 401, 'error');
};

exports.Twitch_Delete_Webhook_NewSubscriber = function(login)
{
    let user_id = Twitch_UserId(login);
    let myInit = { method: 'POST',
        headers: myHeaders,
    };

    if (user_id == 84) {
        global.responseError(res, 401, 'error');
        return (0);
    }

    let url = `https://api.twitch.tv/helix/webhooks/hub?redirect_url=${global.url/sex}&hub.topic=https://api.twitch.tv/helix/users/follows?to_id=${user_id}&hub.mode=unsubscribe
    &hub.callback=http://localhost:8080/`;
    let resp = await fetch(url, myInit);
    if (resp.status == 202)
        next(req, res, json);
    else
        global.responseError(res, 401, 'error');
};

exports.Twitch_Create_Webhook_StreamChangeState = function(login)
{
    let user_id = Twitch_UserId(login);
    let myInit = { method: 'POST',
        headers: myHeaders,
    };

    if (user_id == 84) {
        global.responseError(res, 401, 'error');
        return (0);
    }

    let url = `https://api.twitch.tv/helix/webhooks/hub?redirect_url=${global.url/sex}&hub.topic=https://api.twitch.tv/helix/streams?user_id=${user_id}&hub.mode=subscribe&hub.callback=http://localhost:8080/`;
    let resp = await fetch(url, myInit);
    if (resp.status == 202)
        next(req, res, json);
    else
        global.responseError(res, 401, 'error');
};

exports.Twitch_Delete_Webhook_StreamChangeState = function(login)
{
    let user_id = Twitch_UserId(login);
    let myInit = { method: 'POST',
        headers: myHeaders,
    };

    if (user_id == 84) {
        global.responseError(res, 401, 'error');
        return (0);
    }

    let url = `https://api.twitch.tv/helix/webhooks/hub?redirect_url=${global.url/sex}&hub.topic=https://api.twitch.tv/helix/streams?user_id=${user_id}&hub.mode=unsubscribe&hub.callback=http://localhost:8080/`;
    let resp = await fetch(url, myInit);
    if (resp.status == 202)
        next(req, res, json);
    else
        global.responseError(res, 401, 'error');
};
