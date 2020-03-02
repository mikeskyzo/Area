const fetch = require('node-fetch');

exports.is_service_active = async function (user_id)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : user_id, service : global.Services.Spotify});
	if (!token || !token.access_token)
		return false;
	return true;
}

exports.generate_url = function (token)
{
	return "https://accounts.spotify.com/authorize?client_id=" + process.env.SPOTIFY_ID + "&response_type=code&redirect_uri=" + global.redirect_uri + "&scope=user-modify-playback-state user-read-private user-read-currently-playing user-library-modify" + "&state=" + token;
}

exports.redirect_auth = async function (req, json)
{
	const code = req.query.code;
	const url = "https://accounts.spotify.com/api/token"
	const body = {
		"grant_type": "authorization_code",
		"code": code,
		"redirect_uri": global.redirect_uri,
		"client_id": global.env.SPOTIFY_ID
		"client_secret": global.env.SPOTIFY_SECRET 
	}
	fetch(url, {
		'method': 'POST',
		headers: {
			"Accept": "x-www-form-urlencoded",
			"Content-Type": "application/x-www-form-urlencoded"
		}
		body: JSON.stringify(body)
	})
	.then(function (response) {
		if (response.status == 200)
			return response.json();
		throw 'Failure : ' + res;
	})
	.then(function (resjson) {
		json.access_token = resjson.access_token
		global.saveInDbAsync(global.CollectionToken, json);
	})
	.catch(function (err){
		console.log(err);
	})
}

exports.playSong = async function (area, res)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Discord});
    if (!token) {
		global.responseError(res, 401, 'No access token provided');
		return;
    }	
    let body = {
        song_name : global.getParam(area.reaction.params, 'song_name')
    };
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