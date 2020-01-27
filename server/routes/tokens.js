exports.newAuth = function (req, res)
{
	if (!req.body.access_token || !req.body.refresh_token || !req.body.expires_in) {
		res.status(401);
		res.json({
			success : false,
			message : 'Bad body'
		});
		return;
	}

	var json = new Object();
	json.user_id = req.body.user_id;
	json.created_the = Date.now();
	json.access_token = req.body.access_token;
	json.refresh_token = req.body.refresh_token;
	json.expires_in = req.body.expires_in;

	switch (req.params.app) {
		case global.serviceDiscord:
			json.service = global.serviceDiscord
			break;
		default:
			global.responseError(res, 401, 'Application not found');
			return;
		};
	global.saveInDb(global.CollectionToken, json, req, res, 'Token saved');
};

exports.getServices = function (req, res)
{
	global.db.collection(global.CollectionToken).find({user_id : req.body.user_id}).toArray(function (err, result) {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
			});
			return;
		}
		var json = new Object();
		json.Discord = false;
		json.Reddit = false;
		json.Imgur = false;
		json.Steam = false;

		var i = 0;
		while (i < result.length) {
			var tk = result[i];
			if (tk.service == global.serviceDiscord)
				json.Discord = true;
			if (tk.service == global.serviceReddit)
				json.Reddit = true;
			if (tk.service == global.serviceImgur)
				json.Imgur = true;
			if (tk.service == global.serviceSteam)
				json.Steam = true;
			i++;
		}
		res.json(json);
    })
};