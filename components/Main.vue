<template>
	<div>
		<el-form @submit.native.prevent="check" label-width="100px" class="demo-ruleForm">
			<el-form-item label="年龄">
				<el-input type="age" v-validate="'required'" name="email" @input="c('email')" v-model="email" auto-complete="off"></el-input>
				<el-input type="age" v-validate="'required'" name="email1" @input="c('email')" v-model="email1" auto-complete="off"></el-input>
				<!-- <span>{{ errors.first('email') }}</span> -->
			</el-form-item>
			{{name}}
			<images :storeName="'abcImgids'" @imageIds="getImageIds"></images>
			<images :storeName="'bbcImaids'" @imageIds="getImageIds"></images>
			<template v-for="(item) in abcImgids">
				{{item}}
			</template>
			<br />
			<template v-for="(item) in bbcImaids">
				{{item}}
			</template>
			<spec-table></spec-table>
			<el-form-item>
				<el-button type="primary" native-type="submit">提交</el-button>
				<el-button>重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import Images from '@/components/Images'
import SpecTable from '@/components/SpecTable'
export default {
	name: 'Main',
	data() {
		return {
			name: '',
			abcImgids: [],
			bbcImaids: [],
			cbcImaids: [],
			spec: {},
			email: '',
			email1: '',
		}
	},
	components: { Images, SpecTable },
	created() {
		this.$store.commit('Mloading', true)
		let _this = this
		this.$ajax({　
				dataType: 'json',
				method: 'get',
				url: this.base_url + '/index/index/title',
			})
			.then(function(res) {
				let { msg, result } = res.data
				_this.name = result
				_this.$store.commit('Mloading', false)
			})
			.catch(function(err) {
				console.log(err)
				_this.$store.commit('Mloading', false)
				alert('页面异常，请手动刷新页面，按 F5 ')
			})
	},
	methods: {
		getImageIds(ids, storeName) {
			this[storeName] = ids
		},
		c(a) {
			console.log(a)
			console.log(this.$validator.validateScopes);
			this.$validator.validate('email','a').then(result => {
				if (!result) {
					console.log('not valid');
					// do stuff if not valid.
				} else {
					console.log('pass valid')
				}
			});
		},
		check() {
			this.$validator.validateAll().then((result) => {
				console.log(result);
				if (result) {
					// eslint-disable-next-line
					alert('From Submitted!');
					return;
				}
				alert('Correct them errors!');
			});
			console.log(this.errors);
			// console.log(this.submitForm('numberValidateForm'));
			if (false) {
				alert('已提交');
			} else {
				alert('不提交');
			}
		}
	}
}

</script>
<style scoped>


</style>
