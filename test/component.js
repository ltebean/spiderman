var should = require('chai').should();
var PageProcessor = require('../lib/component/pageProcessor');
var MongodbAdaptor = require('../lib/component/mongodbAdaptor');
var MysqlAdaptor = require('../lib/component/mysqlAdaptor');
var ConsoleAdaptor = require('../lib/component/consoleAdaptor');
var Initializer = require('../lib/component/initializer');

describe('Component', function() {
	describe('Initializer', function() {
		it('should process the data properly', function(done) {
			var initializer = new Initializer({
				segues: [{
					'to': 'test',
					func: 'offer("data")'
				}]
			});
			initializer.on('segue', function(segue) {
				segue.to.should.equal('test');
				segue.data.should.equal('data');
				done();
			});
			initializer.process();
		});
	});

	describe('pageProcessor', function() {
		it('should process the page properly', function(done) {
			var pageProcessor = new PageProcessor({
				segues: [{
					'to': 'test',
					func: 'offer($("body").html())'
				}]
			});
			pageProcessor.on('segue', function(segue) {
				segue.to.should.equal('test');
				segue.data.should.be.a('string');
				done();
			});
			pageProcessor.process('http://www.baidu.com');
		});
	});
});