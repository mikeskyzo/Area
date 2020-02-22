exports.newAuth = async function (req, res)
{
	if (!req.body.service) {
		global.responseError(res, 401, 'Missing service');
		return;
	}
	if (global.ServiceTokenCheckMap.get(req.body.service))
		global.ServiceTokenCheckMap.get(req.body.service)(req, res);
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
		let json = {};
		let i = 0;
		while (i < result.length) {
			var tk = result[i];
			if (!tk.service) {
				i++;
				continue;
			}
			json[tk.service] = true
			i++;
		}
		res.json(json);
    })
};

exports.deleteToken = function (req, res)
{
	if (!req.body.service) {
		responseError(res, 401, 'You need to specify a service');
		return ;
	}
	global.deleteInDb(global.CollectionToken, {service : req.body.service, user_id : req.body.user_id}, req, res);
}