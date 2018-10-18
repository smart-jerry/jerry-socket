/**
 * Created by jerry on 2018/10/16.
 */
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io =require('socket.io')(http);
// 设置静态访问目录
app.use('/public', express.static(path.join(__dirname, 'public')));
console.log(path,'dddddddddddddddd');
//app.use(express.static(__dirname+'/public'));
// 引入路由
var mysocket = require('./router/my-scoket');
var myimages = require('./router/my-images');
app.use('/', [mysocket,myimages]);
//  视图
app.set('views',__dirname + '/views')
app.set('view engine', 'ejs');
// socket 监听
io.on('connection',function (socket) {
	console.log('one user inter')
	socket.on('send msg',function (msg) {
		console.log('服务端得到一个消息：'+msg);
		io.emit('send msg', msg);
	})
})
// 监听-本地服务
http.listen(3000, function(){
	console.log('listening on *:3000');
});
