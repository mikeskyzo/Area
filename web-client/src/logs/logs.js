let logLevel = 0;

module.exports = {

	logger: {

		setLogLevel: function(value) {
			logLevel = value;
		},

		log: function (level, toLog) {
			if (level <= logLevel)
				console.log(toLog);
		}

	}

};
