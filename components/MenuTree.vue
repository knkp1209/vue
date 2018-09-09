<template>
	<div>
		<template v-for="(node,index) in nodes" v-if="!node.hidden">
		  <!-- 无跳转 -->
	      <el-submenu :index="node.path" v-if="node.leaf  == 0">
	        <template slot="title">
	          <i :class="node.iconCls"></i>{{node.name}}
	        </template>
	        <menu-tree :nodes="node.children"></menu-tree>
	      </el-submenu>
	      <!-- 叶子跳转 -->
	      <template  v-else-if="node.leaf == 1">
		      <el-menu-item :index="node.path">
		        	<i :class="node.iconCls"></i>{{node.name}}
		      </el-menu-item>
	      </template>
	      <!-- 树跳转 -->
	      <template  v-else-if="node.leaf == 2">
		      <el-menu-item :index="node.path">
		        	<i :class="node.iconCls"></i>{{node.name}}
		      </el-menu-item>
	      </template>
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
