<template>
	<div>
		<template v-for="(province,i) in provinces">
			<template v-for="(item,key) in province">
				<p v-if="key == 'province'">
					{{item}}
				</p>
				<el-checkbox-group v-model="checkList[i]" v-else>
					<el-checkbox v-for="(city,index) in item" :label="city['name']" :key=index
					:checked="city['checked']">
					</el-checkbox>
				</el-checkbox-group>
			</template>
		</template>
	</div>
</template>
<script>

export default {
	name: 'Maina',
	data () {
		return {
			provinces:'',
			checkList: {},
		}
	},
	created () {
		this.$store.commit('Mloading',true)
		let _this = this
	    this.$ajax({
		  　dataType: 'json',
	      	method: 'get',
	      	url: '/api/index/index/area',
		})
		.then(function(res){
			let {msg,result} = res.data
			_this.provinces = result
			_this.creatCheckboxGroup()
			_this.$store.commit('Mloading',false)
		})
		.catch(function(err){
			console.log(err)
			_this.$store.commit('Mloading',false)
			alert('页面异常，请手动刷新页面，按 F5 ')
		})
	},
	methods: {
		creatCheckboxGroup () {
			let temp = {}
			Object.keys(this.provinces).forEach((item)=> {
				temp[item] = []
			})
			this.checkList = Object.assign({}, this.checkList, temp)
		}
	}
}
</script>

<style scoped>
	div {
		background: #FFE7BA;
	}
</style>
