'use strict';
module.exports = function(app,io) {

app.post('/api/comments', function(req, res) {
  var widgetExchange = createWidgetExchange({}, req);
  io.of("/chat").emit('message', widgetExchange);
  //console.log('sending message');  
  //console.log('namespace ' + io.of("/chat").clients.length);
  res.send('');
});

app.get('/api/chat-text/:user', function(req, res) {

  console.log('user ' + req.params.user);
  var user = {};
  if(req.params.user === 'guest')
    user.guest = true;
  else if(req.params.user === 'agent')
    user.agent = true;
  else
  {
      res.status(404).send('Not found');
      return;
  }

  res.render('chat-text-home',user);
  console.log('done ' + user);

});

app.post('/api/init-chat/guest', function(req, res) {
  
  callAgent();
  io.of('/chat').on('connection', function(socket){
  console.log('a user connected ' + req.params.user);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
   // listen for the 'message' event
   //socket.on( 'message', function( msg ){
   //console.log( 'User ' + this.id + ' sent message "' + msg + '"' );
   //console.log( 'socket id ' + socket.id);   
   //});
  });

  var widgetExchange = createWidgetExchange({ready:true,spinner:false}, req);
  res.json(widgetExchange);
});

app.post('/api/init-chat/agent', function(req, res) {
  
  io.of('/chat').on('connection', function(socket){
    console.log('agent connected ' + req.params.user);
    socket.on('disconnect', function(){
      console.log('agent disconnected');
    });
  });

  var widgetExchange = createWidgetExchange({ready:true,spinner:false}, req);
  res.json(widgetExchange);
});

};

function createWidgetExchange(widgetExchange, req)
{
  var comments = [];
  var newComment = {
    id: Date.now(),
    text: req.body.text,
    type: req.body.type
  };
  comments.push(newComment);
  widgetExchange.data = comments;
  return widgetExchange;
}

function callAgent()
{
  sleep(5000);
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    //callback();
}