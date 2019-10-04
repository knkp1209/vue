import Api from './Api'
import Tips from './Tips'
import config from './config'
import http from './http'
import getList from './getList'
import _delete from './delete'
import _batchDelete from './batchDelete'
import edit from './edit'

export default function (Vue) {
	// 封装请求方法和API
	Vue.prototype.$api = Api
	Vue.prototype.$tips = Tips;
	Vue.prototype.$config = config;
	Vue.prototype.$http = http;
	Vue.prototype.$httpCount = 0;

	// 自定义公共方法
	Vue.prototype.$getList = getList;
	Vue.prototype.$_delete = _delete;
	Vue.prototype.$_batchDelete = _batchDelete;
	Vue.prototype.$edit = edit;

	// 格式化开始时间和结束时间
	Vue.prototype.$formatTime = function (result) {
		this.start_date = result.start_time.substr(0, 10)
		this.start_time = result.start_time.substr(11, 5)
		this.end_date = result.end_time.substr(0, 10)
		this.end_time = result.end_time.substr(11, 5)
		delete result.end_time
		delete result.start_time
	}

	// 转换成 Bool 类型
	Vue.prototype.$toBool = function (result, name) {
		/*
		if (typeof (name) == 'object') {
			for (let i in name) {
				if (result[name[i]]) {
					result[name][i] = true;
				} else {
					result[name][i] = false;
				}
			}
		} else {
			if (result[name]) {
				return true;
			} else {
				return false;
			}
		}
		*/
		let temp = result[name];
		delete result[name]
		if (temp) {
			return true;
		} else {
			return false;
		}
	}

	// 转换成 Int 类型
	Vue.prototype.$toInt = function (result, name) {
		if (typeof (result[name]) == 'object') {
			let temp = [];
			for (let i in (result[name])) {
				temp[i] = parseInt(result[name][i]);
			}
			delete result[name];
			return temp;
		} else {
			delete result[name];
			return parseInt(result[name]);
		}
	}

	// 分配
	Vue.prototype.$assign = function (result) {
		delete result.id
		Object.assign(this, result)
	}

	// 绑定变量
	Vue.prototype.$bindVars = function (names,result,objName = false) {
		let name,asName;
		for (let i in names) {
			name = names[i];
			asName = name;
			if (typeof name == 'object') {
				asName = name[0];
				name = name[1];
			}
			if (objName) {
				this.$set(this[objName],asName,result[name]);
			} else {
				this[asName] = result[name];
			}
		}
	}

	// 激活导航栏
	Vue.prototype.$activationNav = function (index, path = false) {
		this.$store.commit('MnavIndex', 'reset') // reset 可以是任意值
		this.$nextTick(() => {
			this.$store.commit('MnavIndex', index)
		})
		if (!path) {
			path = index
		}
		this.$router.push({path: path})
	}

}
