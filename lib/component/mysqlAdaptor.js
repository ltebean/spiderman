var mysql = require('mysql');

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
	console.dir(data);
	var query = this.connection.query('INSERT INTO '+ this.dbConfig.table+' SET ?', data, function(err, result) {
		if(err){
			console.log(err);
			return;
		}
		console.log('insert success');
	});
}

module.exports = MysqlAdaptor;