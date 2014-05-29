
function Initializer(config,performSegue){
	this.config=config;
	this.performSegue=performSegue;
	
	//init seques
	this.segues={};
	for(var i=0;i<config.segues.length;i++){
		var segue=config.segues[i]
		this.segues[segue.to]=new Function('offer',segue.func)
	}
}

Initializer.prototype.process=function(){
	//console.log(url);
	var self=this;
	function offer(data){
	   	if(data){
		  	self.performSegue(to,data);
		}
	}
	
	for (var to in self.segues) {	    	
		self.segues[to](offer);		  	
	}	
}

module.exports=Initializer;

