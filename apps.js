var path = require('path');
var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'htdocs')));

io.on('connection', function(socket){
  socket.on('send_message', function(text){
    io.sockets.emit('receive_message',text);
  });
});

http.listen(3000);
console.log("Expressサーバーがポート%dで起動しました。モード:%s",port,app.settings.env)