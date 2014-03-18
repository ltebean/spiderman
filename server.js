var express = require('express');
var http = require('http');
var messenger= require('./lib/msg/messenger');
var Spiderman =require('./lib/spiderman');
var yaml = require('js-yaml');
var fs=require('fs');

var app = express();
app.configure(function() {
	app.use(express.cookieParser());
	app.use(express.bodyParser());	
	app.use('/public', express.static(__dirname + '/public'));
	app.use(app.router);
});

app.get('/',function (req,res){
	res.sendfile(__dirname+'/public/index.html')
})


var server = http.createServer(app);
server.listen(3000);


var io= require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

	var clientId;

	socket.on('register', function () {
		clientId=messenger.registerClient(function(msg){		
			socket.emit('data',msg);
		});
		socket.emit('register:success',clientId);
		//msg.addMessage(weiboId,'hahaha');
	});

	socket.on('job:start',function(config){
		config.clientId=clientId;
		new Spiderman(config).start();
	})

	socket.on('disconnect', function () {
		messenger.removeClient(clientId)
	});
});





