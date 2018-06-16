<template>
	<div>
		{{title}}
		<images @imageIds="(i) => getImageIds(i,'imgids')"></images>
		<images ></images>
		<template v-for="(item) in imgids">
			{{item}}
		</template>
		<template v-for="(item) in imgaids">
			{{item}}
		</template>
	</div>
</template>
<script>
import Images from '@/components/Images'
export default {
	name: 'Main',
	data () {
		return {
			title:'',
			imgids:'',
			imgaids:'',
		}
	},
	components: { Images },
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
	},
	methods:{
		getImageIds(ids,a){
			this.imgids = ids
		}
	}
}
</script>

<style scoped>
</style>
