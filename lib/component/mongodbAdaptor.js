var mongo = require('mongodb');
var logger = require('../logger').getLogger();
var events = require('events');
var util = require('util');

function MongodbAdaptor(config) {
	this.dbConfig = config.dbConfig;
	this.db = new mongo.Db(this.dbConfig.db, new mongo.Server(this.dbConfig.host, this.dbConfig.port, {
		auto_reconnect: true
	}), {
		safe: true
	});
	this.db.open(function(err, db) {
		// throw err
	});
}

util.inherits(MongodbAdaptor, events.EventEmitter);

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
			logger.info('insert data: %s', JSON.stringify(data));
		});
	});
}

module.exports = MongodbAdaptor;