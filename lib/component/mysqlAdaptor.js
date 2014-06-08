var mysql = require('mysql');
var logger = require('../logger');

function MysqlAdaptor( config, performSegue) {
	this.config = config;
	this.dbConfig = config.dbConfig
	this.connnection = mysql.createConnection({
		host: this.dbConfig.host,
		user: this.dbConfig.user,
		password: this.dbConfig.password
	});
	connection.connect();
}

MysqlAdaptor.prototype.process = function(data) {
	var query = this.connection.query('INSERT INTO '+ this.dbConfig.table+' SET ?', data, function(err, result) {
		if(err){
			logger.error(err);
			return;
		}
		logger.debug('insert data: %s',JSON.stringify(data));
	});
}

module.exports = MysqlAdaptor;