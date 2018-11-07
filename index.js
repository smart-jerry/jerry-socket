/**
 * Created by jerry on 2018/10/16.
 */
var express = require('express');
var app = express();
var path = require('path');
var Server = require('http').Server(app);
var io =require('socket.io');
var bodyParser = require('body-parser');// HTTP请求体解析的中间件，使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体
// io
var baseConfig={};
baseConfig.socketIo = io.listen(Server,{ serveClient: false });
//将全局变量设置为不可删除、只读
Object.defineProperty(global, "baseConfig", {
	value: baseConfig,
	writable: false,
	configurable: false
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
// 设置静态访问目录
app.use('/public', express.static(path.join(__dirname, 'public')));
console.log(path,'dddddddddddddddd');
//app.use(express.static(__dirname+'/public'));
// 引入路由
var mysocket = require('./router/my-scoket');
var myimages = require('./router/my-images');
var chat = require('./router/chat');
var chatvue = require('./router/chat-vue');
app.use('/', [mysocket,myimages,chat,chatvue]);
//  视图
app.set('views',__dirname + '/views')
app.set('view engine', 'ejs');

// 监听-本地服务
Server.listen(4000, function(){
	console.log('listening on *:4000');
});
