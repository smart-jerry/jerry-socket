/**
 * Created by jerry on 2018/10/17.
 */
var express = require('express');
var io =baseConfig.socketIo;
var mysocketdemo = io.of('/mysocket');

// 设置允许的来源value
//io.origins(['foo.example.com:443']);
//io.origins((origin, callback) => {
//	console.log(origin,'222222222');
//	var originAry=['http://172.31.11.230:3000/scoket','/mysocket']
//	console.log(originAry.indexOf(origin));
//	if (originAry.indexOf(origin) < 0) {
//		return callback('origin not allowed', false);
//	}
//	callback(null, true);
//});
// socket 监听
mysocketdemo.on('connection',function (socket) {
	console.log('one user inter')
	socket.on('send msg',function (msg) {
		console.log('服务端得到一个消息：'+msg);
		mysocketdemo.emit('send msg', msg);
	})
})

var router = express.Router();
router.get('/myscoket', function(req, res){
	console.log(req.baseUrl,'===============');
//	res.sendFile(__dirname + 'index.html');
	var baseInfo ={
		a:'a'
	}
	res.render('my-socket', {data: baseInfo});
});
router.get('/demoscoket1', function(req, res){
	//	res.sendFile(__dirname + 'index.html');
	var baseInfo ={
		a:'a'
	}
	res.render('my-socket1', {data: baseInfo});
});
module.exports = router;