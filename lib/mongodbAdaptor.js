
function MongodbAdaptor(name,config,performSegue){
	this.name=name;
	this.type=config.type;
	this.performSegue=performSegue;
}

MongodbAdaptor.prototype.process=function(data){
	console.dir(data);
}

module.exports=MongodbAdaptor;

