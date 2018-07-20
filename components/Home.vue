<template>
  <div>
    <p class="username">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{user}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </p>
    <el-switch v-model="isCollapse" active-color="#13ce66" inactive-color="#ff4949" :active-value=false :inactive-value=true>
    </el-switch>
    <el-container>
      <el-aside :style="{width : asideWitdh}">
        <el-menu background-color="#0f5a9f" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
          <menu-tree :nodes="nodes"></menu-tree>
        </el-menu>
      </el-aside>
      <el-main v-loading="loading">
        <transition name="el-zoom-in-bottom">
          <router-view/>
        </transition>
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
      nodes: {},
      user: '',
      isCollapse: false,
    }
  },
  components: { MenuTree },
  created() {
    this.nodes = JSON.parse(window.sessionStorage.getItem('permission'))[0].children
    this.user = window.sessionStorage.getItem('user')
  },
  methods: {
    handleCommand(command) {
      let _this = this;
      this.$ajax({　
        dataType: 'json',
        method: 'get',
        url: this.base_url + '/admin/logout',
      }).then(function(res) {
        window.sessionStorage.removeItem('permission')
        window.sessionStorage.removeItem('user')
        window.location.href = '/'
      }).catch(function(err) {
        _this.$message.error(err.response.data.msg);
        window.sessionStorage.removeItem('permission')
        window.sessionStorage.removeItem('user')
        window.location.href = '/'
      })
    }
  },
  computed: {
    /*
     * 侧边栏折叠与展开的时改 aside 的宽度
     */
    asideWitdh() {
      if (this.isCollapse) {
        return '64px'
      } else {
        return '230px'
      }
    },
    loading() {
      return this.$store.state.loading;
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
  height: 100%
}

.el-main {
  background: #5b7fa1;
}

.username {
  position: absolute;
  right: 30px;
  top: -8px;
  color: white;
  font-size: 22px;
}

.el-switch {
  position: absolute;
  left: 250px;
  top: 20px;
}

.collapse {
  width: 64px;
}

</style>
