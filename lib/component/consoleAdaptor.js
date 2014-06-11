var logger = require('../logger');
var events = require('events');
var util = require('util');

function ConsoleAdaptor(config) {}

util.inherits(ConsoleAdaptor, events.EventEmitter);

ConsoleAdaptor.prototype.process = function(data) {
	logger.info('receive data: %s', JSON.stringify(data));
}

module.exports = ConsoleAdaptor;