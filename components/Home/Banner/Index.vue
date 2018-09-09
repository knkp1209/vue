<template>
	<div class="Id_Home_Banner_Index">
		<el-tabs v-model="active_name" type="border-card" @tab-click="toList">
			<el-tab-pane label="广告图列表" name="/Home/Banner/List">
			</el-tab-pane>
			<el-tab-pane :label="op.name" :name="'/Home/Banner/' + op.url">
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
			op:{
				name: '添加',
				url: 'Add'
			}
		}
	},
	computed: {
		active_name: {
			get: function() {
				return this.$store.state.activeHomeBannerTabs
			},
			set: function() {}
		}
	},
	methods: {
		toList(tab) {
			this.$router.push({ path:  tab.name})
		}
	}
}

</script>
<style>
.Id_Home_Banner_Index .el-tabs--border-card {
	border: 0px !important;
}
.Id_Home_Banner_Index .el-tabs__content {
	display: none;
}

</style>
