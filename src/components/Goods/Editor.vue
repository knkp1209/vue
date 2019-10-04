<template>
	<div>
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane label="商品基本信息" name="base">
				<goods-base v-if="loading" :base="base" ref="ref_base"></goods-base>
			</el-tab-pane>
			<el-tab-pane label="商品广告图" name="images">
				<el-form label-width="100px">
					<el-row type="flex" justify="left">
						<el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
							<el-form-item label="商品主图">
								<my-image v-if="loading" @emit_set_img="setImgUrl" name="img_url"
													:imageUrl="img_url" :max_size="$store.state.config.maxSize.value" :max_upload="1"></my-image>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row type="flex" justify="left">
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
							<el-form-item label="商品广告图">
								<images v-if="loading" name="banner_img_urls"
												:imageUrls="banner_img_urls" :multiple="true" :max_size="$store.state.config.maxSize.value"
												:max_upload="$store.state.config.maxUpload.value"></images>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="商品规格" name="specs">
				<spec-table v-if="loading" ref="ref_spec" :specs="specs" :products="products"></spec-table>
			</el-tab-pane>
			<el-tab-pane label="商品详情" name="details">
				<!-- <rich-text :rt="rt"></rich-text> -->
				<!-- <div> -->
				<!-- 组件有两个属性 value 传入内容双向绑定 setting传入配置信息 -->
				<editor class="editor" :value="detail" :setting="editorSetting" @input="getDetail"></editor>
				<!-- </div> -->
			</el-tab-pane>
		</el-tabs>
		<el-form label-width="100px" class="demo-ruleForm goods">
			<el-form-item v-loading="add_loading">
				<el-button type="primary" @click="submit">{{op_name}}</el-button>
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
		name: 'GoodsEditor',
		data() {
			return {
				loading: false,
				op_name: '保 存',
				add_loading: false,
				activeName: 'base',
				//tinymce的配置信息 参考官方文档 https://www.tinymce.com/docs/configure/integration-and-setup/
				editorSetting: {
					height: 400,
				},

				base: {
					categories: [], // 所有分类
					categoriesSelected: [], // 选中的分类

					name: '', // 商品名称
					sort: '', // 商品排序
					unit: '', // 商品单位
					is_shelf: true, // 是否上架
				},
				img_url: '',
				banner_img_urls: [],
				detail: '',
				specs: {},
				products: [],
			}
		},
		props: {
			id: {},
		},
		components: {GoodsBase, MyImage, Images, SpecTable, editor},
		created() {
			if (this.id === undefined) {
				this.requestCreateData()
			} else {
				this.requestEditData()
			}
		},
		methods: {
			getDetail(val) {
				this.detail = val;
			},
			setImgUrl(val) {
				this.img_url = val;
			},
			submit() {
				this.$refs.ref_base.$validator.validateAll().then(result => {
					if (!result) {
						this.activeName = 'base';
						this.$message.error('基本信息有误')
					} else {
						this.$refs.ref_spec.$validator.validateAll().then(result => {
							if (!result) {
								this.$refs.ref_spec.errors.items.forEach((item, index) => {
									$("input[name='" + item['field'] + "']").addClass('input_error')
								})
								this.activeName = 'specs';
								this.$message.error('规格有误')
							} else {
								if (this.$refs.ref_spec.table_data.length <= 0) {
									this.activeName = 'specs';
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
					specs: this.$refs.ref_spec.spec_data,
					categories: this.base.categoriesSelected,
					products: this.$refs.ref_spec.post_data.filter(word => word != null),
					detail: this.detail,
					url: this.img_url,
					banner_img_urls: this.banner_img_urls
				}
				return Promise.resolve(post_data);
			},
			post(data) {
				this.$edit(this.$api.Goods, data, 'Goods')
			},
			assignment(result) {
				// 商品基本信息
				let base = ['name','sort','unit'];
				this.$bindVars(base,result.goods,'base');
				// 上架状态
				this.$set(this.base,'is_shelf',this.$toBool(result.goods,'shelf'));
				// 分类列表
				this.$set(this.base, 'categories', result.categories)
				// 已选分类值
				this.$set(this.base, 'categoriesSelected', this.tidyCategories(result.goods.categories));

				// 商品其他信息
				let goods = ['detail','specs','products',
					['img_url','url'],
					['banner_img_urls','banners']
				];
				this.$bindVars(goods,result.goods);
			},
			requestEditData() {
				this.$http(this.$api.Goods, 'edit', {id: this.id}).then(({data}) => {
					this.assignment(data)
					this.loading = true;
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			requestCreateData() {
				this.$http(this.$api.Goods, 'create').then(({data}) => {
					this.$set(this.base, 'categories', data.categories)
					this.loading = true;
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			/**
			 * 递归找回所有的子级
			 * @return {Array}
			 */
			recursiveSearch(data, pid) {
				let id = [];
				let children = [];
				for (let i in data) {
					let temp = data[i];
					if (temp.pid == pid) {
						id = [temp.id];
						children = this.recursiveSearch(data,temp.id);
						if (children.length > 0) {
							id = id.concat(children);
						}
						return id;
					}
				}
				return id;
			},
			/**
			 * 整理选中的分类
			 * @returns {Array}
			 */
			tidyCategories(arr) {
				let big = [];
				var deleteArr = new Set();
				for (let i = 0; i < arr.length; i++) {
					let items = this.recursiveSearch(arr,0);
					big.push(items);
					for (let di = 0; di < items.length - 1; di++) { // 留最后一个
						deleteArr.add(items[di]); // 如果 big 的元素的最后一个元素在这里说明有更深一级，那么该元素应该被清理
					}
					let itemLast = items[items.length - 1];

					for (let j in arr) {
						let temp = arr[j];
						if (temp.id == itemLast) {
							arr.splice(j,1)
							i = -1; // 重置数组从头开始循环，注意这里等于 -1，因为 for 循环最后执行的是 i++
						}
					}
				}

				// 清理 big
				for (let i =0; i < big.length; i++) {
					let itemLast = big[i][big[i].length - 1];
					if(deleteArr.has(itemLast)) {
						big.splice(i,1)
						i = --i;
					} 
				}
				return big;
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
