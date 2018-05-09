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


Vue.config.productionTip = true
Vue.prototype.$ajax = axios

Vue.use(VueRouter)


const router =  new VueRouter({
  mode: 'history',
  base: '/dist',
  routes
})

// console.log(router);


Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// console.log(router);