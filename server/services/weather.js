var weather = require('openweather-apis');

const weatherApiKey = 'ad3010f61779a0528661aa765a6b2a48'

exports.initWeather = function () {
	weather.setAPPID(weatherApiKey);
	weather.setLang('en');
	weather.setCity('Nantes');
	weather.setUnits('metric');
};

exports.DoesCityExist = function (city, req, res, json, next) {
	weather.setCity(city);
	weather.getAllWeather(function(err, JSONObj){
		if (err || !JSONObj.main) {
			res.status(401);
			res.json({
				success : false,
				message : 'This city does not exist'
			});
		} else {
			if (next)
				next(req, res, json);
		}
	});
};
