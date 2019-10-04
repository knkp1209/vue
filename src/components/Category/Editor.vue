<template>
	<div class="main">
		<el-form label-position="right" label-width="80px">
			<el-form-item label="父级分类">
				<el-select v-model="pid" filterable placeholder="顶级分类" :disabled="pid_disabled">
					<el-option v-for="item in parents" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="名称">
				<el-input v-model="name" name="name" v-validate="'required|max:200'" placeholder="分类名称 (必填)"></el-input>
				<i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
			</el-form-item>
			<el-form-item label="排序">
				<el-input v-model="sort" name="sort" v-validate="'numeric|min_value:0|max_value:99999999'"
									placeholder="填写的数字越大，排序越靠前"></el-input>
				<i class="my_err" v-show="errors.has('sort')">{{errors.first('sort')}}</i>
			</el-form-item>
			<el-form-item label="分类页">
				<el-switch
								v-model="hidden"
								active-color="#ff4949"
								inactive-color="#13ce66"
								active-text="隐藏"
								inactive-text="显示">
				</el-switch>
			</el-form-item>
			<el-form-item label="在首页">
				<el-switch
								v-model="i_hidden"
								active-color="#ff4949"
								inactive-color="#13ce66"
								active-text="隐藏"
								inactive-text="显示">
				</el-switch>
			</el-form-item>
			<el-form-item label="图片">
				<my-image v-if="loading" key="category" name="category" @emit_set_img="setImgUrl"
									:imageUrl="img_url" :max_size="$store.state.config.maxSize.value" :max_upload="1"></my-image>
			</el-form-item>
		</el-form>
		<div class="footer" v-loading="add_loading">
			<el-button @click="cancel">取 消</el-button>
			<el-button @click="post" type="primary">{{op_name}}</el-button>
		</div>
	</div>
</template>
<script>
	import MyImage from '@/components/MyImage'

	export default {
		name: 'CategoryEditor',
		data() {
			return {
				op_name: '添 加',
				loading: false, // 加载单图组件
				add_loading: false,
				pid_disabled: false,
				parents: [],

				img_url: '',
				name: '',
				sort: '',
				hidden: true,
				i_hidden: false,
				pid: '',
			}
		},
		props: {
			id: {},
		},
		components: {MyImage},
		created() {
			if (this.id === undefined) {
				this.requestCreateData()
			} else {
				this.requestEditData()
			}
		},
		methods: {
			requestEditData() {
				this.$http(this.$api.Category, 'edit', {id: this.id}).then(({data}) => {
					this.hidden = this.$toBool(data, 'hidden')
					this.i_hidden = this.$toBool(data, 'i_hidden')
					this.$assign(data)
					if (this.pid == 0) {
						this.pid = '';
					}
					this.img_url = this.url; // 绑定图标值
					this.loading = true; // 这时可加载单图组件
					this.pid_disabled = true;
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			requestCreateData() {
				this.$http(this.$api.Category, 'create').then(({data}) => {
					this.parents = data
					this.loading = true;
				}).catch(msg => {
					this.$message.error(msg)
				})
			},
			post() {
				let data = {
					url: this.img_url,
					name: this.name,
					sort: this.sort,
					hidden: this.hidden,
					i_hidden: this.i_hidden,
				};
				if (this.id == undefined) {
					data['pid'] = this.pid;
				}
				this.$edit(this.$api.Category, data, 'Category')
			},
			cancel() {
				this.$activationNav('/Category/List')
			},
			setImgUrl(val) {
				this.img_url = val;
			},
		}
	}

</script>
<style>
</style>
