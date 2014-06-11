var events = require('events');
var util = require('util');

function Initializer(config) {
	var self=this;
	self.segues = {};
	config.segues.forEach(function(segue) {
		self.segues[segue.to] = new Function('offer', segue.func)
	});
}

util.inherits(Initializer, events.EventEmitter);

Initializer.prototype.process = function() {

	var self = this;

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
		self.segues[to](offer);
	}
}

module.exports = Initializer;