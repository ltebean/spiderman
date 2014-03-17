var mongo = require('mongodb');

function MongodbAdaptor(name,config,performSegue){
	this.name=name;
	this.type=config.type;
	this.dbConfig=config.dbConfig;
	this.performSegue=performSegue;
	this.db = new mongo.Db(this.dbConfig.db, new mongo.Server(this.dbConfig.host, this.dbConfig.port, {auto_reconnect: true}));
	this.db.open(function(err, db) {
		if(err) throw err;
	}); 
}

MongodbAdaptor.prototype.process=function(data){
	console.dir(data);
	this.db.collection(this.dbConfig.collection, {safe:true}, function(err, collection) {
		if (!err) {
            collection.insert(data,{safe:true},function(err,result){
            	if(!err) console.log('insert success')
            })
        }
    });
}

module.exports=MongodbAdaptor;

