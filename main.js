// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import axios from 'axios';
import Vuex from 'vuex'
import store from './vuex/store'
import MenuUtils from '@/lib/MenuUtils'

Vue.config.productionTip = true
Vue.prototype.$ajax = axios

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: '/dist',
  routes
})


let data = JSON.parse(window.sessionStorage.getItem('permission'))
if (data) {
  	//这里是防止用户手动刷新页面，整个app要重新加载,动态新增的路由，会消失，所以我们重新add一次
  	let routes = []
  	MenuUtils(routes, data)
  	router.addRoutes(routes)
}

router.beforeEach((route, redirect, next) => {
  	let data = JSON.parse(window.sessionStorage.getItem('permission'))
	if (data && route.path === '/login') {
	  	//这里不使用router进行跳转，是因为，跳转到登录页面的时候，是需要重新登录，获取数据的，这个时候，会再次向router实例里面add路由规则，
	  	//而next()跳转过去之后，没有刷新页面，之前的规则还是存在的，但是使用location的话，可以刷新页面，当刷新页面的时候，整个app会重新加载
	  	//而我们在刷新之前已经把sessionStorage里的user移除了，所以上面的添加路由也不行执行
	  	window.sessionStorage.removeItem('permission')
	  	window.sessionStorage.removeItem('user')
	  	window.location.href = '/'
	  	return false
	}
	if (!data && route.path !== '/login') {
	  	next({ path: '/login' })
	} else {
	  	if (route.name) {
	    	next()
	  	} else {
	   		next({ path: '/404' })
	  	}
	}
})


Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})

// console.log(router);
