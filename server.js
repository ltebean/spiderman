var express = require('express');
var http = require('http');
var messenger= require('./lib/msg/messenger');
var Spiderman =require('./lib/spiderman');
var yaml = require('js-yaml');
var stylus = require('stylus');
var nib = require('nib');
var path = require('path');
var fs = require("fs");
var cp=require('child_process');

var app = express();
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
	app.use(express.cookieParser());
	app.use(express.bodyParser());
    app.use(stylus.middleware({
        src: __dirname + '/public/assets',
        compile: function compile(str, path) {
          return stylus(str)
            .set('filename', path)
            .use(nib());
        }
    }));
    app.use(express.static(path.join(__dirname, 'public/assets')));
	app.use(app.router);
});

app.get('/',function (req,res){
    var config = yaml.load(fs.readFileSync('./empty.yaml').toString());

    res.render('index', {
        title: "Spiderman",
        config: config
    });

})


var server = http.createServer(app);
server.listen(3000);


var io= require('socket.io').listen(server);
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging
io.set('transports', [
    'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
]);
io.sockets.on('connection', function (socket) {

	var clientId;

	var worker;

	socket.on('register', function () {
		clientId=messenger.registerClient(function(msg){
			socket.emit('data',msg);
		});
		socket.emit('register:success',clientId);
		//msg.addMessage(weiboId,'hahaha');
	});

	socket.on('job:start',function(config){
		config.clientId=clientId;
		try{
			if(worker){
				worker.kill('SIGHUP');
			}
			worker = cp.fork('./lib/worker.js');
			worker.send(config);
			socket.emit('data','starting job...');
			worker.on('message',function(msg){
				messenger.sendMessage(msg.clientId,msg.msg);
			})
		}catch(err){
			console.log(err);
			socket.emit('data','error: ' + err.message);
		}
	});

	socket.on('job:stop',function(data){
		worker && worker.kill('SIGHUP');
		socket.emit('data','job stopped');
	})

	socket.on('disconnect', function () {
		messenger.removeClient(clientId)
	});
});





