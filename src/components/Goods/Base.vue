<template>
	<div class="goods_base">
		<el-form label-width="80px">
			<el-row type="flex" justify="left">
				<el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
					<el-form-item label="名称">
						<el-input v-model="base.name" name="name" v-validate="'required|max:200'"
											placeholder="商品名称 (必填)"></el-input>
						<i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row type="flex" justify="left">
				<el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
					<el-form-item label="单位">
						<el-input v-model="base.unit" name="unit" v-validate="'max:10'" placeholder="计件单位。如:件,箱,个"></el-input>
						<i class="my_err" v-show="errors.has('unit')">{{errors.first('unit')}}</i>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row type="flex" justify="left">
				<el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
					<el-form-item label="排序">
						<el-input v-model="base.sort" name="sort" v-validate="'numeric|min_value:0|max_value:99999999'"
											placeholder="填写的数字越大，排序越靠前"></el-input>
						<i class="my_err" v-show="errors.has('sort')">{{errors.first('sort')}}</i>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row type="flex" justify="left">
				<el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
					<el-form-item label="上下架">
						<el-switch v-model="base.is_shelf" active-text="上架" inactive-text="下架">
						</el-switch>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row type="flex" justify="left">
				<el-form-item label="分类">
					<div>
						<el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="18">
							<el-cascader
											v-model="base.categoriesSelected"
											:props="{ multiple: true, label:'name', value:'id' }"
											:options="base.categories"
							>
								<!--@change="handleChange"-->
							</el-cascader>
						</el-col>
					</div>
				</el-form-item>
			</el-row>
		</el-form>
	</div>
</template>
<script>
	import Tag from '@/components/Tag'
	import DynamicInput from '@/components/DynamicInput'
	// import Category from '@/components/Category'
	export default {
		name: 'Goods_Base',
		data() {
			return {
			}
		},
		props: {
			base: { // 商品基本信息
				type: Object,
				required: true,
			}
		},
		created() {
		},
	}

</script>
<style>
	.goods_base .el-tag + .el-tag {
		margin-left: 10px;
	}

	.goods_base .button-new-tag {
		height: 32px;
		line-height: 30px;
		margin-left: 10px;
		padding-bottom: 0;
		padding-top: 0;
	}

	.goods_base .input-new-tag {
		margin-left: 10px;
		vertical-align: bottom;
		width: 180px;
		font-size: 12px;
	}

	.goods_base .el-dialog__body {
		padding-bottom: 0px;
		padding-top: 0px;
	}

</style>
