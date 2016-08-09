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
    initChatChannel(io);
  }
  else
  {
      res.status(404).send('Not found');
      return;
  }
  res.render('chat-text-home',user);
});

app.post('/api/init-chat/guest', function(req, res) {  
  
  var widgetExchange = createWidgetExchange({ready:true,spinner:false}, req.body.text, req.body.type);
  callAgent();
  res.json(widgetExchange);
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

function initChatChannel(io)
{
  var chat = io.of('/chat');
  chat.on('connection', function(socket) {
    console.log('chat connected');

    socket.on('message', function (msg) {
      console.log('I received message ', msg);
      chat.emit('message',createWidgetExchange({ready:true,spinner:false}, msg.text, msg.type));
    });

    socket.on('disconnect', function(){
      console.log('chat disconnected');
    });
  });     
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    //callback();
}