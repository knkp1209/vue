<template>
	<div>
		<!--
		<template v-for="(node,index) in nodes" v-if="!node.hidden">
			<el-submenu v-if="!node.leaf">
				a
			</el-submenu>
			<el-menu-item v-else>
				b
			</el-menu-item>
		</template>
		-->
	<template v-for="(node,index) in nodes" v-if="!node.hidden">
      <el-submenu :index="index+''" v-if="!node.leaf">
        <template slot="title">
          <i :class="node.iconCls"></i>{{node.name}}
        </template>
        <menu-tree :nodes="node.children"></menu-tree>
      </el-submenu>
      <template  v-if="node.leaf">
      	<router-link :to="node.path">
	      <el-menu-item :index="node.path">
	        	<i :class="node.iconCls"></i>{{node.name}}
	      </el-menu-item>
	    </router-link>
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
