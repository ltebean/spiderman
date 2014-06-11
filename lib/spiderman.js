var yaml = require('js-yaml');
var fs = require('fs');
var logger = require('./logger');

function Spiderman(options) {

	logger.initLogger({
		level: options.logLevel || 'debug',
		timestamp: false,
		colorize: true,
	});

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
		var component = new componentFactory[componentConfig.type](componentConfig);
		this.components[componentName] = component;
	}

}

Spiderman.prototype.start = function() {
	var self = this;

	function performSegue(segue) {
		self.components[segue.to].process(segue.data);
	}
	for (var name in self.components) {
		self.components[name].on('segue', performSegue);
	}
	this.components['initializer'].process();
};

Spiderman.prototype.run = function(name, data) {

	function performSegue(segue) {
		console.log('send %s to [%s]', segue.data, segue.to);
	}

	var component = this.components[name];
	if (!component) {
		logger.error('component not found: %s'.red, name);
		return;
	}

	component.on('segue', performSegue);
	component.process(data);
};

module.exports = Spiderman;