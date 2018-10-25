/**
 * Created by jerry on 2018/10/25.
 *
 */

// import io from '../js/socket.io';
var myapp = new Vue({
	el      : '#app',
	data    : {
		chatName  : '',
		loginShow : true,
		mysocket:'',
		chatMessage:'',
		welcomeMsg:'',
		onlineNum:'',
		pushMessageList:[]
	},
	created:function(){
	
	},
	methods : {
		socketInit:function () {
			var _this = this;
			if(this.mysocket){
				this.mysocket.on('connect',function () {
					console.log(_this.chatName+'链接成功！');
					// 聊天信息推送
					_this.mysocket.on('pushMessageList',function (res) {
						_this.pushMessageList.push(res);
						_this.$nextTick(function () {
							// DOM 现在更新了
							var bottom = $('#message-list-ul').position().top + $('#message-list-ul').height();
							window.scrollTo(0,bottom);
						})
					});
					// 进入系统友好提示
					_this.mysocket.on('wholeComeIn',function (res) {console.log(res);
						_this.onlineNum = res.totalNum;
						_this.welcomeMsg = '"'+res.userName+'" 进入聊天系统！欢迎！！！';
						window.setTimeout(function () {
							_this.welcomeMsg = '';
						},1000)
					})
					// 有人离开
					_this.mysocket.on('wholeLeave',function (res) {
						_this.onlineNum = res.totalNum;
						_this.welcomeMsg = '"'+res.userName+'" 离开聊天系统！';
						window.setTimeout(function () {
							_this.welcomeMsg = '';
						},1000)
					})
				});
			}
		},
		gotochat : function () {
			this.loginShow = false;
			this.mysocket = io.connect('/chatroomvue',{
				transports:['websocket'],
				query:{
					userId:5555,
					chatToken:'lilytoken',
					userName:this.chatName
				}
			});
			this.socketInit();
		},
		sendMsg:function () {
			this.mysocket.emit('pushMessage',this.chatMessage);
		},
		closeChat:function () {
			// 关闭聊天
			this.mysocket.disconnect(true);
			/*this.mysocket.emit('leave',{
				userId:5555,
				chatToken:'lilytoken',
				userName:this.chatName
			});*/
		}
	}
});
