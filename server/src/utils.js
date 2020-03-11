"use strict";

// Collections name
global.CollectionToken = 'Tokens'
global.CollectionUsers = 'Users'
global.CollectionArea = 'Area'

global.secret = 'secret';

global.saveInDb = function (collection, json, res, success_message){

	global.db.collection(collection).insertOne(json, (err, result) => {
		if (err) {
			res.status(401);
			res.json({
				success : false,
				message : err.message
			});
		} else {
			res.status(201);
			res.json({
				success : true,
				message : success_message,
			})
		}
	});
};

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

global.getToken = function (user_id, service, result, next) {
	global.db.collection(global.CollectionToken).findOne({id : user_id, service : service}, (err, rslt) => {
		if (err) return;
		if(!rslt) return;
		if (next)
			next(params, result, rslt);
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

global.saveAREA = function (res, json)
{
	global.saveInDb(global.CollectionArea, json, res, 'Area created successfully');
}

global.deleteInDb = function (collection, params, req, res)
{
	global.db.collection(collection).deleteOne(params, function (err, result) {
		if (err) {
			global.sendResponse(res, 500, err.message)
			return;
		}
		res.status(201);
		res.json({
			success : true,
			message : 'Deleted',
		});
		return;
	});
}

global.findInDb = function (collection, params, req, res, next)
{
	global.db.collection(collection).findOne(params, (err, result) => {
		if (err) {
			global.sendResponse(res, 401, err.message)
			return;
		}
		if (next)
			next(result, req, res);
	});
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
