exports.initTimer = function () {
	global.timerId = setInterval(refresh, 10000);
};

exports.stopTimer = function () {
    clearInterval(global.timerId);
};

refresh = function () {
	global.db.collection('Area').findOne({}, (err, result) => {
        if (err) {
			console.log('Error in data base :');
			console.log(err);
        } else {
            if(!result) {
				console.log('No area in data base')
            } else {
				console.log(result);
            }
        }
    })
};