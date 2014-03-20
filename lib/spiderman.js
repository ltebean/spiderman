function Spiderman(config) {
	this.components = {}

	var componentFactory = {
		'pageProcessor': require('./component/pageProcessor'),
		'mongodbAdaptor': require('./component/mongodbAdaptor'),
		'MysqlAdaptor': require('./component/MysqlAdaptor'),
		'consoleAdaptor':require('./component/ConsoleAdaptor'),
		'initializer': require('./component/initializer')
	};

	for (var componentName in config.components) {
		var componentConfig = config.components[componentName];
		componentConfig.clientId = config.clientId; //socketid clientid
		this.components[componentName] = new componentFactory[componentConfig.type](componentConfig, performSegue)
	}

	var that = this;

	function performSegue(to, data) {
		that.components[to].process(data);
	}
}

Spiderman.prototype.start = function() {
	this.components['initializer'].process();
};

module.exports = Spiderman;