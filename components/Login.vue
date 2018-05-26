<template>
	<div>
		<el-row type="flex" justify="center">
			<el-form ref="form" :model="form" :rules="rules" >
				<h1 class="login">欢迎！</h1>
				<el-form-item prop="email">
					<el-input class="login" v-model="form.email" placeholder="账号"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input class="login" v-model="form.password" type="password" placeholder="密码"></el-input>
				</el-form-item>
				<div class="login box" id="captcha" ></div>
				<el-input class="login" v-model="form.sha_password" type="hidden"></el-input>
				<el-form-item>
					<el-button class="login" @click="login('form')" size="small" type="primary">登录</el-button>
				</el-form-item>
			</el-form>
		</el-row>
	</div>
</template>
<script>
import	sha1 from '../lib/sha1.js';
import	gt from '../lib/gt.js';
import	jq from '../lib/jquery-1.12.3.min.js';
import	call_gt from '../lib/call_gt.js';
export default {
	name: 'Login',
	data() {
		return {
			form: {
				email: '',
				password: '',
				sha_password: '',
			},
			rules: {
				email:[
					{ required: true, message: '请输入账号', trigger: 'blur' }
				],
				password:[
					{ required: true, message: '请输入密码', trigger: 'blur' }
				],
			}
		}
	},
	methods: {
		abc: function() {
			this.$router.push({ name: 'Home'})
		},
		login(formName) {
			this.$refs[formName].validate((valid) => {
				let [gs,gv,gc] = [$("input[name='geetest_seccode']").val(), $("input[name='geetest_validate']").val(), $("input[name='geetest_challenge']").val()];
	          	if (valid && gs && gv && gc) {
	          		this.$ajax({
				      	data:{
					      	geetest_seccode:gs,
					      	geetest_validate:gv,
					      	geetest_challenge:gc,
						    email:this.form.email,
						    sha_password:this.form.sha_password
					  	},
				      	method: 'post',
				      	url: 'http://localhost/shop/index.php'
					})
	            	alert('submit!');
	          	} else {
	          		if (!gs || !gv || !gc) {
	          			alert('请完成滑动验证！');
	          		}
	          		console.log('Not pass valid');
	            	return false;
	          	}
	        });
		}
	},
	watch: {
		form: {
			handler: (val, oldval) => {
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
	overflow:hidden;
	border-radius: 2px;
	margin-bottom: 10px;
	/*box-sizing: border-box;*/
	border-right :1px solid #ccc;
	-moz-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);

}

.geetest_holder.geetest_wind{
	width:260px !important;
}
h1 {
	text-align: center;
}

.el-row {
	margin-top: 150px;
}
</style>
