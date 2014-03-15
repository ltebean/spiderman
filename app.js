var yaml=require('js-yaml');
var fs=require('fs');
var util = require('util');


var componentFactory={
	'pageProcessor':require('./lib/pageProcessor'),
	'mongodbAdaptor':require('./lib/mongodbAdaptor')
}

var config=yaml.load(fs.readFileSync('./config.yaml').toString());

console.log(util.inspect(config, {showHidden: false, depth: null}));//console.dir(config)

var components={}

for (var componentName in config.components) {
	var componentConfig=config.components[componentName];
	components[componentName]=new componentFactory[componentConfig.type](componentName,componentConfig,processSegue)
}

function processSegue(to,data){
	//console.log(to+":"+data)
	components[to].process(data);
}
	
components[config.startup.component].process(config.startup.url);