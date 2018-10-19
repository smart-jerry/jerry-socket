/**
 * Created by jerry on 2018/10/17.
 */
var express = require('express');
var io =baseConfig.socketIo;
var myNamespace = io.of('/mysocket');
var mygoodsroom = io.of('/mygoodsroom');

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
myNamespace.on('connection',function (socket) {
	console.log('one user inter')
	socket.on('send msg',function (msg) {
		console.log('服务端得到一个消息：'+msg);
		myNamespace.emit('send msg', msg);
	})
})
mygoodsroom.on('connection',function (socket) {
	console.log('ooooooooooooooooooo');
	mygoodsroom.emit('remmodgoods', {goodsId:1,'title':'goods title','img':'http://imcut.jollychic.com/uploads/jollyimg/imageMaterialLib/201810/12/IL201810121434576236.jpg'});
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