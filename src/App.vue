<template>
	<div id="app">
		<router-view/>
	</div>
</template>
<script>
	export default {
		name: 'app',
		components: {}
	}

</script>
<style>
	body {
		margin: 0;
	}

	* {
		font: 14px/1.5 "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
	}

	/*
	.el-button--mini {
		padding: 5px 10px;
	}
	*/

	a:link {
		color: white;
		text-decoration: none;
	}

	a:hover {
		color: black;
		text-decoration: underline;
	}

	.my_err {
		color: red;
		font-size: 14px;
	}

	.my_tip {
		color: #38B0DE;
		font-size: 14px;
	}

	.main {
		background: #FFFFFF;
		padding: 20px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.main .el-form {
		margin: 0 auto;
	}

	.main .footer {
		display: flex;
		justify-content: center;
		margin-top: 15px;
	}

	.el-icon-success {
		color: dodgerblue;
	}

	.el-icon-error {
		color: #F56C6C;
	}

	.pagination > .el-pagination {
		float: right;
	}

	.tableBefore{
		margin-bottom: 20px;
	}
</style>
<style lang="less">
	/*
	.el-form {
		.el-radio-group {
			width: 400px;
			margin-left: -70px;
			.el-radio {
				margin-right: unset;
			}
		}
	}
	*/
</style>
