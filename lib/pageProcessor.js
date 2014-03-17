
function PageProcessor(name,config,performSegue){
	this.name=name;
	this.type=config.type;
	this.performSegue=performSegue;
	//init seques

	this.segues={};
	for(var i=0;i<config.segues.length;i++){
		var segue=config.segues[i]
		this.segues[segue.to]=new Function('$','offer',segue.func)
	}
	//init crawler
	var Crawler = require("crawler").Crawler;
	this.crawler = new Crawler({
	    "maxConnections": 10,
	});
}

PageProcessor.prototype.process=function(url){
	//console.log(url);
	this.crawler.queue([{
        uri: url,
        callback: processPage
    }]);

    var that=this;

    function processPage(error, result, $){
    	if(error) return;
    	function offer(data){
	    	if(data){
		  		that.performSegue(to,data);
		  	}
	    }
    	for (var to in that.segues) {	    	
		  	that.segues[to]($,offer);		  	
		}
    }
}

module.exports=PageProcessor;

