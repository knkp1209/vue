<template>
	<div id="Id_Home_Banner_Index">
		<el-tabs v-model="active_tab" type="border-card" @tab-click="toList">
			<el-tab-pane label="广告图列表" name="/Home/Banner/List">
			</el-tab-pane>
			<el-tab-pane :label="op_name" name="/Home/Banner/Add">
			</el-tab-pane>
		</el-tabs>
		<router-view />
	</div>
</template>
<script>
export default {
	name: 'Home_Banner_Index',
	data() {
		return {
			active_tab: '/Home/Banner/List',
			op_name: '添加',
		}
	},
	created() {
		this.$nextTick(() => {
			this.$router.push({ path:  '/Home/Banner/List'})
		})
	},
	methods: {
		toList(tab) {
			this.active_tab = tab.name
			this.$router.push({ path:  tab.name})
		}
	}
}

</script>
<style>
#Id_Home_Banner_Index .el-tabs--border-card {
	border: 0px !important;
}
#Id_Home_Banner_Index .el-tabs__content {
	display: none;
}

</style>
