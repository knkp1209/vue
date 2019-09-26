<template>
	<div v-if="!$store.state.loading">
		<el-tabs v-model="active_name" type="border-card">
			<el-tab-pane label="商品基本信息" name="first">
				<goods-base :base="base" ref="ref_base"></goods-base>
			</el-tab-pane>
			<el-tab-pane label="商品广告图" name="second">
				<el-form label-width="100px">
					<el-row type="flex" justify="left">
						<el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
							<el-form-item label="商品主图">
								<my-image v-if="$store.state.config" :key="'my-image' + key" @emit_set_img="setImgUrl" name="img_url" :imageUrl="img_url" :max_size="max_size" :max_upload="1"></my-image>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row type="flex" justify="left">
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="商品广告图">
								<images :key="'images' + key" v-if="$store.state.config" name="banner_img_urls" :imageUrls="banner_img_urls" :multiple="true" :max_size="max_size" :max_upload="max_upload"></images>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="商品规格" name="third">
				<spec-table :key="'my-image' + key" ref="ref_spec" :specs="specs" :products="products"></spec-table>
			</el-tab-pane>
			<el-tab-pane label="商品详情" name="fourth">
				<!-- <rich-text :rt="rt"></rich-text> -->
				<!-- <div> -->
					<!-- 组件有两个属性 value 传入内容双向绑定 setting传入配置信息 -->
					<editor class="editor" :value="detail" :setting="editorSetting" @input="getDetail"></editor>
				<!-- </div> -->
			</el-tab-pane>
		</el-tabs>
		<el-form label-width="100px" class="demo-ruleForm goods">
			<el-form-item v-loading="button_post">
				<el-button type="primary" @click="submit">{{button_name}}</el-button>
				<el-button v-if="id" @click="toNext">查看下一个</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import MyImage from '@/components/MyImage'
import Images from '@/components/Images'
import SpecTable from '@/components/Goods/SpecTable'
import GoodsBase from '@/components/Goods/Base'
// import RichText from '@/components/RichText'
import editor from '@/components/editor'
export default {
	name: 'Goods_Editor',
	data() {
		return {
			key: new Date().getMilliseconds(),
			base: {
				name: '', // 商品名称
				sort: '', // 商品排序
				unit: '', // 商品单位
				is_shelf: true, // 是否上架
				promise: [],
				label: [],
				parameters: [],
				cat_id: [],
				sub_cat_id: [],
				pid_cat_id: [],
				freight_id: 0,
			},
			img_url: '',
			banner_img_urls: [],
			detail: '',
			specs: {},
			products: [],
			// button 名字 （更新、添加)
			button_name: '添加',
			button_post: false,
			//tinymce的配置信息 参考官方文档 https://www.tinymce.com/docs/configure/integration-and-setup/
			editorSetting: {
				height: 400,
			},
		}
	},
	props: {
		id: {},
	},
	computed: {
		active_name: {
			get: function() {
				return this.$store.state.activeGoodsTabs
			},
			set: function() {}
		},
		max_size() {
			return this.$store.state.config.maxSize.value
		},
		max_upload() {
			return this.$store.state.config.maxUpload.value
		}
	},
	components: { GoodsBase, MyImage, Images, SpecTable, editor },
	created() {
		this.fetchData();
	},
	watch: {
		// 如果路由有变化，会再次执行该方法
		'$route': 'fetchData'
	},
	methods: {
		fetchData() {
			this.$store.commit('Mloading', true)
			if (this.id === undefined) {
				this.init()
				;
				this.button_name = '添加';
				this.$store.commit('Mloading', false)
				return false;
			}
			this.button_name = '更新';
			this.$http(this.$api.Goods,'read',{id:this.id}).then(res =>{
				let { msg, result } = res.data
				this.assignment(result);
				this.$store.commit('Mloading', false)
			}).catch(msg => {
				this.$store.commit('Mloading', false)
				this.$message.error(msg)
				this.$router.push({ path: `/Goods/List` })
				// alert('页面异常，请手动刷新页面，按 F5 ')
			})
		},
		getDetail(val) {
			this.detail = val;
		},
		setImgUrl(val) {
			this.img_url = val;
		},
		submit() {
			this.$refs.ref_base.$validator.validateAll().then(result => {
				if (!result) {
					this.$message.error('基本信息有误')
					this.$store.commit('MactiveGoodsTabs', 'first')
				} else {
					this.$refs.ref_spec.$validator.validateAll().then(result => {
						if (!result) {
							this.$refs.ref_spec.errors.items.forEach((item, index) => {
								$("input[name='" + item['field'] + "']").addClass('input_error')
							})
							this.$message.error('规格有误')
							this.$store.commit('MactiveGoodsTabs', 'third')
						} else {
							if (this.$refs.ref_spec.table_data.length <= 0) {
								this.$message.error('规格不能为空')
								return false;
							}
							this.reduction().then((data) => {
								this.post(data);
							});
						}
					});
				}
			});
		},
		reduction() {
			let post_data = {
				name: this.base.name,
				unit: this.base.unit,
				shelf: this.base.is_shelf,
				sort: this.base.sort,
				param: this.base.parameters,
				label: this.base.label,
				promise: this.base.promise,
				cat_id: this.base.cat_id,
				sub_cat_id: this.base.sub_cat_id,
				freight_id: this.base.freight_id,
				specs: this.$refs.ref_spec.spec_data,
				products: this.$refs.ref_spec.post_data.filter(word => word != null),
				detail: this.detail,
				url: this.img_url,
				banner_img_urls: this.banner_img_urls
			}
			return Promise.resolve(post_data);
		},
		post(data) {
			this.button_post = true;
			let params = {}
			let type = 'save'
			if (this.id !== undefined) {
				type = 'update'
				params.id = this.id;
			}
			params.data = data
			this.$http(this.$api.Goods,type,params).then( res => {
				let { msg, result } = res.data
				this.button_post = false;
				var _this = this
				this.$message({
		          message: msg,
		          type: 'success',
		          duration: 1000,
		          onClose(){
		          	_this.$router.push({ path: `/Goods/List` })
		          }
		        })
			}).catch( msg => {
				this.$message.error(msg)
				this.button_post = false;
			})
		},
		assignment(result) {
			this.base.name = result.name;
			this.base.sort = result.sort;
			this.base.unit = result.unit;
			this.base.is_shelf = result.shelf;
			this.base.promise = result.promise
			this.base.label = result.label;
			this.base.parameters = result.param;
			this.base.cat_id = result.cat_id;
			this.base.sub_cat_id = result.sub_cat_id;
			this.base.pid_cat_id = result.pid_cat_id; // 用于帮助渲染
			this.base.freight_id = result.freight_id;
			this.detail = result.detail;
			this.img_url = result.url;
			this.banner_img_urls = result.banners;
			this.specs = result.specs;
			this.products = result.products;
		},
		toNext() {
			this.$router.push({ path: `/Goods/Editor/${parseInt(this.id) + 1}` })
		},
		init() {
			this.key = new Date().getMilliseconds(),
			this.base = {
				name: '', // 商品名称
				sort: '', // 商品排序
				unit: '', // 商品单位
				is_shelf: true, // 是否上架
				promise: [],
				label: [],
				parameters: [],
				cat_id: [],
				sub_cat_id: [],
				pid_cat_id: [],
				freight_id: 0,
			},
			this.img_url = ''
			this.banner_img_urls = []
			this.detail = ''
			this.specs = {}
			this.products = []
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
	margin: 10px 0px 10px 0px !important;
}

</style>
