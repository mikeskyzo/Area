var uniqid = require('uniqid');
var jwt = require('jsonwebtoken');

exports.creatUser = async function(req, res) {
    var username = req.body.username;
    var pass = req.body.password;
    if (!username || !pass) {
        res.status(401);
        res.json({
            success : false,
            message : 'Bad Body'
        });
        return;
    }
    let result = await global.findInDbAsync(global.CollectionUsers, {name : username.toLowerCase()});
    if (result) {
        global.sendResponse(res, 401, 'Username already taken');
        return;
    }
    let id = uniqid();
    result = await global.saveInDbAsync(global.CollectionUsers, {name : username.toLowerCase(), pass : pass, id : id})
    if (result.insertedCount == 0) {
        global.sendResponse(res, 501, 'Failed to create a new user', false)
        return;
    }
    var token = jwt.sign({ id: id }, global.secret, {
        expiresIn: '1h'
    });
    res.status(201);
    res.json({
        success : true,
        message : 'Created successfully',
        token : token
    })
}

exports.connectUser = async function(req, res) {
    var username = req.body.username;
    var pass = req.body.password;
    if (!username || !pass) {
        res.status(401);
        res.json({
            success : false,
            message : 'Bad Body'
        });
        return;
    }
    let result = await global.findInDbAsync(global.CollectionUsers, {name : username.toLowerCase()});
    if (!result) {
        global.sendResponse(res, 401, 'User not found', false)
        return;
    }
    res.status(200);
    var token = jwt.sign({ id: result.id }, global.secret, {
        expiresIn: '1h'
    });
    res.json({
        success : true,
        message : 'Connect successfully',
        token : token
    });
}

exports.changeUsername = async function (req, res)
{
    if (!req.body.username)
        global.sendResponse(res, 403, 'Missing the new username');
    else {
        let result = await global.updateInDbAsync(global.CollectionUsers, {id : req.body.user_id}, { $set: { 'username' : req.body.username}});
        if (result.modifiedCount === 0)
            global.sendResponse(res, 403, 'You can\'t change to the same username');
        else
            res.json({
                success : true,
                message : 'Username changed'
            });
    }
}

exports.changePassword = async function (req, res)
{
    if (!req.body.new_password)
        global.sendResponse(res, 403, 'Missing the new password');
    else if (!req.body.password)
        global.sendResponse(res, 403, 'Missing the password');
    else {
        let pass = await global.findInDbAsync(global.CollectionUsers, {id : req.body.user_id, pass : req.body.password});
        if (!pass) {
            global.sendResponse(res, 403, 'Wrong password');
            return;
        }
        let result = await global.updateInDbAsync(global.CollectionUsers, {id : req.body.user_id, pass : req.body.password}, { $set: { pass : req.body.new_password}});
        if (result.modifiedCount === 0)
            global.sendResponse(res, 403, 'You can\'t change to the same password');
        else
            res.json({
                success : true,
                message : 'password changed'
            });
    }
}