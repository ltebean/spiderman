var yaml = require('js-yaml');
var fs = require('fs');
var Spiderman = require('./lib/spiderman.js');

var config = yaml.load(fs.readFileSync('./config.yaml').toString());

try{
	new Spiderman(config).start();
}catch(err){
	console.log(err);
}
