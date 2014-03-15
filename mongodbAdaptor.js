
function MongodbAdaptor(name,config,processSegue){
	this.name=name;
	this.type=config.type;
	this.processSegue=processSegue;
}

MongodbAdaptor.prototype.process=function(data){
	console.dir(data);
}

module.exports=MongodbAdaptor;

