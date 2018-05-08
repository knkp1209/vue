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
