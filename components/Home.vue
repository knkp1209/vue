<template>
  <div>
    	<el-container>
    	  <el-aside>
          <menu-tree></menu-tree>
        </el-aside>
    	  <el-main>
          <router-view/>
        </el-main>
    	</el-container>
  </div>
</template>
<script>
import MenuTree from '@/components/MenuTree'
export default {
  name: 'Home',
  components: { MenuTree },
  mounted () {
    this.$ajax({
      method: 'get',
      url: '/api/taobao/api/v3/taobao_goods_list?sort_type=&sort=&address=&page=1&page_num=20'
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
