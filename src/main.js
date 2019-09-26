// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import 'element-ui/lib/theme-chalk/display.css'
import store from './vuex/store'
import MenuUtils from '@/lib/MenuUtils'
import VeeValidate, { Validator } from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
// import VeLine from 'v-charts/lib/line.common' charts
import vueBindPrototypes from '@/lib/vueBindPrototypes'
import cookie from '@/lib/cookie'
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import './assets/icon/iconfont.css'
import App from './App'

vueBindPrototypes(Vue);
// Vue.component(VeLine.name, VeLine) charts

// 生产环境提示
// Vue.config.productionTip = true


Vue.use(VueRouter)
// Vue.use(VueQuillEditor, /* { default global options } */)

const router = new VueRouter({
  mode: 'history',
  base: '/admin',
  routes
})

Validator.addLocale(zh_CN)
Vue.use(VeeValidate, {
  locale: 'zh_CN',
  delay: '0',
  fieldsBagName: 'vee-fields', //默认为 fields
})


if (cookie.get('login')) {
	let data = JSON.parse(window.localStorage.getItem('permission'))
	if (data) {
		//这里是防止用户手动刷新页面，整个app要重新加载,动态新增的路由，会消失，所以我们重新add一次
		let routes = []
		MenuUtils(routes, data)
		router.addRoutes(routes)
	}
} else {
	window.localStorage.clear()
}

router.beforeEach((route, redirect, next) => {
	let logged = JSON.parse(window.localStorage.getItem('permission'))
	if (!logged && route.path !== '/login') { // 未登录状态且访问不是登录页时跳转登录页
		next({ path: '/login' })
	} else {
		if (route.name) {
			if (route.path == '/login' && logged) { // 已登录的访问登录页直接跳转主页
				next({ path: '/home' })
			}
			next() // 访问登录页或者是已登录状态访问功能页
		} else {
			next({ path: '/404' })
		}
	}
})
/*
router.beforeEach((route, redirect, next) => {
	let data = JSON.parse(window.localStorage.getItem('permission'))
  if (data && route.path === '/login') {
    //这里不使用router进行跳转，是因为，跳转到登录页面的时候，是需要重新登录，获取数据的，这个时候，会再次向router实例里面add路由规则，
    //而next()跳转过去之后，没有刷新页面，之前的规则还是存在的，但是使用location的话，可以刷新页面，当刷新页面的时候，整个app会重新加载
    //而我们在刷新之前已经把sessionStorage里的user移除了，所以上面的添加路由也不行执行
		window.localStorage.clear()
		next()
    // window.location.href = '/'
    // return false
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
*/


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
