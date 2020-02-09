exports.newAuth = function (req, res)
{
	if (global.ActionTokenCheckMap.get(req.body.service))
		global.ActionTokenCheckMap.get(req.body.service)(req, res);
	else
		global.responseError(res, 401, 'Service unknown')
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
		json.Github = false;

		var i = 0;
		while (i < result.length) {
			var tk = result[i];
			if (!tk.service) {
				i++;
				continue;
			}
			if (tk.service == global.service.Discord)
				json.Discord = true;
			if (tk.service == global.service.Github)
				json.Github = true;
			i++;
		}
		res.json(json);
    })
};