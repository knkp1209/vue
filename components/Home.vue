<template>
  <div>
      <p class="username">{{user}}</p>
      <el-switch
        v-model="isCollapse"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value=false
        :inactive-value=true>
      </el-switch>
    	<el-container>
    	  <el-aside :style="{width : asideWitdh}">
          <el-menu  background-color="#0f5a9f" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
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
      nodes:{},
      user:'',
      isCollapse: false,
    }
  },
  components: { MenuTree },
  created () {
    this.nodes = JSON.parse(window.sessionStorage.getItem('permission'))
    this.Finishing()
    this.user = window.sessionStorage.getItem('user')
  },
  methods: {
    /*
    * 由于每个组件(登录和4040的除外）都必须有菜单栏，
    * 所以每个组件的都要设置父路由是home。
    * 这使得本来是一级菜单且没有子菜单的变成子菜单（一级菜单有菜单的不影响）
    * 下面的方法将一级菜单且没有子菜单路由重新整理成一级路由
    * (这里的路由不是真正的路由)
    */
    Finishing () {
      this.nodes.forEach((item,index,temp)=>{
        if(item.children.length <= 1){
          temp[index] = item.children[0];
        }
      })
    },
  },
  computed: {
    /*
    * 侧边栏折叠与展开的时改 aside 的宽度
    */
    asideWitdh: function () {
      if (this.isCollapse) {
        return '64px'
      } else {
        return '230px'
      }
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-container {
    position: absolute;
    top: 60px;
    bottom: 0px;
    width: 100%;
}
.el-aside .el-menu {
  border-right: solid 0px;
  height:100%
}

.el-main{
  background: #5b7fa1;
}
.username {
  position: absolute;
  right: 30px;
  top: -8px;
  color:white;
  font-size:22px;
}
.el-switch {
  position: absolute;
  left: 250px;
  top: 20px;
}
.collapse {
  width:64px;
}
</style>
