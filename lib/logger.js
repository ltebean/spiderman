var winston = require('winston');

var logger = new(winston.Logger)({
	transports: [
		new(winston.transports.Console)({
			level: 'error',
			timestamp: false,
			colorize: true,
		})
	]
});

exports.initLogger = function(options) {
	logger = new(winston.Logger)({
		transports: [
			new(winston.transports.Console)(options)
		]
	});
}

exports.getLogger = function() {
	return logger;
}