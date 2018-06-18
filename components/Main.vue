<template>
	<div>
		{{title}}
		<images :storeName="'abcImgids'" @imageIds="getImageIds"></images>
		<images :storeName="'bbcImaids'" @imageIds="getImageIds"></images>
		<template v-for="(item) in abcImgids">
			{{item}}
		</template>
		<br />
		<template v-for="(item) in bbcImaids">
			{{item}}
		</template>
		<spec></spec>
	</div>
</template>
<script>
import Images from '@/components/Images'
import Spec from '@/components/Spec'
export default {
	name: 'Main',
	data () {
		return {
			title:'',
			abcImgids:[],
			bbcImaids:[],
			cbcImaids:[],
		}
	},
	components: { Images,Spec },
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
		getImageIds(ids,storeName){
			this[storeName]= ids
		}
	}
}
</script>

<style scoped>
</style>
