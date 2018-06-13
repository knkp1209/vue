<template>
  <div id="app">
    <el-container>
    <el-header>
      <div class="header">
        <p class="left">YangWenHang.org</p>
      </div>
    </el-header>
    </el-container>  
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app',
  components: {
  }
}

</script>
<style>
body {
  margin: 0;
}

* {
  font: 14px/1.5 "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
}

.el-header{
  padding: 0px 0px;
}

.header {
  background: #409EFF;
  height: 60px;
}

.left {
  float: left;
  line-height: 5px;
  padding-left: 10px;
  font-size: 25px;
  color: white;
}

a:link {
  color: white;
  text-decoration: none;
}

a:hover {
  color: black;
  text-decoration: underline;
}

</style>
