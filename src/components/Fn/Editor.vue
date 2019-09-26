<template>
	<div class="main">
		<el-form label-position="right" label-width="100px" class="form">
			<el-form-item label="父级">
				<el-select v-model="parent_id" filterable placeholder="请选择" value-key="id">
					<el-option v-for="item in parents" :key="item.id" :label="item.menu_name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="模块">
				<el-select v-model="type" filterable placeholder="请选择" value-key="id">
					<el-option v-for="item in type_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="权限名称">
				<el-input v-model="auth_name" name="auth_name" v-validate="'max:200'"
									placeholder="角色列表"></el-input>
				<i class="my_err" v-show="errors.has('auth_name')">{{errors.first('auth_name')}}</i>
			</el-form-item>
			<el-form-item label="权限路径">
				<el-input v-model="auth_path" name="auth_path" v-validate="'max:200'"
									placeholder="super/role/create,包含模块控制器方法的完整方法名"></el-input>
				<i class="my_err" v-show="errors.has('auth_path')">{{errors.first('auth_path')}}</i>
			</el-form-item>
			<el-form-item label="路由名称">
				<el-input v-model="name" name="name" v-validate="'max:200'"
									placeholder="RoleList,vue路由名称"></el-input>
				<i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
			</el-form-item>
			<el-form-item label="菜单栏名称">
				<el-input v-model="menu_name" name="menu_name" v-validate="'max:200'"
									placeholder="角色列表"></el-input>
				<i class="my_err" v-show="errors.has('menu_name')">{{errors.first('menu_name')}}</i>
			</el-form-item>
			<el-form-item label="路由地址">
				<el-input v-model="path" name="path" v-validate="'max:200'" placeholder="/Role/List,vue组件路由路径"></el-input>
				<i class="my_err" v-show="errors.has('path')">{{errors.first('path')}}</i>
			</el-form-item>
			<el-form-item label="重定向地址">
				<el-input v-model="redirect" name="redirect" v-validate="'max:200'"
									placeholder="/Role/List,vue组件重定向地址"></el-input>
				<i class="my_err" v-show="errors.has('redirect')">{{errors.first('redirect')}}</i>
			</el-form-item>
			<el-form-item label="功能描述">
				<el-input v-model="describe" name="describe" v-validate="'max:200'" placeholder="功能描述"></el-input>
				<i class="my_err" v-show="errors.has('describe')">{{errors.first('describe')}}</i>
			</el-form-item>
			<el-form-item label="文件">
				<el-input v-model="component" name="component" v-validate="'max:200'"
									placeholder="/Role/List,vue组件文件路径"></el-input>
				<i class="my_err" v-show="errors.has('component')">{{errors.first('component')}}</i>
			</el-form-item>
			<el-form-item label="图标">
				<el-input v-model="icon" name="icon" v-validate="'max:200'" placeholder="el-icon-message"></el-input>
				<i class="my_err" v-show="errors.has('icon')">{{errors.first('icon')}}</i>
			</el-form-item>
			<el-form-item label="介质">
				<el-switch v-model="props" active-text="开启" inactive-text="关闭">
				</el-switch>
			</el-form-item>
			<el-form-item label="节点">
				<el-radio-group v-model="leaf" size="small">
					<el-radio :label="0" border>树</el-radio>
					<el-radio :label="1" border>叶子</el-radio>
					<el-radio :label="2" border>特殊节点</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="菜单栏">
				<el-switch v-model="menu_status" active-text="开启" inactive-text="关闭">
				</el-switch>
			</el-form-item>
			<el-form-item label="路由">
				<el-switch v-model="router" active-text="开启" inactive-text="关闭">
				</el-switch>
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
		name: 'FnEditor',
		data() {
			return {
				op_name: '保 存',
				add_loading: false,
				parents: [],
				type_list: [
					{
						id: 0,
						name: '管理后台'
					},
					{
						id: 1,
						name: '前端功能'
					}
				],

				type: 0,
				parent_id: 0,
				name: null,
				path: '',
				component: '',
				icon: '',
				props: '',
				redirect: '',
				router: true,
				menu_name: '',
				menu_status: true,
				leaf: 0,
				auth_path: '',
				auth_name: '',
				describe: '',
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
				this.$http(this.$api.Fn, 'edit', {id: this.id}).then(({data}) => {
					this.parent_id = data.pid
					this.$assign(data)
					this.router = this.$toBool(data, 'router')
					this.menu_status = this.$toBool(data, 'menu_status')
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			requestCreateData() {
				this.$http(this.$api.Fn, 'create').then(({data}) => {
					this.parents = data
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			post() {
				let data = {
					type: this.type,
					pid: this.parent_id,
					name: this.name,
					path: this.path,
					component: this.component,
					icon: this.icon,
					props: this.props,
					redirect: this.redirect,
					router: this.router,
					menu_name: this.menu_name,
					menu_status: this.menu_status,
					leaf: this.leaf,
					auth_path: this.auth_path,
					auth_name: this.auth_name,
					describe: this.describe,
				};
				this.$edit(this.$api.Fn, data, 'Fn')
			},
			cancel() {
				this.$activationNav('/Fn/List')
			},
		}
	}

</script>
<style>
	.form {
		width: 420px;
	}
</style>
