import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    loading: true,
    maxUpload: 5, // 默认 5张 最大文件上传数
    maxSize:   2, // 默认 2M 单个文件最大值（M为单位)
    activeGoodsTabs: 'first', // 激活的商品标签页
  },
  mutations: {
  	Mloading (state,bool){
  		state.loading = bool
  	},
  	MmaxUpload (state,number){
  		state.maxUpload = number
  	},
  	MmaxSize (state,number){
  		state.maxSize = number
  	},
    MactiveGoodsTabs (state,string){
      state.activeGoodsTabs = string
    }
  }
})

export default store