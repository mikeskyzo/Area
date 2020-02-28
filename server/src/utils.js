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

global.responseError = function(res, status, massage) {
	res.status(status);
	res.json({
		success : false,
		message : massage
	});
	return;
};

var jwt = require('jsonwebtoken');

exports.verifyToken = function(req, res, next)
{
    if (!req.headers.authorization)  return res.status(401).send({ success: false, message: 'No token provided.' });
	var token = req.headers.authorization.split(' ')[1];
	if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });

	jwt.verify(token, global.secret, function(err, decoded) {
		if (err) {
			res.json({ success: false, message: 'Failed to authenticate token.' });
			return;
		}
		if (decoded.exp > Date.now()){
			res.json({ success: false, message: 'Token expired' });
			return;
		}
		req.body.user_id = decoded.id;
		DoesUserExist(decoded.id, req, res, next);
	});
}

global.DoesUserExist = function (user_id, req, res, next) {
	global.db.collection(global.CollectionUsers).findOne({id : user_id}, (err, result) => {
		if (err) {
			res.status(401);
			res.json({
				success : false,
				message : err.message
			});
			return;
		}
		if(!result) {
			res.status(401);
			res.json({
				success : false,
				message : 'User not found'
			})
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

global.saveAREA = function (res, json)
{
	if (global.new_area)
		global.saveInDb(global.CollectionArea, json, res, 'Area created successfully');
	else {
		global.db.collection(global.CollectionArea).update({'area_id' : json.area_id, 'user_id' : json.user_id}, json, function(err, result) {
			if (err){
				res.status(500);
				res.json({
					success : false,
					message : err.message
				});
				return;
			}
			res.status(201);
			res.json({
				success : true,
				message : 'Area updated',
			});
		});
	}
}

global.deleteInDb = function (collection, params, req, res)
{
	global.db.collection(collection).deleteOne(params, function (err, result) {
		if (err) {
			global.responseError(res, 500, err.message)
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
			global.responseError(res, 401, err.message)
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
