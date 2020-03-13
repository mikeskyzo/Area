var mergeJSON = require("merge-json") ;
var servicesJson = require('../services.json');

exports.sendAbout = function(req, res) {
	var services = servicesJson.services;
	for (nb in services) {
		delete services[nb].check_token_function;
		delete services[nb].is_service_active;
		delete services[nb].generate_url_function;
		delete services[nb].redirect_auth_function;
		for (i in services[nb].actions) {
			delete services[nb].actions[i].title;
			delete services[nb].actions[i].functions;
			delete services[nb].actions[i].params;
		}
		for (i in services[nb].reactions) {
			delete services[nb].reactions[i].title;
			delete services[nb].reactions[i].functions;
			delete services[nb].reactions[i].params;
		}
	}
	res.json({
		"client": {
			"host": req.connection.remoteAddress
		},
		"server": {
			"current_time": Date.now() ,
			"services": services
		}
	});
};

exports.getReactions = async function (req, res)
{
	var json = [];
	for (var nb in global.Services) {
		if (global.ServiceIsActiveMap.get(global.Services[nb])) {
			if (await global.ServiceIsActiveMap.get(global.Services[nb])(req.body.user_id)) {
				var serv = getService(global.Services[nb]);
				var reactions = serv.reactions;
				for (i in reactions) {
					delete reactions[i].functions;
					reactions[i].service = global.Services[nb];
				}
				if (reactions)
					json = json.concat(reactions);
				mergeJSON.merge(json.reactions, reactions);
			}
		}
	}
	res.json(json);
}

exports.getActions = async function (req, res)
{
	var json = [];
	for (var nb in global.Services) {
		if (global.ServiceIsActiveMap.get(global.Services[nb])) {
			if (await global.ServiceIsActiveMap.get(global.Services[nb])(req.body.user_id)) {
				var serv = getService(global.Services[nb]);
				var actions = serv.actions;
				for (i in actions) {
					delete actions[i].functions;
					actions[i].service = global.Services[nb];
				}
				if (actions)
					json = json.concat(actions);
			}
		}
	}
	res.json(json);
}

function getService(serviceName)
{
	for (nb in servicesJson.services)
		if (servicesJson.services[nb].name === serviceName)
			return servicesJson.services[nb];
	return null;
}