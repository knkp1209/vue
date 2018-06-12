<template>
  <div>
    	<el-container>
    	  <el-aside>
          <el-menu>
            <menu-tree :nodes="this.$router.options.routes">
            </menu-tree>
          </el-menu>
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
  data() {
    return {
      nodes: this.$router.options.routes
    }
  },
  components: { MenuTree },
  created() {
    //这里没有直接使用this.$router.options.routes，是因为addRoute的路由规则，在这里this.$router.options.routes获取不到
    //有兴趣的可以看一下源码，是为什么获取不到，但是却又有规则了 
    //另外在开发的时候，可能由于是热部署，也会不断重复的给nodes添加元素，造成导航条有重复的，简单解决，可以设置一个开关
    let isLoadNodes = sessionStorage.getItem('isLoadNodes')
    if (!isLoadNodes) {
      
      let data = JSON.parse(window.sessionStorage.getItem('permission'))
      console.log(data)
      console.log(this.nodes)
      this.nodes.push(...data)
      console.log(this.nodes)
      sessionStorage.setItem('isLoadNodes', 'true')
    }
  },
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
