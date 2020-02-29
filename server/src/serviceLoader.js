global.Services = new Object();
global.ServiceTokenCheckMap = new Map();

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
	exitProg('Services.json wrong format')
for (service in json.services){
    try {
		var obj = json.services[service];
        var module = require('../services/' + obj.name);

		if (!obj.check_token_function in module || !typeof module[obj.check_token_function] === "function")
			throw obj.name +  ' : check_token_function was not found for ' + obj.name;
		LoadFunction(global.ServiceTokenCheckMap, obj.check_token_function, obj.name, module);
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

if ((global.action === null || global.action.length === 0) || (global.reaction === null || global.reaction.length === 0)) {
	exitProg('The server need at least one action and one reaction');
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
	if (!functionName in module || !typeof module[functionName] === "function")
		throw obj.name +  ' : ' + functionName + ' was not found for ' + obj.name;
	map.set(key, module[functionName])
}

function exitProg(err) {
	if (err)
		console.log(err);
	process.exit(84);
}