const fetch = require("node-fetch");
const {URLSearchParams} = require("url");

async function Twitch_UserId (login)
{
	const url = `https://api.twitch.tv/helix/users?login=${login}`;
	let object = await fetch(url,{
		"method": "GET",
		"headers" : {"Client-ID" : process.env.TWITCH_ID}
	});
	let json = await object.json();
	if(json.data != [])
		if(json.data[0].hasOwnProperty("id"))
			return(json.data[0].id);
	return(-1);
}

exports.newSubscriberWebhookCreate = async function(json)
{
	return (await makeRequest(json, "https://api.twitch.tv/helix/users/follows?to_id={user_id}", "subscribe"));
};

exports.newSubscriberWebhookDelete = async function(json)
{
	await makeRequest(json, "https://api.twitch.tv/helix/users/follows?to_id={user_id}", "unsubscribe");
	return false;
};

exports.streamChangingOfStateWebhookCreate = async function(json)
{
	return (await makeRequest(json, "https://api.twitch.tv/helix/streams?user_id={user_id}", "subscribe"));
};

exports.streamChangingOfStateWebhookDelete = async function(json)
{
	await makeRequest(json, "https://api.twitch.tv/helix/streams?user_id={user_id}", "unsubscribe");
	return false;
};

async function makeRequest(json, hub_topic, hub_mode)
{
	let user_id = await Twitch_UserId(global.getParam(json.action.params, "login"));
	if (!user_id || user_id === -1)
		return "User not found"
	let url = "https://api.twitch.tv/helix/webhooks/hub";
	hub_topic = hub_topic.replace("{user_id}", `${user_id}`);

	const data = new URLSearchParams();
	data.append("hub.topic", hub_topic);
	data.append("hub.mode", hub_mode);
	data.append("hub.callback", global.webhooks_url + json.area_id);
	data.append("hub.lease_seconds", 86400);

	let resp = await fetch(url, {
		method : "POST",
		headers : {"Client-ID" : process.env.TWITCH_ID},
		body : data
	});

	if (resp.status == 202)
		return;
	try {
		let resJson = await resp.json();
		if (!resjson || !resJson.message)
			throw "";
		throw resJson.message;
	} catch (err) {
		return `Failed to ${hub_mode} webhook on Twitch : ${err || resp.statusText}`;
	}
}

exports.confirmWebhookFunctionTwitch = function(req, res, area)
{
	if (req.query["hub.mode"] == "denied")
		; // Delete the area and write in the log
	res.send(req.query["hub.challenge"]);
	if (req.query["hub.mode"] == "unsubscribe")
		return true;
};

exports.TwitchFormatResult = async function(req)
{
	return {};
};

exports.is_service_active = async function(user_id)
{
	return true;
};
