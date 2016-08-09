const 
port = process.env.PORT || 3000,
express = require('express'),
app = express(),
server = require('http').Server(app),
io = require('socket.io')(server),
bodyParser = require('body-parser'),
handlebars  = require('express-handlebars');

app.engine('handlebars', handlebars({defaultLayout: ''}));
app.set('view engine', 'handlebars');
app.use(express.static('web'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

require('./lib/chat-text-routes.js')(app,io);

server.listen(port, function () {
  console.log('WDS listening on port ' + port);


//test socket io
/*var test = io.of("/test");
 test.on('connection', function (socket) {
  	socket.on('msg', function (msg) {
    console.log('I received a private message by saying ', msg);
    test.emit('msg',msg + ' Im a server beeatch');
  });
  });*/

});