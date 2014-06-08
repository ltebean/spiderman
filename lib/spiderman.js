var yaml = require('js-yaml');
var fs = require('fs');
var logger = require('./logger');

function Spiderman(options) {
	var config = yaml.load(fs.readFileSync(options.configFile).toString());

	this.components = {}

	var componentFactory = {
		'pageProcessor': require('./component/pageProcessor'),
		'mongodbAdaptor': require('./component/mongodbAdaptor'),
		'mysqlAdaptor': require('./component/mysqlAdaptor'),
		'consoleAdaptor': require('./component/consoleAdaptor'),
		'initializer': require('./component/initializer')
	};

	for (var componentName in config.components) {
		var componentConfig = config.components[componentName];
		this.components[componentName] = new componentFactory[componentConfig.type](componentConfig, performSegue)
	}

	var self = this;

	function performSegue(to, data) {
		self.components[to].process(data);
	}
}

Spiderman.prototype.start = function() {
	this.components['initializer'].process();
};

Spiderman.prototype.test = function(name, initData) {
	this.components[name].performSegue = function(to, data) {
		logger.info('send %s to [%s]', JSON.stringify(data), to);
	}
	this.components[name].process(initData);
};

module.exports = Spiderman;