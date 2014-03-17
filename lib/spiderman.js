function Spiderman(config){
	this.components = {}

	var componentFactory = {
		'pageProcessor': require('./pageProcessor'),
		'mongodbAdaptor': require('./mongodbAdaptor'),
		'initializer':require('./initializer')
	};

	for (var componentName in config.components) {
		var componentConfig = config.components[componentName];
		this.components[componentName] = new componentFactory[componentConfig.type](componentName, componentConfig, performSegue)
	}

	var that=this;

	function performSegue(to, data) {
		that.components[to].process(data);
	}
}

Spiderman.prototype.start = function() {
	this.components['initializer'].process();
};

module.exports=Spiderman;