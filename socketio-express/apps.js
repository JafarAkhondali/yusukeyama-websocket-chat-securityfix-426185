var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('a user connected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});