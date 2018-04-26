<template>
  <div id="app">
    <div class="header">
      <p class="left">YangWenHang.org</p>
      <p class="right"><a href="#">找回密码</a></p>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App'
}

</script>
<style>
body {
  margin: 0;
}

* {
  font: 14px/1.5 "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
}

.header {
  background: #409EFF;
  height: 60px;
}

.right {
  float: right;
  padding-right: 10px;
  line-height: 30px;
  height: 30px;
  color: white;
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
