export default {
	// 传入 cookie 键名获取值
	get: function (cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return "";
	},

	// 设置 cookie 值
	set: function (cname, cvalue, exdays) {
		var expires = '';
		if (exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			expires = "expires=" + d.toGMTString();
		}
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
}