<template>
	<div class="main">
		<el-form label-position="right" label-width="100px">
			<el-form-item label="角色名称">
				<el-select v-model="role_id" filterable placeholder="请选择" value-key="id">
					<el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="账号">
				<el-input v-model="account" name="account" v-validate="'required|max:200'"
									placeholder="请输入账号 (必填)" :disabled="disabled" ></el-input>
				<i class="my_err" v-show="errors.has('account')">{{errors.first('account')}}</i>
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="password" name="password" v-validate="'required|max:200'"
									autocomplete="new-password"
									placeholder="请输入密码 (必填)" :disabled="disabled" show-password></el-input>
				<i class="my_err" v-show="errors.has('password')">{{errors.first('password')}}</i>
			</el-form-item>
			<el-form-item label="应用名称">
				<el-input v-model="name" name="name" v-validate="'required|max:200'"
									placeholder="请输入应用名称 (必填)" :disabled="disabled"></el-input>
				<i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
			</el-form-item>
			<el-form-item label="数据库地址">
				<el-input v-model="db_host" name="db_host" v-validate="'required|max:200'"
									placeholder="请输入数据库地址 (必填)" :disabled="disabled"></el-input>
				<i class="my_err" v-show="errors.has('db_host')">{{errors.first('db_host')}}</i>
			</el-form-item>
			<el-form-item label="数据库名称">
				<el-input v-model="db_name" name="db_name" v-validate="'required|max:200'"
									placeholder="请输入数据库名称 (必填)" :disabled="disabled"></el-input>
				<i class="my_err" v-show="errors.has('db_name')">{{errors.first('db_name')}}</i>
			</el-form-item>
			<el-form-item label="数据库用户">
				<el-input v-model="db_user" name="db_user" v-validate="'required|max:200'"
									 autocomplete = "new-password"
									placeholder="请输入数据库用户 (必填)" :disabled="disabled"></el-input>
				<i class="my_err" v-show="errors.has('db_user')">{{errors.first('db_user')}}</i>
			</el-form-item>
			<el-form-item label="数据库密码">
				<el-input v-model="db_password" name="db_password" v-validate="'required|max:200'"
									autocomplete="new-password"
									placeholder="请输入数据库密码" show-password></el-input>
				<i class="my_err" v-show="errors.has('db_password')">{{errors.first('db_password')}}</i>
			</el-form-item>
			<el-form-item label="启用">
				<el-switch v-model="is_enable" active-text="是" inactive-text="否">
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
	import sha1 from '@/lib/sha1.js';

	export default {
		name: 'AccountEditor',
		data() {
			return {
				op_name: '保 存',
				add_loading: false,
				disabled: false,
				roles: [],

				role_id: null,
				account: '',
				password: '',
				name: '',
				db_host: '',
				db_name: '',
				db_user: '',
				db_password: '',
				is_enable: true,
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
				this.$http(this.$api.Account, 'edit', {id: this.id}).then(({data}) => {
					this.$assign(data)
					this.is_enable = this.$toBool(data,'is_enable')
					this.disabled = true
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			requestCreateData() {
				this.$http(this.$api.Account, 'create').then(({data}) => {
					this.roles = data
					this.role_id = this.roles[0].id;
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			post() {
				let data = {
					is_enable: this.is_enable,
					role_id: this.role_id,
				};
				if (this.id === undefined) {
					data['account'] = this.account;
					data['password'] = sha1(this.password);
					data['name'] = this.name;
					data['db_host'] = this.db_host;
					data['db_name'] = this.db_name;
					data['db_user'] = this.db_user;
					data['db_password'] = this.db_password;
				}
				this.$edit(this.$api.Account, data, 'Account')
			},
			cancel() {
				this.$activationNav('/Account/List')
			},
		}
	}

</script>
