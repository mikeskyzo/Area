const fetch = require("node-fetch");

const creationWebhooks = require("./srcTrello/creationWebhooks.js");
const deleteWebhooks = require("./srcTrello/deleteWebhooks.js");
const creationReactions = require("./srcTrello/creationReactions.js");
const checkToken = require("./srcTrello/checkToken.js");
const formatWebhook = require("./srcTrello/formatWebhook.js");
const authTrello = require("./srcTrello/authTrello.js");

exports.confirmWebhookFunctionTrello = async function(req, res, area)
{
	res.send();
}

exports.createNewWebhookUpdateCard = creationWebhooks.createNewWebhookUpdateCard;

exports.createNewWebhookUpdateList = creationWebhooks.createNewWebhookUpdateList;

exports.createNewWebhookUpdateChecklist = creationWebhooks.createNewWebhookUpdateChecklist;

exports.createNewWebhookUpdateMember = creationWebhooks.createNewWebhookUpdateMember;

exports.createNewWebhookCreateCard = creationWebhooks.createNewWebhookCreateCard;

exports.createNewWebhookCreateList = creationWebhooks.createNewWebhookCreateList;

exports.createNewWebhookCommentCard = creationWebhooks.createNewWebhookCommentCard;

exports.createNewWebhookDeleteCard = creationWebhooks.createNewWebhookDeleteCard;

exports.createNewWebhookRemoveChecklistFromCard = creationWebhooks.createNewWebhookRemoveChecklistFromCard;

exports.createNewWebhookAddChecklistToCard = creationWebhooks.createNewWebhookAddChecklistToCard;

exports.createNewWebhookRemoveMemberFromCard = creationWebhooks.createNewWebhookRemoveMemberFromCard;

exports.createNewWebhookAddAttachmentToCard = creationWebhooks.createNewWebhookAddAttachmentToCard;

exports.createNewWebhookCreateBoard = creationWebhooks.createNewWebhookCreateBoard;

exports.deleteWebhook = deleteWebhooks.deleteWebhook;

exports.CheckToken = checkToken.CheckToken;

exports.is_service_active = async function(user_id)
{
	var token = await global.findInDbAsync(global.CollectionToken, {user_id : user_id, service : global.Services.Trello});
	if (!token || !token.APIKey || !token.ApiToken)
		return false;
	return true;
}

exports.generate_url = authTrello.generate_url;

exports.redirect_auth = authTrello.redirect_auth;

exports.FormatWebhookUpdateModel = formatWebhook.FormatWebhookUpdateModel;

exports.checkArgsCreateCard = creationReactions.checkArgsCreateCard;

exports.trelloCreateCard = creationReactions.trelloCreateCard;

exports.checkArgsCreateList = creationReactions.checkArgsCreateList;

exports.trelloCreateList = creationReactions.trelloCreateList;

exports.checkArgsCreateLabel = creationReactions.checkArgsCreateLabel;

exports.trelloCreateLabel = creationReactions.trelloCreateLabel;

exports.checkArgsCreateBoard = creationReactions.checkArgsCreateBoard;

exports.trelloCreateBoard = creationReactions.trelloCreateBoard;