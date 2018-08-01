<template>
	<div>
		<el-tabs v-model="active_name" type="border-card">
			<el-tab-pane label="商品基本信息" name="first">
				<goods-base ref="ref_base" @emit_v_base="submit"></goods-base>
			</el-tab-pane>
			<el-tab-pane label="商品广告图" name="second">
				<el-form label-width="100px">
					<el-row type="flex" justify="left">
						<el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
							<el-form-item label="商品主图">
								<images key="img_url" name="img_url" :imageUrls="img_url" :multiple="false" :max_size="$store.state.maxSize" :max_upload="1"></images>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row type="flex" justify="left">
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="商品广告图">
								<images key="banner_img_urls"  name="banner_img_urls" :imageUrls="banner_img_urls" :multiple="true" :max_size="$store.state.maxSize" :max_upload="$store.state.maxUpload"></images>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="商品规格" name="third">
				<spec-table ref="ref_spec" @emit_v_spec="submit"></spec-table>
			</el-tab-pane>
			<el-tab-pane label="商品详情" name="fourth">
				<!-- <rich-text :rt="rt"></rich-text> -->
				<div>
					<!-- 组件有两个属性 value 传入内容双向绑定 setting传入配置信息 -->
					<editor class="editor" :value="detail" :setting="editorSetting" @input="getDetail"></editor>
				</div>
			</el-tab-pane>
		</el-tabs>
		<el-form label-width="100px" class="demo-ruleForm goods">
			<br />
			<el-form-item>
				<el-button type="primary" @click="check">添加</el-button>
				<el-button>重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import Images from '@/components/Images'
import SpecTable from '@/components/Goods/SpecTable'
import GoodsBase from '@/components/Goods/Base'
// import RichText from '@/components/RichText'
import editor from '@/components/editor'
export default {
	name: 'Goods_Editor',
	data() {
		return {
			img_url: [],
			banner_img_urls: [],
			untreated_data: {
				spec_table: false,
				base: false,
			},
			post_data: {},
			detail: '我是富文本编辑器的内容',
			//tinymce的配置信息 参考官方文档 https://www.tinymce.com/docs/configure/integration-and-setup/
			editorSetting: {
				height: 400,
			},
		}
	},
	computed: {
		active_name: {
			get: function() {
				return this.$store.state.activeGoodsTabs
			},
			set: function() {}
		}
	},
	components: { GoodsBase, Images, SpecTable, editor },
	created() {
		this.$store.commit('Mloading', true)
		let _this = this
		this.$ajax({　
				dataType: 'json',
				method: 'get',
				url: this.base_url + '/admin/goods',
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
		getDetail (val) {
			this.detail = val;
		},
		check() {
			if (this.untreated_data['spec_table'] === false) {
				//返回的是一个vue对象，所以可以直接调用其方法
				this.$refs.ref_spec.checkAll(); // 去调用子组件的方法
			}
			if (this.untreated_data['base'] === false) {
				this.$refs.ref_base.checkAll();
			}
		},
		submit(name, result) {
			this.untreated_data[name] = result;
			if (Object.values(this.untreated_data).indexOf(false) < 0) {
				this.reduction();
				this.post();
				// this.$router.push({ path: '/maina' });
				console.log('success')
			} else {
				console.log('fail')
			}
			// console.log(Object.values(this.my_validate).indexOf(true));
		},
		reduction() {
			// let temp = Object.assign({}, {}, this.untreated_data);
			// console.log(temp)
			this.post_data = {
				name: this.untreated_data['base']['name'],
				unit: this.untreated_data['base']['unit'],
				shelf: this.untreated_data['base']['is_shelf'],
				sort: this.untreated_data['base']['sort'],
				param: this.untreated_data['base']['parameters'],
				mark: this.untreated_data['base']['mark'],
				promise: this.untreated_data['base']['promise'],
				cat_id: this.untreated_data['base']['cat_id'],
				sub_cat_id: this.untreated_data['base']['sub_cat_id'],
				spec: this.untreated_data['spec_table'],
				detail: this.detail,
				url: (this.img_url[0] == undefined) ? '' : this.img_url[0],
				banner_img_urls: this.banner_img_urls
			}
			// console.log(this.post_data);
			// this.;post_data['']
			this.untreated_data['spec_table'] = false;
			this.untreated_data['base'] = false;
		},
		post() {
			this.$ajax({　
				dataType: 'json',
				method: 'post',
				url: this.base_url + '/admin/goods',
				data: this.post_data
			}).then(function(res) {
				let { msg, result } = res.data
			}).catch(function(err) {
				console.log(err)
				alert('页面异常，请手动刷新页面，按 F5 ')
			})
			console.log(this.post_data);
		}
	}
}

</script>
<style>
.goods {
	background: white;
	text-align: center;
}

.goods .el-form-item .el-form-item__content {
	margin-left: 0px !important;
	margin-bottom: 10px !important;
}

</style>
