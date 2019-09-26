<template>
	<div>
		<el-form label-width="80px" class="bg_color">
			<el-row type="flex" justify="left">
				<el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
					<el-form-item label="广告图">
						<my-image v-if="$store.state.config" key="img_url" @emit_set_img="setImgUrl" name="img_url" :imageUrl="img_url" :max_size="max_size" :max_upload="1"></my-image>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row type="flex" justify="left">
				<el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
					<el-form-item label="备注">
						<el-input v-model="remark" name="remark" v-validate="'max:200'" placeholder="广告图备注"></el-input>
						<i class="my_err" v-show="errors.has('remark')">{{errors.first('remark')}}</i>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row type="flex" justify="left">
				<el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
					<el-form-item label="排序">
						<el-input v-model="sort" name="sort" v-validate="'numeric|min_value:0|max_value:99999999'" placeholder="填写的数字越大，排序越靠前"></el-input>
						<i class="my_err" v-show="errors.has('sort')">{{errors.first('sort')}}</i>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 			            <el-row type="flex" justify="left">
			                <el-form-item label="跳转功能页">
			                    <div>
			                        <el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="18">
			                            <el-row type="flex" :gutter="10">
			                                <el-col :span="11">
			                                    <el-select v-model="base.cat_id" filterable multiple style="width: 100%;" placeholder="请选择" @change="getSub">
			                                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
			                                        </el-option>
			                                    </el-select>
			                                </el-col>
			                                <el-col :span="11">
			                                    <el-select v-model="base.sub_cat_id" filterable multiple style="width: 100%;" placeholder="请选择">
			                                        <el-option v-for="item in options_sub" :key="item.id" :label="item.name" :value="item.id">
			                                        </el-option>
			                                    </el-select>
			                                </el-col>
			                                <el-col :span="1">
			                                    <el-button size="mini" type="primary" @click="$store.commit('MvisibleCategory',true)">添加分类</el-button>
			                                    <template v-if="$store.state.visibleCategory">
			                                        <category></category>
			                                    </template>
			                                </el-col>
			                            </el-row>
			                        </el-col>
			                    </div>
			                </el-form-item>
			            </el-row> -->
			<el-row type="flex" justify="left">
				<el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
					<el-form-item label="状态">
						<el-switch v-model="hidden" active-text="显示" :active-value="false" :inactive-value="true" inactive-text="隐藏">
						</el-switch>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item v-loading="button_post">
				<el-button type="primary" @click="submit">{{button_name}}</el-button>
				<!-- <el-button v-if="id" @click="toNext">查看下一个</el-button> -->
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import MyImage from '@/components/MyImage'
export default {
	name: 'Home_Banner_Editor',
	data() {
		return {
			button_post: false,
			img_url: '',
			remark: '',
			sort: '',
			hidden: false,
			button_name: '添加',
		}
	},
	created() {
		this.$store.commit('MactiveHomeBannerTabs', '/Home/Banner/Editor');
		// this.fetchData();
	},
	computed: {
		max_size() {
			return this.$store.state.config.maxSize.value
		}
	},
	// props: {
	// 	id: {},
	// },
	// watch: {
	// 	// 如果路由有变化，会再次执行该方法
	//    	'$route': 'fetchData'
	// },
	components: { MyImage },
	methods: {
		
		// fetchData () {
		// 	if (this.id === undefined){
		// 		;
		// 		this.button_name = '添加';
		// 		// this.$store.commit('Mloading', false)
		// 		return false;
		// 	}
		// 	;
		// 	this.button_name = '更新';
		// 	// this.$store.commit('Mloading', true)
		// },
		setImgUrl(val) {
			this.img_url = val;
		},
		submit() {
			this.$validator.validateAll().then(result => {
				if (!result) {
					this.$message.error('请按要求填写')
				} else {
					this.send();
				}
			})
		},
		send() {
			this.button_post = true
			let type = 'save'
			let params = {};
			let data = {
				url: this.img_url,
				remark: this.remark,
				sort: this.sort,
				hidden: this.hidden,
			}
			if (this.fn_id != undefined) {
				data['fn_id'] = this.fn_id
			}
			if (this.to_id != undefined) {
				data['to_id'] = this.fn_id
			}
			if (this.id != undefined) {
				params.id = this.id
				type = 'update'
			}
			params.data = data
			this.$http(this.$api.Banners,type,params).then(res => {
				this.$message.success(res.data.msg)
				this.button_post = false
			}).catch(msg => {
				this.$message.error(msg)
				this.button_post = false
			})
		}
	}
}

</script>
<style>
.bg_color {
	background: #FFFFFF;
	padding-top: 15px;
	padding-bottom: 5px;
}

</style>
