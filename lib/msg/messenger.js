
var client={};

exports.registerClient=function(cb){
	 var clientId = Date.parse(new Date()); 
	 client[clientId] =cb;
	 return clientId;
}

exports.removeClient=function(clientId){
	if(client[clientId]){
		delete client[clientId];
	}
};

exports.sendMessage=function(clientId,msg){
	if(client[clientId]){
		client[clientId](msg);
	}
}
