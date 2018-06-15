<template>
	<div>
	  <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button>
	  <el-dialog width="700px" title="收货地址" :visible.sync="dialogTableVisible">
		  <template v-for="(province,i) in provinces">
			  <p style="display: inline-block; width: 150px; padding: 20px 2px;" @mouseenter="open(i,before)">
		      <el-checkbox :indeterminate="isIndeterminate[i]" v-model="checkAll[i]" @change="(val) => handleCheckAllChange(val,i)">{{province['province']}}</el-checkbox>
		    </p>
		    <el-checkbox-group size="mini"  v-model="checkList[i]" v-show="show[i]" @change="(value) => handleCheckedCitiesChange(value,i)">
		      <el-checkbox-button v-for="(city,index) in province['city']" :label="city['name']" :key=index :checked="city['checked']">
			  </el-checkbox-button>
		    </el-checkbox-group>
			</template>
	  </el-dialog>
	</div>
</template>
<script>

export default {
	name: 'Maina',
	data () {
		return {
			provinces:'',
			checkList: {},
			show:{},
			before:false,
			isIndeterminate: {},
			checkAll: {},
			allcity: {},
			dialogTableVisible: false,
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
		/**
		*	创建整理数据
		*/
		creatCheckboxGroup () {
			let temp = {}
			let showtemp = {}
			let isIndeterminatetemp = {}
			let allcitytemp = {}
			Object.keys(this.provinces).forEach((item)=> {
				temp[item] = []
				showtemp[item] = false
				if (this.provinces[item]['city']) {
					allcitytemp[item] = []
					let count = 0;
					let cities = Object.keys(this.provinces[item]['city']);
				    cities.forEach((index)=> {
						allcitytemp[item].push(this.provinces[item]['city'][index]['name'])
						if(this.provinces[item]['city'][index]['checked'] == true) {
							count++;
						}
					})
					this.checkAll[item] = count === cities.length;
					this.isIndeterminate[item] = count > 0 && count < cities.length
				}
			})
			this.checkList = Object.assign({}, this.checkList, temp)
			this.checkAll = Object.assign({}, this.checkAll, this.checkAll)
			this.show = Object.assign({}, this.show, showtemp)
			this.isIndeterminate = Object.assign({}, this.isIndeterminate, isIndeterminatetemp)
			this.allcity = Object.assign({}, this.allcity, allcitytemp)
		},
		/*
		*	鼠标移入显示当前的，隐藏之前的
		*/
	    open (i,before) {
	    	if (before){
	      	this.show[before] = false
	      }
	      this.before = i;
	    	this.show[i] = !this.show[i] 
	    },
	    /*
	    *	全选
	    */
	    handleCheckAllChange(val,i) {
	      this.checkList[i] = val ? this.allcity[i] : [];
	      this.isIndeterminate[i] = false;
	    },
	    /*
	    *	选中某个时，检测所属组的状态 (组状态：全选，全不选，部分)
	    */
	    handleCheckedCitiesChange(value,i) {
	      let checkedCount = value.length;
	      this.checkAll[i] = checkedCount === this.allcity[i].length;
	      this.isIndeterminate[i] = checkedCount > 0 && checkedCount < this.allcity[i].length
	    }
	}
}
</script>

<style scoped>
</style>
