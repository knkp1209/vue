// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VeeValidate, { Validator } from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import routes from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import axios from 'axios';

// Validator.addLocale('zh_CN');
Validator.localize('zh_CN')
Vue.use(VeeValidate,{
    dictionary: {
			zh_CN
		},
    	delay:0,
      fieldsBagName:'vee-fields',//默认为 fields
    }
)

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