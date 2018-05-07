<template>
	<div>
		<el-row type="flex" justify="center">
			<el-form ref="form" :model="form">
				<h1 class="login">欢迎！</h1>
				<el-input class="login" v-model="form.name" placeholder="账号"></el-input>
				<el-input class="login" v-model="form.password" type="password" placeholder="密码"></el-input>
				<el-button class="login" @click="abc" size="small" type="primary">登录</el-button>
				<input type="text" hidden="" />
				<el-input class="login" v-model="form.md5password" type="hidden"></el-input>
			</el-form>
		</el-row>
	</div>
</template>
<script>
import	sha1 from '../lib/sha1.js';
export default {
	name: 'Login',
	data() {
		return {
			form: {
				name: '',
				password: '',
				md5password: '',
			}
		}
	},
	methods: {
		abc: function() {
			this.$router.push({ name: 'Home'})
		}
	},
	watch: {
		form: {
			handler: (val, oldval) => {
				if (val.password != '') {
					val.md5password = sha1(val.password);
				} else {
					val.md5password = '';
				}
			},
			deep: true
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
	width: 260px;
	margin-bottom: 10px;
	display: block;
	font-size: 20px;
}

h1 {
	text-align: center;
}

.el-row {
	margin-top: 150px;
}
</style>
