'use strict';

let socket = null;
let my_login_name = '';
let my_socket_id = '';

$(function(){
    //ログイン画面表示
    $('#loginForm').show();
    $('#chatForm').hide();

    //ログイン時
    $('#btnLogin').on('click',function(e){
        
        my_login_name = $('#login_name').val();

        if(s("#loginForm").valid() === true){
            //チャット画面表示
            $('#loginForm').hide();
            $('#chatForm').show();

            //ソケット初期化
            initSocket();
        }
        e.preventDefault();
    });

    //チャットメッセージをサーバへ通知
    $('#btnChat').on('click', function(e){
        var chat_message = $('#chat_message').val();
        if(chat_message !== ''){
            socket.emit('say', {
                login_name: my_login_name,
                chat_message: chat_message
            });
        }
        $('#chat_message').val('');
        e.preventDefault();
    });

    //入力中かどうかのステータスをサーバへ通知
})