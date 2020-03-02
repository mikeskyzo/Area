const fetch = require("node-fetch");
const client_id = '5cfjsk5flx3vkouomr7a26y7usrxmz';

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
    return(84);

};

exports.Twitch_Create_Webhook_NewSubscriber = async function(res, json, next)
{
    await global.saveInDbAsync(global.CollectionArea, json);
    console.log(json);
    var user_id = await Twitch_UserId(global.getParam(json.action.params, 'login'));
    if (user_id === 84) {
        global.responseError(res, 404, 'error, the username is does not match with Twitch database');
        return ;
    }
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/users/follows?to_id=${user_id}&hub.mode=subscribe&hub.callback=${global.url}/webhooks/${json.area_id}&hub.lease_seconds=86400&hub.secret=qj183vwtldxe1k62knihlw0i5cti70`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : client_id}
    });

    if (resp.status == 202) {
        res.status(202).send(`Webhook created on the user ${user_id}`);
    }
    else
        global.responseError(res, 401, 'error, webhook not created, maybe you created too much webhook at once');
};

exports.Twitch_Create_Webhook_NewSubscriber_FM = async function(req, res, area, next)
{
    next(area, res);
};
exports.Twitch_Delete_Webhook_NewSubscriber = async function(area, req, res)
{
    var user_id = await Twitch_UserId(global.getParam(area.action.params, 'login'));
    if (user_id === 84) {
        global.responseError(res, 404, 'error, the username is does not match with Twitch databse');
        return ;
    }
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/users/follows?to_id=${user_id}&hub.mode=unsubscribe&hub.callback=${global.url}/webhooks/${area.id}&hub.lease_seconds=86400&hub.secret=qj183vwtldxe1k62knihlw0i5cti70`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : client_id}
    });

    if (resp.status == 202) {
        await global.deleteInDbAsync(global.CollectionArea, area);
        res.status(202).send(`Webhook created on the user ${user_id}`);
    }
    else
        global.responseError(res, 401, 'error, webhook not deleted');
};



exports.Twitch_Create_Webhook_StreamChangeState = async function(res, json, next)
{
    await global.saveInDbAsync(global.CollectionArea, json);
    var user_id = await Twitch_UserId(global.getParam(json.action.params, 'login'));
    if (user_id === 84) {
        global.responseError(res, 404, 'error, the username is does not match with Twitch databse');
        return ;
    }
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/streams?user_id=${user_id}&hub.mode=subscribe&hub.callback=${global.url}/webhooks/${json.area_id}&hub.lease_seconds=86400`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : client_id}
    });

    if (resp.status == 202) {
        res.status(202).send(`Webhook created on the user ${user_id}`);
    }
    else
        global.responseError(res, 401, 'error, webhook not created, maybe you created too much webhook at once');
};

exports.Twitch_Create_Webhook_StreamChangeState_FM = async function(req, res, area, next){
    next(area, res);
}
exports.Twitch_Delete_Webhook_StreamChangeState = async function(area, req, res)
{
    var user_id = await Twitch_UserId(global.getParam(area.action.params, 'login'));
    if (user_id === 84) {
        global.responseError(res, 404, 'error, the username is does not match with Twitch databse');
        return ;
    }
    let url = `https://api.twitch.tv/helix/webhooks/hub?hub.topic=https://api.twitch.tv/helix/streams?user_id=${user_id}&hub.mode=unsubscribe&hub.callback=${global.url}/webhooks/${area.id}&hub.lease_seconds=86400`;
    let resp = await fetch(url, {
        'method': 'POST',
        'headers' : {'Client-ID' : client_id}
    });

    if (resp.status == 202) {
        await global.deleteInDbAsync(global.CollectionArea, area);
        res.status(202).send(`Webhook created on the user ${user_id}`);
    }
    else
        global.responseError(res, 401, 'error, webhook not deleted');
};


exports.Twitch_Create_Webhook_StreamChangeState_CA = async function(req, res, area, next)
{
    if (!global.getParam(area.action.params, 'login'))
        return 'Missing login';
    else
        return null;
};

exports.confirmWebhookFunctionTwitch = function(req, res, area)
{
    res.send(req.query["hub.challenge"], 202);
};


exports.is_service_active = async function(user_id)
{
    return true;
};