var logger = require('../logger').getLogger();
var events = require('events');
var util = require('util');

function ConsoleAdaptor(config) {}

util.inherits(ConsoleAdaptor, events.EventEmitter);

ConsoleAdaptor.prototype.process = function(data) {
	console.log(data);
}

module.exports = ConsoleAdaptor;