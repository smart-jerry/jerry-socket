/**
 * Created by Administrator on 2018/10/16.
 */


var app = require('express')();
var http = require('http').Server(app);
var io =require('socket.io')(http);
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
//	res.render('index', {data: []});
});

io.on('connection',function (socket) {
	console.log('one user inter')
	socket.on('send msg',function (msg) {
		console.log('服务端得到一个消息：'+msg);
		io.emit('send msg', msg);
	})
})

http.listen(3000, function(){
	console.log('listening on *:3000');
});
