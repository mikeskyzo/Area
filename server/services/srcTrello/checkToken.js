const fetch = require("node-fetch");

exports.CheckToken = function (req, res)
{
	if (!req.body.APIToken || req.body.APIToken.trim() === "") {
		global.responseError(res, 401, "Trello needs a APIToken");
		return;
	}
	if (!req.body.APIKey || req.body.APIKey.trim() === "") {
		global.responseError(res, 401, "Trello needs a APIKey");
		return;
	}

	fetch(`https://api.trello.com/1/members/me/?key=${req.body.APIKey}&token=${req.body.APIToken}`)
	.then(function (response) {
		if (response.status === 200) {
			let json = {
				user_id : req.body.user_id,
				service : global.Services.Trello,
				APIToken : req.body.APIToken,
				APIKey : req.body.APIKey
			};
			global.saveInDb(global.CollectionToken, json, res, "Token saved");
			return;
		}
		throw `Token not valid : ${response.statusText}`;
	})
	.catch(function (error) {
		global.responseError(res, 500, error);
	});
};