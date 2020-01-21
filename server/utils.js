"use strict";

// Services name
global.serviceDiscord = 'Discord'
global.serviceWeather = 'Weather'

// Collections name
global.CollectionToken = 'Tokens'
global.CollectionUsers = 'Users'
global.CollectionArea = 'Area'

// Reaction name
global.Reaction_discord_send_message = 'discord_send_message'

// Action name
global.Action_weather_time = 'weather_time'

global.saveInDb = function (collection, json, req, res, success_message){

	global.db.collection(collection).insertOne(json, (err, result) => {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
            });
        } else {
            res.status(201);
            res.json({
                success : true,
                message : success_message,
            })
        }
	});
};

global.responseError = function(res, status, massage) {
	res.status(status);
	res.json({
		success : false,
		message : massage
    });
    return;
};
