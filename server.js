let http = require('http');
let socketio = require('socket.io');
let fs = require('fs');
let url = require('url');
let path = require('path');

let port_num = 8080;

let load_static_file = function (uri, response) {
    var tmp = uri.split('.');
    var type = tmp[tmp.length - 1];
    var filename = path.join(process.cwd(), uri);

    fs.exists(filename, function (exists){
        if(!exists){
            response.writeHead(404, { 'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();
            return;
        }

        fs.readFile(filename, 'binary', function(err, file){
            if(err){
                response.writeHead(500, { 'Content-Type': 'text/plain'});
                response.write(err + '\n');
                response.end();
                return;
            }

            switch (type) {
                case 'html':
                    response.writeHead(200, { 'Content-Type': 'text/html'});
                    break;
                case 'js':
                    response.writeHead(200, {'Content-Type': 'text/javascript'});
                    break;
                case 'css':
                    response.writeHead(200, {'Content-Type': 'text/css'});
                    break;
                case 'jpg':
                    response.writeHead(200, {'Content-Type': 'image/jpeg'});
                    break;
            }
            response.write(file, 'binary');
            response.end();
        });
    });
};

let server = http.createServer(
    function (req, res){
        var uri = url.parse(req.url).pathname;
        load_static_file(uri, res);
    }
).listen(port_num);

let io = socketio.listen(server);

//ログインユーザ管理用
var login_users = {};

io.sockets.on('connection', function(socket){

    console.log('接続:' + socket.id);

    //接続時にソケットIDをサーバーからクライアントに送る
    io.to(socket.id).emit('onConnect', {
        socket_id: socket.id
     });

     //ログインユーザ追加
     socket.on('onConnect', function (data){
         login_users[data.socket_id] = data.login_name;
         console.log(login_users);
     });

     //チャットメッセージの同期
     socket.on('say', function(data){
         io.sockets.emit('say',{
             socket_id: socket.id,
             login_name: data.login_name,
             chat_message: data.chat_message
         });
    });

    //他ユーザがログインしたときにメッセージとして通知
    socket.on('join', function(data){
        socket.broadcast.emit('join',{
            socket_id: socket.id,
            login_name: data.login_name
        });
    });

    //他ユーザの入力中のときにステータスとして通知
    socket.on('keydown', function(data){
        socket.broadcast.emit('keydown',{
            socket_id: socket.id,
            login_name: data.login_name
        });
    });
    socket.on('keyup', function(data){
        socket.broadcast.emit('keyup', {});
    });

    //切断したときにメッセージとして通知
    socket.on('disconnect', function(){
        var key = socket.id.slice(2);

        socket.broadcast.emit('logout', {
            socket_id: socket.id,
            login_name: login_users[key]
        });
        //ログインユーザから削除
        console.log(key);
        delete login_users[key];
        console.log(login_users);
    });
});