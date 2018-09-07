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
    activeHomeBannerTabs: '/Home/Banner/List', // 激活的首页广告标签页
    topCategoryList: [], // 顶级分类列表
    visibleCategory: false, // 分类添加功能是否打开
    dialogSpecVisible:false, // 规格选择是否打开
    homeMark: [], // 首页卖点
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
    },
    MactiveHomeBannerTabs (state,string){
      state.activeHomeBannerTabs = string
    },
    MtopCategoryList (state,arr){
      state.topCategoryList = arr
    },
    MvisibleCategory (state,bool) {
      state.visibleCategory = bool
    },
    MdialogSpecVisible (state,bool) {
      state.dialogSpecVisible = bool
    },
    MhomeMark (state,arr) {
      state.homeMark = arr
    },
  }
})

export default store