const fetch = require('node-fetch');
const {URLSearchParams} = require('url');

exports.is_service_active = async function (user_id)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : user_id, service : global.Services.Spotify});
	if (!token || !token.access_token)
		return false;
	return true;
};

exports.generate_url = function (token)
{
	return 'https://accounts.spotify.com/authorize?'
	+ 'client_id=' + process.env.SPOTIFY_ID
	+ "&response_type=code&redirect_uri=" + global.redirect_url
	+ "&scope=user-modify-playback-state user-read-private user-read-currently-playing user-library-modify"
	+ "&state=" + token;
};

exports.redirect_auth = async function (req, json)
{
	var token = await global.findSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.Services.Spotify})
	if (token)
        global.deleteSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : global.Services.Spotify});

	const code = req.query.code;

	const data = new URLSearchParams();
	data.append("grant_type", "authorization_code");
	data.append("redirect_uri", global.redirect_url);
	data.append("client_id", process.env.SPOTIFY_ID);
	data.append("client_secret", process.env.SPOTIFY_SECRET);
	data.append("code", code);

	const url = "https://accounts.spotify.com/api/token";
	fetch(url, {
		'method': 'POST',
		'headers': {"Content-Type": "application/x-www-form-urlencoded"},
		'body': data
	})
	.then(function (response) {
		if (response.status == 200)
			return response.json();
		throw 'Spotify failed to get a token : ' + response.statusText;
	})
	.then(function (resjson) {
		json.access_token = resjson.access_token
		global.saveInDbAsync(global.CollectionToken, json);
	})
	.catch(function (err){
		console.error(err);
	})
};

async function getSongByName(song_name, token)
{
    let url = 'https://api.spotify.com/v1/search?q=' + song_name + '&type=track'
    let response = await fetch(url, {
        'method': 'GET',
        'headers' : { 'Authorization' : 'Bearer ' + token }
    });
    if (response.status != 200)
		return false;
	let resjson = await response.json();
	var track_id;
	try {
		track_id = resjson.tracks.items[0].uri;
	} catch (err) {
		return null;
	}
	return track_id;
}

async function addSongToQueue_request(track_id, token)
{
	let url = `https://api.spotify.com/v1/me/player/add-to-queue?uri=${track_id}`;
    let response = await fetch(url, {
        'method': 'POST',
        'headers' : {'Authorization' : 'Bearer ' + token}
	});
	if (response.status != 204)
		return false;
	return true;
}

exports.SkipSong = async function(area)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Spotify});
    if (!token)
		return 'No access token provide';
	let url = 'https://api.spotify.com/v1/me/player/next';
    let response = await fetch(url, {
        'method': 'POST',
        'headers' : {'Authorization' : 'Bearer ' + token.access_token}
	});
	if (response.status != 204)
		return 'Spotify failed to play next song';
};

exports.addSongToQueue = async function(area)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Spotify});
    if (!token)
		return 'No access token provide';
	let track_id = await getSongByName(global.getParam(area.reaction.params, 'song_name'), token.access_token);
	if (!track_id)
		return 'Spotify didn\'t find the song';
	if (!(await addSongToQueue_request(track_id, token.access_token)))
		return 'Spotify failed to add song queue';
};

exports.playSong = async function (area)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Spotify});
    if (!token)
		return 'No access token provide';
	let track_id = await getSongByName(global.getParam(area.reaction.params, 'song_name'), token.access_token);
	if (!track_id)
		return 'Spotify didn\'t find the song';
	if (!(await addSongToQueue_request(track_id, token.access_token)))
		return 'Spotify failed add song queue';
	let url = 'https://api.spotify.com/v1/me/player/next';
    let response = await fetch(url, {
        'method': 'POST',
        'headers' : {'Authorization' : 'Bearer ' + token.access_token}
	});
	if (response.status != 204)
		return 'Spotify failed to play next song';
};

exports.setVolume = async function(area)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : area.user_id, service : global.Services.Spotify});
    if (!token)
		return 'No access token provide';
	let url = 'https://api.spotify.com/v1/me/player/volume?volume_percent=' + global.getParam(area.reaction.params, 'volume');
    let response = await fetch(url, {
        'method': 'PUT',
        'headers' : {'Authorization' : 'Bearer ' + token.access_token}
	});
	if (response.status != 204)
		return 'Spotify failed to set volume';
};

exports.SkipSongCheckArgs = function(json)
{
	return null;
};

exports.SongCheckArgs = function(json)
{
	let song = global.getParam(json.reaction.params, 'song_name');
    if (!song || song.trim() == '')
	   return 'Missing song name';
    return null;
};

exports.SetVolumeCheckArgs = function(json)
{
	let song = global.getParam(json.reaction.params, 'volume');
    if (!song || isNaN(song))
	   return 'Missing volume value';
    return null;
};