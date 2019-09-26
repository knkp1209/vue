<template>
	<div class="main">
		<el-form label-position="right" label-width="100px">
			<el-form-item label="选择功能">
				<el-transfer
								filterable
								:filter-method="filterMethod"
								filter-placeholder="请输入"
								v-model="fn_ids"
								:titles="['所有功能', '选中的功能']"
								:button-texts="['删除功能', '添加功能']"
								:props="{
									key: 'id',
									label: 'auth_name'
								}"
								:data="fns">
				</el-transfer>
			</el-form-item>
			<el-form-item label="角色名称">
				<el-input v-model="name" name="name" v-validate="'required|max:200'"
									placeholder="功能名称也作vue组件名称 (必填)"></el-input>
				<i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
			</el-form-item>
		</el-form>
		<div class="footer" v-loading="add_loading">
			<el-button @click="cancel">取 消</el-button>
			<el-button @click="post" type="primary">{{op_name}}</el-button>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'RoleEditor',
		data() {
			return {
				op_name: '保 存',
				add_loading: false,
				fns: [],

				fn_ids: [],
				name: null,
			}
		},
		props: {
			id: {},
		},
		created() {
			if (this.id === undefined) {
				this.requestCreateData()
			} else {
				this.requestEditData()
			}
		},
		methods: {
			requestEditData() {
				this.$http(this.$api.Role, 'edit', {id: this.id}).then(({data}) => {
					this.fn_ids = this.$toInt(data, 'fn_ids');
					this.$assign(data)
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			requestCreateData() {
				this.$http(this.$api.Role, 'create').then(({data}) => {
					this.fns = data
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			post() {
				let data = {
					name: this.name,
					fn_ids: this.fn_ids,
				};
				this.$edit(this.$api.Role, data, 'Role')
			},
			cancel() {
				this.$activationNav('/Role/List')
			},
			filterMethod(query, item) {
				return item.auth_name.indexOf(query) > -1;
			}
		}
	}

</script>
