'use strict';
module.exports = function(app,io) {

app.get('/api/chat-text/:user', function(req, res) {

  console.log('user ' + req.params.user);
  var user = {};
  if(req.params.user === 'guest')
    user.guest = true;
  else if(req.params.user === 'agent')
  {
    user.agent = true;
  }
  else
  {
      res.status(404).send('Not found');
      return;
  }
  res.render('chat-text-home',user);
});

app.post('/api/init-chat/guest', function(req, res) {  
  
  var widgetExchange = createWidgetExchange({}, req.body.text, req.body.type);
  callAgent();
  var guestChat = initChatChannel(io,'1', 'guest');
  guestChat.emit('message',widgetExchange);
  res.json('');
});

app.post('/api/init-chat/agent', function(req, res) {  
  
  var widgetExchange = createWidgetExchange({}, 'Welcome!', 'commentAgent');
  var guestChat = initChatChannel(io,'1', 'agent');
  guestChat.emit('message',widgetExchange);
  res.json('');
});

};

function createWidgetExchange(widgetExchange, text, type)
{
  var comments = [];
  var newComment = {
    id: Date.now(),
    text: text,
    type: type
  };
  comments.push(newComment);
  widgetExchange.data = comments;
  return widgetExchange;
}

function callAgent()
{   
  sleep(5000);   
}

function initChatChannel(io,channelName,userName)
{
  var guestChat = io.of('/chat/'+channelName);

  console.log("client count " + io.engine.clientsCount);

  Object.keys(io.sockets.sockets).forEach(function(id) {
    console.log("ID:",id);    
  })

  Object.keys(guestChat.sockets).forEach(function(id) {
    console.log("Name space ID:",id);    
    console.log("wdsname:",guestChat.connected[id].wdsname);
  })

  guestChat.once('connection', function(socket) {
    console.log('chat connected ' + socket.id);
    socket.wdsname =  userName;  

    socket.on('message', function (msg) {
      console.log('I received message ', msg);
      var chatMsg = createWidgetExchange({status:'ready'}, msg.text, msg.type);
      guestChat.emit('message',chatMsg);
    });

    socket.on('disconnect', function() {
      console.log('chat disconnected ' + channelName);
      //guestChat.emit('message',createWidgetExchange({status:'ready'}, 'Guest has disconnected, Chat session has ended.','whatever'));
    });
  });     

  return guestChat;
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
}