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
		pushMessageList:[],
		userMark:''
	},
	created:function(){
	
	},
	methods : {
		socketInit:function () {
			var _this = this;
			if(this.mysocket){
				this.mysocket.on('connect',function () {
					console.log(_this.chatName+'链接成功！');
					//得到唯一标志
					_this.mysocket.on('currentMark',function (id) {
						_this.userMark = id;
					})
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
					_this.mysocket.on('wholeComeIn',function (res) {
						_this.welcomeMsg = '"'+res.userName+'" 进入聊天系统！欢迎！！！';
					})
					// 更新聊天人数
					_this.mysocket.on('totalNum',function (res) {
						_this.onlineNum = res;
						window.setTimeout(function () {
							_this.welcomeMsg = '';
						},1000)
					})
					// 有人离开
					_this.mysocket.on('wholeLeave',function (res) {
						_this.welcomeMsg = '"'+res.userName+'" 离开聊天系统！';
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
			this.mysocket.disconnect(false);
		},
		datefilter:function (value,format) {
			console.log(value,format,'8888');
			return value;
//			return window.dateFilter(value,format);
		}
	},
	filters:{
		datefilter:function (value,format) {alert(8);
			console.log(value,format,'8888');
		}
	}
});
