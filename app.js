var yaml=require('js-yaml');
var fs=require('fs');
var PageProcessor=require('./pageProcessor')

var config=yaml.load(fs.readFileSync('./config.yaml').toString());
//console.dir(config)

var components={}

for (var componentName in config.components) {
	components[componentName]=new PageProcessor(componentName,config.components[componentName],processSegue)
}

function processSegue(to,data){
	//console.log(to+":"+data)
	components[to].process(data);
}
	
components[config.startup.component].process(config.startup.url);