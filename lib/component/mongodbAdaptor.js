var mongo = require('mongodb');
var logger = require('../logger');

function MongodbAdaptor(config, performSegue) {
	this.config = config;
	this.dbConfig = config.dbConfig;
	this.performSegue = performSegue;
	this.db = new mongo.Db(this.dbConfig.db, new mongo.Server(this.dbConfig.host, this.dbConfig.port, {
		auto_reconnect: true
	}));
	this.db.open(function(err, db) {
		// throw err
	});
}

MongodbAdaptor.prototype.process = function(data, cb) {
	this.db.collection(this.dbConfig.collection, {
		safe: true
	}, function(err, collection) {
		if (err) throw err;
		collection.insert(data, {
			safe: true
		}, function(err, result) {
			if (err) {
				logger.error(err);
				return
			}
			logger.debug('insert data: %s', JSON.stringify(data));
		});
	});
}

module.exports = MongodbAdaptor;