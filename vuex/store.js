import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    loading: true
  },
  mutations: {
  	Mloading (state,bool){
  		state.loading = bool
  	}
  }
})

export default store