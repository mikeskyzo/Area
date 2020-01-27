var express = require('express');
var router = express.Router();

var uniqid = require('uniqid');
var jwt = require('jsonwebtoken');

router.post('/createuser', function(req, res, next) {
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
    var id = uniqid();
    global.db.collection(global.CollectionUsers).insertOne({name : username, pass : pass, id : id}, (err, result) => {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
            });
        } else {
            res.status(201);
            var token = jwt.sign({ id: id }, global.secret, {
                expiresIn: '1h'
            });
            res.json({
                success : true,
                message : 'Created successfully',
                token : token
            })
        }
    })
});

router.get('/connectUser', function(req, res) {
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

    global.db.collection(global.CollectionUsers).findOne({name : username, pass : pass}, (err, result) => {
        if (err) {
            res.status(401);
            res.json({
                success : false,
                message : err.message
            });
        } else {
            if(!result) {
                res.status(401);
                res.json({
                    success : false,
                    message : 'User not found'
                })
            } else {
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
        }
    })
});

module.exports = router;