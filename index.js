/**
 * Created by jerry on 2018/10/16.
 */
var express = require('express');
var app = express();
var path = require('path');
var Server = require('http').Server(app);
var io =require('socket.io');
// io
var baseConfig={};
baseConfig.socketIo = io.listen(Server,{ serveClient: false });
//将全局变量设置为不可删除、只读
Object.defineProperty(global, "baseConfig", {
	value: baseConfig,
	writable: false,
	configurable: false
});
// 设置静态访问目录
app.use('/public', express.static(path.join(__dirname, 'public')));
console.log(path,'dddddddddddddddd');
//app.use(express.static(__dirname+'/public'));
// 引入路由
var mysocket = require('./router/my-scoket');
var myimages = require('./router/my-images');
var chat = require('./router/chat');
app.use('/', [mysocket,myimages,chat]);
//  视图
app.set('views',__dirname + '/views')
app.set('view engine', 'ejs');

// 监听-本地服务
Server.listen(3000, function(){
	console.log('listening on *:3000');
});
