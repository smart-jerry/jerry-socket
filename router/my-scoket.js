/**
 * Created by jerry on 2018/10/17.
 */
var express = require('express');
var router = express.Router();
router.get('/scoket', function(req, res){
	console.log(req.baseUrl,'===============');
//	res.sendFile(__dirname + 'index.html');
	var baseInfo ={
		a:'a'
	}
	res.render('my-socket', {data: baseInfo});
});
module.exports = router;