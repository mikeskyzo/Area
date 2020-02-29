global.Services = new Object();
global.ServiceGenerateUrlMap = new Map();
global.ServiceRedirectAuthMap = new Map();
global.ServiceIsActiveMap = new Map();

global.Action = new Object();
global.ActionFinishWebhook = new Map();
global.ActionMap = new Map();
global.ActionFormatResultMap = new Map();
global.ActionDeleteWebhookMap = new Map();

global.Reaction = new Object();
global.ReactionMap = new Map();
global.ReactionCheckArgsMap = new Map();


var json = require('../services.json')

if (!json || !json.services)
	global.terminateServer('Services.json wrong format');
for (service in json.services){
    try {
		var obj = json.services[service];
        var module = require('../services/' + obj.name);

		if (obj.generate_url_function && obj.redirect_auth_function) {
			LoadFunction(global.ServiceGenerateUrlMap, obj.generate_url_function, obj.name, module);
			LoadFunction(global.ServiceRedirectAuthMap, obj.redirect_auth_function, obj.name, module);
		}
		else if (!obj.generate_url_function || !obj.redirect_auth_function)
			throw obj.name +  ' : the function to generate url or the function for save token from oauth was not found for ' + obj.name;

		if (!obj.is_service_active)
			throw obj.name +  ' : the function to check if the service is active was not found for ' + obj.name;
		LoadFunction(global.ServiceIsActiveMap, obj.is_service_active, obj.name, module);

		if (obj.actions) {
			for (action in obj.actions)
            	loadActions(obj.actions[action], module);
        }
        if (obj.reactions) {
			for (reaction in obj.reactions)
	            loadReactions(obj.reactions[reaction], module);
		}
		global.Services[obj.name] = obj.name;
        console.log(obj.name + ' is loaded');
    } catch (err) {
        console.error('ERROR', json.services[service].name ? json.services[service].name : null, ': services could not be load');
		console.error(err);
    }
}

if ((global.action == null || global.action.length === 0) || (global.reaction == null || global.reaction.length === 0)) {
	global.terminateServer('The server need at least one action and one reaction');
}

function loadReactions(reaction, module)
{
	var functions = reaction.functions;
	var execute_reaction, verify_arguments;

	for (nb in functions) {
		var funct = functions[nb];
		if (funct.type == "execute_reaction")
			execute_reaction = funct.name
		if (funct.type == "verify_arguments")
			verify_arguments = funct.name
	}
	if (!execute_reaction || !verify_arguments)
		throw 'An action need the function ' + !execute_reaction ? 'execute_reaction' : 'verify_arguments'
	LoadFunction(global.ReactionMap, execute_reaction, reaction.name, module);
	LoadFunction(global.ReactionCheckArgsMap, verify_arguments, reaction.name, module);
	global.Reaction[reaction.name] = reaction.name;
}

function loadActions(action, module)
{
	var functions = action.functions;
	var create_action, format_result, delete_action, finish_webhook;

	for (nb in functions) {
		var funct = functions[nb];
		if (funct.type == "create_action")
			create_action = funct.name
		if (funct.type == "format_result")
			format_result = funct.name
		if (funct.type == "delete_action")
			delete_action = funct.name
		if (funct.type == "confirm_webhook_function")
			finish_webhook = funct.name
	}
	if (!create_action || !format_result || !delete_action)
		throw 'An action need the function ' + !create_action ? 'create_action' : (!format_result ? 'format_result' : 'delete_action')

	if (finish_webhook)
		LoadFunction(global.ActionFinishWebhook, finish_webhook, action.name, module);

	LoadFunction(global.ActionMap, create_action, action.name, module);
	LoadFunction(global.ActionFormatResultMap, format_result, action.name, module);
	LoadFunction(global.ActionDeleteWebhookMap, delete_action, action.name, module);
	global.Action[action.name] = action.name;
}

function LoadFunction(map, functionName, key, module)
{
	if (!module[functionName])
		throw obj.name +  ' : ' + functionName + ' was not found for ' + obj.name;
	if (!(typeof module[functionName] == 'function'))
		throw obj.name +  ' : ' + functionName + ' is not a function in ' + obj.name;
	map.set(key, module[functionName])
}