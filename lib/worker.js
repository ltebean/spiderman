var Spiderman =  require('./spiderman');

process.on('message', function(config){
	new Spiderman(config).start();
});