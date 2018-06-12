<template>
	<div>
		<!--
		<template v-for="(node,index) in nodes" v-if="!node.hidden">
      <el-submenu :index="index+''" v-if="!node.leaf">
        <template slot="title">
          <i :class="node.iconCls"></i>{{node.name}}</template>
        <menu-tree :nodes="node.children"></menu-tree>
      </el-submenu>
      <!-- 这里是用:route="{name:node.name}，如果不使用name跳转的话，可以在数据源那里把path写成全路径即可 -->
      <!--
      <el-menu-item v-if="node.leaf" :index="node.path" :route="{name:node.name}">
        <i :class="node.iconCls"></i>{{node.name}}</el-menu-item>
    </template>
  -->
    <template v-for="(node,index) in nodes">
    	<!--
    	<el-submenu v-if="!node.leaf">
    		<template slot="title">{{node.name}}</template>

    	</el-submenu>
    -->
    	<el-menu-item v-if="node.leaf">
				
    	</el-menu-item>
    </template>
	</div>
</template>
<script>

export default {
	name: 'MenuTree',
	props: {
    nodes: {
      required: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
