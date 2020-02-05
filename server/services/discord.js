const api_client_id = '672107018710155295'
const api_client_secret = 'n3lnZRonjfue-nwjhxXFL_-Tmncx5pz-'
const redirect_uri = 'http%3A%2F%2Fwww.localhost%3A8080%2Fhome'

const requestOAuth2 = 'https://discordapp.com/oauth2/authorize?client_id=' & api_client_id & '&redirect_uri=' & redirect_uri & '&response_type=token&scope=identify'

exports.send_message = function(params, user_id, result, tokens)
{
    const Discord = require('discord.js');
    const client = new Discord.Client();

    client.login('NjcyMTA3MDE4NzEwMTU1Mjk1.Xjg51A.88cce2c9l-vqSoNRcX59MMDeOSA');

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        const channel = client.channels.get(params.channel_id);
        if (channel)
            channel.send(global.enhanceMessage(params.message, result));
    });
}

exports.send_message_check_args = function(req, res, json)
{
    if (!req.body.channel_id)
        global.responseError(res, 401, 'Missing channel ID')
    else if (!req.body.message)
       global.responseError(res, 401, 'Missing a message to send')
    else
        global.saveAREA(req, res, json);
}