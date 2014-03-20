var mongo = require('mongodb');
var messenger = require('../msg/messenger');
var async = require('async');

function MongodbAdaptor(config, performSegue) {
	this.config = config;
	this.dbConfig = config.dbConfig;
	this.performSegue = performSegue;
	this.db = new mongo.Db(this.dbConfig.db, new mongo.Server(this.dbConfig.host, this.dbConfig.port, {
		auto_reconnect: true
	}));
	this.db.open(function(err, db) {
		// if(err) throw err;
	});
}

MongodbAdaptor.prototype.process = function(data) {
	var clienId = this.config.clientId;
	this.db.collection(this.dbConfig.collection, {
		safe: true
	}, function(err, collection) {
		if (err) throw err;
		collection.insert(data, {
			safe: true
		}, function(err, result) {
			if (err) throw err;
			console.log('insert data: ' + JSON.stringify(data));
			clienId && messenger.sendMessage(clienId, 'insert data: ' + JSON.stringify(data));
		});
	});
}

module.exports = MongodbAdaptor;