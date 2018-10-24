/**
 * Created by jerry on 2018/10/17.
 */
var express = require('express');
var io =baseConfig.socketIo;
var chatroom = io.of('/chatroom');

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
var userNum = 0;
chatroom.on('connection',function (socket) {
	userNum++;
	console.log(userNum+' users inter');
	// 接受用户发送的聊天内容
	socket.on('pushMessage',function (msg) {
		// 拿到用户信息
		var query = socket.handshake.query;
		var chatMessage = {
			userName:query.userName,
			userImg:query.userImg,
			chatMessage:msg
		}
		chatroom.emit('pushMessageList', chatMessage);
	})
})


var router = express.Router();
router.get('/chat', function(req, res){
	console.log(req.baseUrl,'===============');
//	res.sendFile(__dirname + 'index.html');
	var baseInfo ={
		a:'a'
	}
	res.render('chat', {data: baseInfo});
});
module.exports = router;