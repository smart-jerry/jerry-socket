/**
 * Created by jerry on 2018/10/17.
 */
var express = require('express');
var io =baseConfig.socketIo;
var chatroom = io.of('/chatroomvue');

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
	var query = socket.handshake.query;
	// 进入聊天室
	socket.broadcast.emit('wholeComeIn', query);// 进入聊天推送
	// 更新聊天室人数
	chatroom.emit('totalNum', userNum);// 进入聊天推送
	// 接受用户发送的聊天内容
	socket.on('pushMessage',function (msg) {
		// 拿到用户信息
		var chatMessage = {
			userName:query.userName,
			userImg:query.userImg,
			chatMessage:msg
		}
		chatroom.emit('pushMessageList', chatMessage);
	});
	// 离开聊天室，可监听范围:页面刷新、客户端手动关闭
	socket.on('disconnect',function () {
		console.log(query.userName+'离开了....');
		userNum--;
//		console.log(userNum+'===llllllllllllll');
		chatroom.emit('wholeLeave', query);// 进入聊天推送
		// 更新聊天室人数
		chatroom.emit('totalNum', userNum);// 进入聊天推送
	})
})


var router = express.Router();
// chat vue模板
router.get('/chat-vue', function(req, res){
	var baseInfo ={
		a:'a'
	}
	res.render('chat-vue', {data: baseInfo});
});
module.exports = router;