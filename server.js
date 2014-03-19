var express = require('express');
var http = require('http');
var messenger= require('./lib/msg/messenger');
var Spiderman =require('./lib/spiderman');
var yaml = require('js-yaml');
var stylus = require('stylus');
var nib = require('nib');
var path = require('path');
var fs = require("fs");

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
			new Spiderman(config).start();
		}catch(err){
			socket.emit('data',err);

		}
	})

	socket.on('disconnect', function () {
		messenger.removeClient(clientId)
	});
});





