<template>
	<div>
		<el-row type="flex" justify="center">
			<el-form ref="form" :model="form" :rules="rules">
				<h1 class="login">欢迎！</h1>
				<el-form-item prop="email">
					<el-input class="login" v-model="form.email" placeholder="账号"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input class="login" v-model="form.password" type="password" placeholder="密码"></el-input>
				</el-form-item>
				<div class="login box" id="captcha"></div>
				<el-input class="login" v-model="form.sha_password" type="hidden"></el-input>
				<el-form-item>
					<el-button class="login" @click="login('form')" size="small" type="primary" :loading="loading">登录</el-button>
				</el-form-item>
			</el-form>
		</el-row>
	</div>
</template>
<script>
	import sha1 from '@/lib/sha1.js';
	import MenuUtils from '@/lib/MenuUtils'
	import cookie from '@/lib/cookie'

	var handler = function (captchaObj) {
		captchaObj.appendTo("#captcha");
		captchaObj.onSuccess(function () {
			//验证成功执行
		});
		captchaObj.onReady(function () {
			//加载完毕执行
		});
	};

	var routers = []
	export default {
		name: 'Login',
		data() {
			return {
				loading: false,
				form: {
					email: '',
					password: '',
					sha_password: '',
				},
				rules: {
					email: [
						{required: true, message: '请输入账号', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入密码', trigger: 'blur'}
					],
				},
			}
		},
		created() {
			this.createCaptcha();
		},
		methods: {
			login(formName) {
				this.$refs[formName].validate((valid) => {
					let [gs, gv, gc] = [$("input[name='geetest_seccode']").val(), $("input[name='geetest_validate']").val(), $("input[name='geetest_challenge']").val()];
					if (valid && gs && gv && gc) {
						this.loading = true;

						let data = {
							geetest_seccode: gs,
							geetest_validate: gv,
							geetest_challenge: gc,
							email: this.form.email,
							sha_password: this.form.sha_password
						}

						this.$http(this.$api.Login, 'save', {data: data})
								.then(({data}) => {
									window.localStorage.setItem('user', data.user)
									window.localStorage.setItem('permission', JSON.stringify(data.permission))
									window.localStorage.setItem('role', data.role)
									cookie.set('login',1,'')
									MenuUtils(routers, data.permission)
									this.$router.addRoutes(routers)
									this.$router.push({path: '/home'});
								})
								.catch(msg => {
									this.$message.error(msg);
									this.loading = false;
									$("#captcha").empty();
									this.createCaptcha();
								})
					} else {
						if (!gs || !gv || !gc) {
							this.$message.error('请完成滑动验证！');
						}
						return false;
					}
				});
			},
			createCaptcha() {
				this.$http(this.$api.GeeTest, 'index', {data: {t: (new Date()).getTime()}}).then((data) => {
					initGeetest({
						gt: data.gt,
						challenge: data.challenge,
						product: "float",
						offline: !data.success
					}, handler);
				}).catch(msg => {
					this.$message.error(msg);
					setTimeout(() => {
						this.createCaptcha();
					},1000)
				})
			},
		},
		watch: {
			form: {
				handler: (val) => {
					if (val.password != '') {
						val.sha_password = sha1(val.password);
					} else {
						val.sha_password = '';
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
		display: block;
		font-size: 20px;
	}

	.box {
		overflow: hidden;
		border-radius: 2px;
		margin-bottom: 10px;
		/*box-sizing: border-box;*/
		border-right: 1px solid #ccc;
		-moz-transform: translate3d(0, 0, 0);
		-ms-transform: translate3d(0, 0, 0);
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);

	}

	.geetest_holder.geetest_wind {
		width: 260px !important;
	}

	h1 {
		text-align: center;
	}

	.el-row {
		margin-top: 150px;
	}

</style>
