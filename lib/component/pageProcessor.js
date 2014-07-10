var logger = require('../logger').getLogger();
var events = require('events');
var util = require('util');
var cheerio = require('cheerio');
var request = require('request').defaults({
  jar: true
});

function PageProcessor(config) {
  var self = this;
  self.segues = {};
  config.segues.forEach(function(segue) {
    self.segues[segue.to] = new Function('$', 'offer', segue.func);
  });
}

util.inherits(PageProcessor, events.EventEmitter);

PageProcessor.prototype.process = function(url) {
  logger.debug('begin fetch: ' + url);

  var self = this;

  var jar = request.jar()
  // var cookie = request.cookie("a=b");
  // jar.setCookie(cookie, url);

  request({
    url: url,
    jar: jar,
    method: "GET"
  }, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.error('error parsing page: %s'.red, url)
      return;
    } else {
      self._processResponseBody(body);
    }
  });
}

PageProcessor.prototype._processResponseBody = function(body) {
  var self = this
  var $ = cheerio.load(body);

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

module.exports = PageProcessor;