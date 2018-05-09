<template>
  <div>
    	<el-container>
    	  <el-aside>
          <aside-tp></aside-tp>
        </el-aside>
    	  <el-main>
          <router-view/>
        </el-main>
    	</el-container>
  </div>
</template>
<script>
import Aside from '@/components/Aside'
export default {
  name: 'Home',
  components: {
    'aside-tp': Aside
  },
  mounted () {
    this.$ajax({
      method: 'get',
      url: '/api/taobao/api/v3/taobao_goods_list?sort_type=&sort=&address=&page=1&page_num=20&category_id=186&address=苏州&price=1000&sprice=400'
    })
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-aside {
    background: #FFFAFA;
    height: auto;
}
.el-main {
    background: #FFF8DC;
    height: 100%;
}
</style>
