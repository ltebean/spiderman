var logger = require('../logger').getLogger();
var Crawler = require("crawler").Crawler;
var events = require('events');
var util = require('util');

function PageProcessor(config) {
	//init seques
	var self = this;
	self.segues = {};
	config.segues.forEach(function(segue) {
		self.segues[segue.to] = new Function('$', 'offer', segue.func);
	});
	//init crawler
	self.crawler = new Crawler({
		maxConnections: 10,
		timeout: 5000,
		retries: 1,
		retryTimeout: 5000,
		skipDuplicates: true,
	});
}

util.inherits(PageProcessor, events.EventEmitter);

PageProcessor.prototype.process = function(url) {
	logger.debug('begin fetch: ' + url);

	this.crawler.queue([{
		uri: url,
		callback: processPage
	}]);

	var self = this;

	function processPage(error, result, $) {
		if (error) {
			logger.error('error parsing page: %s'.red, url)
			return;
		}

		function offer(data) {
			if (!data) {
				return;
			}
			self.emit('segue', {
				to: to,
				data: data
			});
		}
		for (var to in self.segues) {
			self.segues[to]($, offer);
		}
	}
}

module.exports = PageProcessor;