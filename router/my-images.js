/**
 * Created by jerry on 2018/10/17.
 */
var express = require('express');
var router = express.Router();
router.get('/getImage', function(req, res){
	console.log(req,'===============');
//	res.sendFile(__dirname + 'index.html');
	var baseInfo ={
		a:'a'
	}
	res.render('my-images', {data: baseInfo});
});


// 图片上传请求
router.post('/get/image',function (request, response) {
	console.log(request.body,'88888888888888888888800000000000000000');
//	res.send({
//		'result':0,
//		'message':'success'
//	});
//	response.render('my-images', {data: {
//		'result':0,
//		'message':'success'
//	}});
})
module.exports = router;