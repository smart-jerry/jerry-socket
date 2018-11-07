/**
 * Created by jerry on 2018/10/17.
 */
var express = require('express');
var router = express.Router();
router.get('/getImage', function(req, res){
	console.log(req.getParameter,'===============');
//	res.sendFile(__dirname + 'index.html');
	var baseInfo ={
		a:'a'
	}
	res.render('my-images', {data: baseInfo});
});


// 图片上传请求
router.post('/getImage',function (req,res) {
	console.log(req.body,'4444444444444444444444');
	var data = req.body;
	res.send({
		result:'0',
		message:'success'
	})
//	return res.redirect(req.session.originalUrl);
})

module.exports = router;