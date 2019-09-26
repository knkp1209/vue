<template>
	<div>
		<el-row type="flex" :gutter="5" justify="center" v-if="parameters.length > 0">
			<el-col :span="10">
				参数名称：
			</el-col>
			<el-col :span="10">
				参数值：
			</el-col>
		</el-row>
		<el-row type="flex" :gutter="5" justify="right" v-for="(parameter, index) in parameters" :key="index">
			<el-col :span="10">
				<el-input v-model="parameter.name" :placeholder="tip_name"></el-input>
			</el-col>
			<el-col :span="10">
				<el-input v-model="parameter.value" :placeholder="tip_value"></el-input>
			</el-col>
			<el-col :span="2">
				<el-button type="primary" size="mini" @click.prevent="removePara(parameter)">删除</el-button>
			</el-col>
		</el-row>
		<el-form-item>
			<el-button type="primary" size="mini" @click="addPara">新增参数</el-button>
		</el-form-item>
	</div>
</template>
<script>
export default {
	name: 'DynamicInput',
	props: {
		parameters: { // 父组件的定义数据对象
			required: true
		},
		tip_name: {

		},
		tip_value:{

		}
	},
	methods: {
		removePara(item) {
			var index = this.parameters.indexOf(item)
			if (index !== -1) {
				this.parameters.splice(index, 1)
			}
		},
		addPara() {
			this.parameters.push({
				name: '',
				value: '',
			});
		}
	}
}

</script>
<style scope>
.el-row {
	margin-top: 10px;
}

</style>
