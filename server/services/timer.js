var discord = require('./discord');
var weather = require('./weather');

exports.initTimer = function () {
    global.timerId = setInterval(refresh, 10000);
};

exports.stopTimer = function () {
    clearInterval(global.timerId);
};

refresh = function () {
	global.db.collection('Area').find({}).toArray(function (err, result) {
        if (err) {
			console.log('Error in data base :');
			console.log(err);
        } else {
            if(!result) {
				console.log('No area in data base')
            } else {
                var i = 0;
                while (i < result.length) {
                    exec_area(result[i]);
                    i++;
                }
            }
        }
    });
};

function exec_area(area) {
    var reaction = getReactionFunct(area.reaction);
    if (!reaction)
        return;

    switch (area.action) {
        case global.Action_weather_time :
            weather.wetherAtTime(area, reaction);
            break;
        case global.Action_weather_change :
            break;
        case global.Action_imgur_new_post :
            break;
        case global.Action_reddit_new_post_sub :
            break;
        case global.Action_reddit_new_post_follower :
            break;
        case global.Action_reddit_new_notification :
            break;
        case global.Action_clock_time_place :
            break;
        case global.Action_steam_players_on_game :
            break;
        case global.Action_steam_friend_online :
            break;
        case global.Action_discord_new_message :
            break;
        case global.Action_discord_user_send_message :
            break;
        case global.Action_youtube_channel_sub :
            break;
        case global.Action_youtube_channel_views :
            break;
        default:
            break;
    }
}

function getReactionFunct(reaction)
{
    switch (reaction) {
        case global.Reaction_discord_send_message :
            return discord.send_message;
        case global.Reaction_discord_message_reaction :
            break;
        case global.Reaction_imgur_upload_picture :
            break;
        case global.Reaction_reddit_post_a_post :
            break;
        case global.Reaction_reddit_post_vote :
            break;
        default:
            break;
    }
}