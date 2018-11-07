/**
 * Created by jerry on 2018/10/17.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/getImage', function(req, res){
//	res.sendFile(__dirname + 'index.html');
	var baseInfo ={
		a:'a'
	}
	res.render('my-images', {data: baseInfo});
});


// 图片上传请求
router.post('/getImage',function (req,res) {
//	console.log(req.body,'4444444444444444444444');
	var resUrl = global.baseConfig.baseUrl+'/';
	var data = req.body.imgurl;
	var path = 'public/images/'+ Date.now() +'.png';//图片存放目录
	var base64 = data.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
	var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
	console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
	fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
		if(err){
			console.log(err);
			res.send({
				result:'1',
				message:'failed',
				imgUrl:resUrl+path
			})
		}else{
			console.log('写入成功！');
			res.send({
				result:'0',
				message:'success',
				imgUrl:resUrl+path
			})
		}
	})
})

module.exports = router;