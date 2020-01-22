exports.initTimer = function () {
	global.timerId = setInterval(refresh, 10000);
};

exports.stopTimer = function () {
    clearInterval(global.timerId);
};

refresh = function () {
	global.db.collection('Area').find({}).toArray(function (err, result) {
        if (err) {
			console.log('Error in data base :');
			console.log(err);
        } else {
            if(!result) {
				console.log('No area in data base')
            } else {
                var i = 0;
                while (i < result.length) {
                    exec_area(result[i]);
                    i++;
                }
            }
        }
    });
};

function exec_area(area) {
    // console.log(area);
}