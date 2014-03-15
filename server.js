var express = require('express');
var http = require('http');

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




