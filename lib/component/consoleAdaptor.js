var logger = require('../logger');

function ConsoleAdaptor(config, performSegue) {}

ConsoleAdaptor.prototype.process = function(data) {
	logger.info('receive data: %s', JSON.stringify(data));
}

module.exports = ConsoleAdaptor;