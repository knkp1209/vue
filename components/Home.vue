<template>
  <div>
    	<el-container>
    	  <el-aside>
          <el-menu>
            <menu-tree :nodes="nodes"></menu-tree>
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
  data () {
    return {
      nodes:{}
    }
  },
  components: { MenuTree },
  created () {
    this.nodes = JSON.parse(window.sessionStorage.getItem('permission'))
    this.Finishing()
  },
  methods: {
    /*
    由于每个组件(登录和4040的除外）都必须有菜单栏，
    所以每个组件的都要设置父路由是home。
    这使得本来是一级菜单且没有子菜单的变成子菜单（一级菜单有菜单的不影响）
    下面的方法将一级菜单且没有子菜单路由重新整理成一级路由
    (这里的路由不是真正的路由)
    */
    Finishing () {
      this.nodes.forEach((item,index,temp)=>{
        if(item.children.length <= 1){
          temp[index] = item.children[0];
        }
      })
    }
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
