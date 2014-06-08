var winston = require('winston');

var logger = new(winston.Logger)({
	transports: [
		new(winston.transports.Console)({
			level: 'debug',
			timestamp: false,
			colorize: true,
		})
	]
});

module.exports=logger;