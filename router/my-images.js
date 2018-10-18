/**
 * Created by jerry on 2018/10/17.
 */
var express = require('express');
var router = express.Router();
router.get('/getImage', function(req, res){
	console.log(req.baseUrl,'===============');
//	res.sendFile(__dirname + 'index.html');
	var baseInfo ={
		a:'a'
	}
	res.render('my-images', {data: baseInfo});
});
module.exports = router;