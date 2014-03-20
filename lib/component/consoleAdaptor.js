var mongo = require('mongodb');
var async = require('async');

function ConsoleAdaptor(config, performSegue) {
	this.config = config;
}

ConsoleAdaptor.prototype.process = function(data) {
	var msg = 'receive data: ' + JSON.stringify(data);
	console.log(msg);
	process.send(msg);
}

module.exports = ConsoleAdaptor;