var express = require('express');
var router = express.Router();


router.post('/createuser', function(req, res, next) {
    var username = req.get('username');
    var pass = req.get('password');
    if (!username || !pass) {
        res.status(401);
        res.json({
            success : false,
            message : 'Bad Header'
        });
        return;
    }
    global.db.collection('Users').insertOne({name : username, pass : pass}, (err, result) => {
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
                message : 'Created succesful'
            })
        }
    })
});

router.get('/connectUser', function(req, res) {
    var username = req.get('username');
    var pass = req.get('password');
    if (!username || !pass) {
        res.status(401);
        res.json({
            success : false,
            message : 'Bad Header'
        });
        return;
    }

    global.db.collection('Users').findOne({name : username, pass : pass}, (err, result) => {
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
                res.json({
                    success : true,
                    message : 'Connect succesful'
                });
            }
        }
    })
})


module.exports = router;
