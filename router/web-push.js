/**
 * Created by jerry on 2023/4/13.
 */
var express = require('express');
var router = express.Router();
var push = require("./web-push-api");
push.setup().then(()=>console.log("web push api init success!"))
// chat vue模板
router.get('/web-push', function(req, res){
	var baseInfo ={
		a:'web push demo'
	}
	res.render('web-push', {data: baseInfo});
});
let subscribeOption = {};
router.post('/subscribe', async (req,res) => {
	subscribeOption = req.body;
	const { endpoint, keys: { auth, p256dh } } = subscribeOption;
	push.sendMessageWithSubscription(
		{ type: 'subscribe', message: '感谢订阅^_^' },
		{ endpoint, keys: { auth, p256dh } }
	);
	res.send({
		result:'0',
		message:'success'
	})
})
router.post('/sendMsg',function (req, res){
	console.log(req.body,'===req');
	const { endpoint, keys: { auth, p256dh } } = subscribeOption;
	push.sendMessageWithSubscription(
		{ type: 'newOrder', message: req.body },
		{ endpoint, keys: { auth, p256dh } }
	);
	res.send({
		result:'0',
		message:'success'
	})
})
module.exports = router;

