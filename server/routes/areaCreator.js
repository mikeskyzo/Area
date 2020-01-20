var express = require('express');
var router = express.Router();

router.post('/CreateArea', function(req, res, next) {
	var action = req.body.action,
		reaction = req.body.reaction;
	if (!action || !reaction) {
		res.status(401);
        res.json({
            success : false,
            message : 'Bad Body'
        });
		return;
	}
	if (!doesAREAExist(action, 'action') || !doesAREAExist(reaction, 'reaction')) {
		res.status(401);
        res.json({
            success : false,
            message : 'Action or rection does not exist'
        });
		return;
	}
	res.json({});
});


router.get('/GetArea', function(req, res, next) {
	res.json({});
});

module.exports = router;


function doesAREAExist(str, type) {
	const action = ['weather_change', 'weather_time']
	const reaction = ['reddit_new_post', 'reddit_reaction_post']

	if (type == 'action' && action.includes(str))
		return true;
	if (type == 'reaction' && reaction.includes(str))
		return true;
	return false;
}