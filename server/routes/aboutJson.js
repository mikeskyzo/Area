var mergeJSON = require("merge-json") ;
var servicesJson = require('../services.json');

exports.sendAbout = function(req, res) {
	var services = servicesJson.services;
	for (nb in services) {
		delete services[nb].check_token_function;
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
	var json = {
		reactions : []
	};
	var services = await global.findSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id});
	services.forEach(element => {
		var serv = getService(element.service);
		var reactions = serv.reactions;
		for (nb in reactions) {
			delete reactions[nb].functions;
			reactions[nb].service = element.service;
		}
		mergeJSON.merge(json.reactions, reactions);
	});
	res.json(json);
}

exports.getActions = async function (req, res)
{
	var json = {
		actions : []
	};
	var services = await global.findSomeInDbAsync(global.CollectionToken, {user_id : req.body.user_id});
	services.forEach(element => {
		var serv = getService(element.service);
		var actions = serv.actions;
		for (nb in actions){
			delete actions[nb].functions;
			actions[nb].service = element.service;
		}
		mergeJSON.merge(json.actions, actions);
	});
	res.json(json);
}

function getService(serviceName)
{
	for (nb in servicesJson.services)
		if (servicesJson.services[nb].name === serviceName)
			return servicesJson.services[nb];
	return null;
}