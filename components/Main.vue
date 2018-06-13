<template>
	<div>
		{{title}}
	</div>
</template>
<script>

export default {
	name: 'Main',
	data () {
		return {
			title:'',
		}
	},
	created () {
		this.$store.commit('Mloading',true)
		let _this = this
	    this.$ajax({
		  　dataType: 'json',
	      	method: 'get',
	      	url: '/api/index/index/title',
		})
		.then(function(res){
			let {msg,result} = res.data
			_this.title = result
			_this.$store.commit('Mloading',false)
		})
		.catch(function(err){
			console.log(err)
			_this.$store.commit('Mloading',false)
			alert('页面异常，请手动刷新页面，按 F5 ')
		})
	}
}
</script>

<style scoped>
	div {
		background: #FFE7BA;
	}
</style>
