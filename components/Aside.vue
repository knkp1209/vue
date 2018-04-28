<template>
	<div>
		<p>a</p>
	</div>
</template>
<script>

export default {
	name: 'Aside',
	data() {
		return {
			form: {
				name: '',
				password: '',
				md5password: '',
			}
		}
	},
	watch: {
		form: {
			handler: (val, oldval) => {
				console.log(val.password);
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
