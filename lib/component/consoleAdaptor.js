
function ConsoleAdaptor(config, performSegue) {
}

ConsoleAdaptor.prototype.process = function(data) {
	console.log('receive data: %s', JSON.stringify(data));
}

module.exports = ConsoleAdaptor;