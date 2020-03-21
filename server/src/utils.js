"use strict";

// Collections name
global.CollectionToken = 'Tokens'
global.CollectionUsers = 'Users'
global.CollectionArea = 'Area'

global.secret = 'secret';

global.sendResponse = function(res, status = 200, massage, success) {
	if (!res) return;
	res.status(status || 200);
	res.json({
		success : success || (status < 300 ? true : false),
		message : massage || (status < 300 ? 'Everything happened properly' : 'Something went wrong')
	});
};

var jwt = require('jsonwebtoken');

exports.verifyToken = function(req, res, next)
{
	let token = extractToken(req, res);
	jwt.verify(token, global.secret, function(err, decoded) {
		if (err) {
			global.sendResponse(res, 403, 'Failed to authenticate token.');
			return;
		}
		req.body.user_id = decoded.id;
		DoesUserExist(decoded.id, req, res, next);
	});
}

function extractToken(req, res)
{
	if (req.query.token)
		return req.query.token;
	if (!req.headers.authorization)  return global.sendResponse(res, 403, 'No authorization header.');
	let token = req.headers.authorization.split(' ')[1];
	if (!token) return global.sendResponse(res, 403, 'No token provided.');
	return token;
}

global.DoesUserExist = function (user_id, req, res, next) {
	global.db.collection(global.CollectionUsers).findOne({id : user_id}, (err, result) => {
		if (err) {
			global.sendResponse(res, 401, err.message);
			return;
		}
		if(!result) {
			global.sendResponse(res, 401, 'User not found');
			return;
		}
		if (next)
			next(req, res);
	});
}

global.findInDbAsync = async function (collection, param) {
	return db.collection(collection).findOne(param);
}

global.findSomeInDbAsync = async function (collection, param) {
	return db.collection(collection).find(param).toArray();
}

global.updateInDbAsync = async function (collection, query, update) {
	return db.collection(collection).updateOne(query, update);
}

global.deleteInDbAsync = async function (collection, param) {
	return db.collection(collection).deleteOne(param);
}

global.deleteSomeInDbAsync = async function (collection, param) {
	return db.collection(collection).deleteMany(param);
}

global.saveInDbAsync = async function (collection, param) {
	return db.collection(collection).insertOne(param);
}

global.getParam = function (params, name)
{
	for (nb in params)
		if (params[nb].name == name)
			return params[nb].value;
	return null;
}

global.modifyParam = function (params, name, newValue)
{
	for (nb in params)
		if (params[nb].name == name) {
			params[nb].value = newValue;
			return;
		}
}

global.addParam = function (params, name, value)
{
	let json = {
		name : name,
		value : value
	}
	params.push(json);
}
