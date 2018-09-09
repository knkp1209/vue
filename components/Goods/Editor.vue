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
								<my-image v-if="$store.state.appSet" key="img_url" @emit_set_img="setImgUrl" name="img_url" :imageUrl="img_url" :max_size="max_size" :max_upload="1"></my-image>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row type="flex" justify="left">
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="商品广告图">
								<images v-if="$store.state.appSet" key="banner_img_urls" name="banner_img_urls" :imageUrls="banner_img_urls" :multiple="true" :max_size="max_size" :max_upload="max_upload"></images>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="商品规格" name="third">
				<spec-table ref="ref_spec" :specs="specs" :products="products"></spec-table>
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
			base: {
				name: '', // 商品名称
				sort: '', // 商品排序
				unit: '', // 商品单位
				is_shelf: true, // 是否上架
				promise: [],
				mark: [],
				parameters: [],
				cat_id: [],
				sub_cat_id: [],
				pid_cat_id: [],
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
			return this.$store.state.appSet.maxSize.value
		},
		max_upload() {
			return this.$store.state.appSet.maxUpload.value
		}
	},
	components: { GoodsBase, MyImage, Images, SpecTable, editor },
	created() {
		this.getAppSet();
	},
	watch: {
		// 如果路由有变化，会再次执行该方法
		'$route': 'getAppSet'
	},
	methods: {
		fetchData() {
			if (this.id === undefined) {
				console.log('添加');
				this.button_name = '添加';
				this.$store.commit('Mloading', false)
				return false;
			}
			this.button_name = '更新';
			let _this = this
			this.$ajax({　
				dataType: 'json',
				method: 'get',
				url: `${this.base_url}/admin/goods/${this.id}`,
			}).then(function(res) {
				let { msg, result } = res.data
				_this.assignment(result);
				_this.$store.commit('Mloading', false)
			}).catch(function(err) {
				console.log(err)
				_this.$store.commit('Mloading', false)
				_this.$message.error('没有更多了')
				_this.$router.push({ path: `/Goods/List` })
				// alert('页面异常，请手动刷新页面，按 F5 ')
			})
		},
		getAppSet() {
			this.$store.commit('Mloading', true)
			if (this.$store.state.appSet == false) {
				this.$ajax({
					dataType: 'json',
					method: 'get',
					url: this.base_url + '/admin/app',
				}).then((res) => {
					this.$store.commit('MappSet', this.$appSet(res.data.result));
					this.fetchData();
				}).catch((err) => {
					console.log(err);
					this.$message.error('系统出错')
				})
			} else {
				this.fetchData();
			}
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
				mark: this.base.mark,
				promise: this.base.promise,
				cat_id: this.base.cat_id,
				sub_cat_id: this.base.sub_cat_id,
				specs: this.$refs.ref_spec.spec_data,
				products: this.$refs.ref_spec.post_data,
				detail: this.detail,
				url: this.img_url,
				banner_img_urls: this.banner_img_urls
			}
			return Promise.resolve(post_data);
		},
		post(data) {
			this.button_post = true;
			var method = 'post';
			var url = this.base_url + '/admin/goods';
			if (this.id !== undefined) {
				method = 'put';
				url += '/' + this.id;
			}
			this.$ajax({　
				dataType: 'json',
				method: method,
				url: url,
				data: data
			}).then((res) => {
				let { msg, result } = res.data
				this.$message.success('操作成功')
				this.button_post = false;
			}).catch((err) => {
				console.log(err)
				this.$message.error('操作失败，请重新操作')
				this.button_post = false;
			})
		},
		assignment(result) {
			this.base.name = result.name;
			this.base.sort = result.sort;
			this.base.unit = result.unit;
			this.base.is_shelf = result.shelf;
			this.base.promise = result.promise
			this.base.mark = result.mark;
			this.base.parameters = result.param;
			this.base.cat_id = result.cat_id;
			this.base.sub_cat_id = result.sub_cat_id;
			this.base.pid_cat_id = result.pid_cat_id; // 用于帮助渲染
			this.detail = result.detail;
			this.img_url = result.url;
			this.banner_img_urls = result.banners;
			this.specs = result.specs;
			this.products = result.products;
		},
		toNext() {
			this.$router.push({ path: `/Goods/Editor/${parseInt(this.id) + 1}` })
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
