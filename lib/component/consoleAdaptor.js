var mongo = require('mongodb');
var messenger = require('../msg/messenger');
var async = require('async');

function ConsoleAdaptor(config, performSegue) {
	this.config = config;
}

ConsoleAdaptor.prototype.process = function(data) {
	console.log('receive data: ' + JSON.stringify(data));
	var clientId = this.config.clientId;
	clientId && messenger.sendMessage(clientId, 'receive data: ' + JSON.stringify(data));
}

module.exports = ConsoleAdaptor;