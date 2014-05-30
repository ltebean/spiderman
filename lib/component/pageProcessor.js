var logger = require('../logger');
var Crawler = require("crawler").Crawler;

function PageProcessor(config, performSegue) {
	this.config = config;
	this.performSegue = performSegue;

	//init seques
	this.segues = {};
	for (var i = 0; i < config.segues.length; i++) {
		var segue = config.segues[i]
		this.segues[segue.to] = new Function('$', 'offer', segue.func)
	}
	//init crawler
	this.crawler = new Crawler({
		maxConnections: 10,
		timeout:5000,
		retries:1,
		retryTimeout:5000,
		skipDuplicates:true,
	});
}

PageProcessor.prototype.process = function(url) {
	logger.debug('begin fetch: ' + url);

	this.crawler.queue([{
		uri: url,
		callback: processPage
	}]);

	var self = this;

	function processPage(error, result, $) {
		if (error) return;

		function offer(data) {
			if (data) {
				self.performSegue(to, data);
			}
		}
		for (var to in self.segues) {
			self.segues[to]($, offer);
		}
	}
}

module.exports = PageProcessor;