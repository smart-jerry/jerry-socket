/**
 * Created by jerry on 2023/4/13.
 */
var myapp = new Vue({
	el      : '#app',
	data    : {
		message  : ''
	},
	created:function(){

	},
	methods : {
		sendMsg:function () {
			fetch("/sendMsg", {
				method: 'POST',
				body: JSON.stringify({msg:this.message}),
				headers: {
					'content-type': 'application/json'
				}
			}).then(async response => {
				console.log(response)
			})
		}
	}
});
