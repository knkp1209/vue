<template>
	<div>
		<el-table :data="table_data" stripe class="goods_list" ref="goods_list">
			<el-table-column label="主图" width="120">
				<template slot-scope="scope">
					<img :src="base_url + '/public/uploads/' + scope.row.url" style="height: 60px; width: 60px;" />
				</template>
			</el-table-column>
			<el-table-column prop="name" label="名称" >
			</el-table-column>
			<el-table-column prop="stock" label="库存" sortable>
			</el-table-column>
			<el-table-column prop="sale" label="销量">
			</el-table-column>
			<el-table-column prop="sell_price" label="销售价格" width="110" sortable>
			</el-table-column>
			<el-table-column prop="sort" label="排序" :render-header="(h,{column,$index}) => renderHeader(h,{column,$index},
			'在输入框里输入数字后，按回车或者鼠标点击输入框以外的地方，稍等片刻即可更新成功')" sortable>
				<template slot-scope="scope">
					<el-input v-model="scope.row.sort" @change="updateSort(scope.$index)" :name="'sort_' + scope.$index" v-validate="'numeric|min_value:0|max_value:99999999'">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column label="上下架" width="100" :render-header="(h,{column,$index}) => renderHeader(h,{column,$index},
			'点击后稍等片刻即可更新成功')">
				<template slot-scope="scope">
					<i @click="updateShelf(scope.$index)" class="hand" :class="{ 'el-icon-success': scope.row.shelf, 'el-icon-error': !scope.row.shelf }">
						<template v-if="scope.row.shelf">
							上架
						</template>
						<template v-else>
							下架
						</template>
					</i>
				</template>
			</el-table-column>
			<el-table-column prop="unit" label="单位">
			</el-table-column>
			<el-table-column prop="visit" label="浏览次数" width="110" sortable>
			</el-table-column>
			<el-table-column prop="favorite" label="收藏次数" width="110" sortable>
			</el-table-column>
			<el-table-column prop="grade" label="评价总分" width="110" sortable>
			</el-table-column>
			<el-table-column prop="comments" label="评价次数" width="110" sortable>
			</el-table-column>
			<el-table-column prop="update_time" label="更新时间" width="110" sortable>
			</el-table-column>
			<el-table-column width="145" label="操作" fixed="right">
				<template slot-scope="scope">
					<div  v-loading="!scope.row.id">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteData(scope.$index, scope.row)">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="block goods_list">
			<span style="color:#FF8F59;">说明:如商品为多规格，则列表显示的商品信息为多个规格中销售价格是最低的，如需要查看商品所有规格信息请点击编辑</span>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current_page" :page-sizes="[2,8, 10, 15, 20, 30, 40, 50, 200]" :page-size="page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			table_data: [],
			current_page: 1,
			total: 0,
			page_size: 8,
			shelfs: [],
			url: this.base_url + '/admin/goods',
		}
	},
	created() {
		this.getData();
	},
	methods: {
		renderHeader(h, { column, $index }, tip){
	        return(
	        	<span>
	        		&nbsp;{column.label}&nbsp;
			        <el-tooltip
			        class="item"
			        effect="dark"
			        content={tip}
			        placement="bottom"
			        >
			          <i class="el-icon-info"></i>
			        </el-tooltip>
			    </span>
			)
		},
		handleEdit(index, row) {
			this.$router.push({ path: `/Goods/Editor/${row.id}` })
		},
		handleSizeChange(val) {
			this.page_size = val;
			this.getData();
		},
		handleCurrentChange(val) {
			this.current_page = val;
			this.getData();
		},
		updateSort(index) {
			if (this.errors.items.length > 0){
				this.$message.error('排序只能是不小于0且不大于99999999的整数')
				return false;
			}
			this.putData(index,'sort');
		},
		updateShelf(index) {
			this.putData(index,'shelf');
		},
		putData(index,name) {
			let data = {};
			if (name == 'sort') {
				data[name] = this.table_data[index][name];				
			} else {
				data[name] = !this.table_data[index][name];
			}
			this.$ajax({
				method: 'put',
				url: this.url + '/' + this.table_data[index].id,
				data:data,
			}).then((res) => {
				if (name == 'sort') {
					this.$refs.goods_list.sort('sort','descending')
				} else if (name == 'shelf') {
					this.table_data[index].shelf = !this.table_data[index].shelf
				}
				this.$message.success('更新成功');
			}).catch((err) => {
				console.log(err);
				this.$message.error('更新失败');
			})
		},
		deleteData(index, row) { // 这里的row还是双向绑定的
			let _this = this;
			let id = row.id;
			row.id = false;
			this.$ajax({
				method: 'delete',
				url: this.url + '/' + id,
			}).then((res) => {
				this.$message.success('删除成功');
				this.table_data.splice(index,1);
				this.total = _this.total - 1;
				// 当前页数据全部删除，重新获取
				if (this.table_data.length == 0 &&  this.total > 0 ) {
					this.getData();
				}
			}).catch((err) => {
				console.log(err);
				console.log('server',err.response);
				_this.$message.error('删除失败');
			})
		},
		getData() {
			this.$store.commit('Mloading', true);
			let _this = this;
			let params = {
				current_page: this.current_page,
				page_size: this.page_size,
			};
			this.$ajax({
				method: 'get',
				url: this.url,
				params: params
			}).then((res) => {
				let { msg, result } = res.data;
				this.total = result.total;
				this.table_data = result.data;
				this.page_size = result.page_size;
				this.current_page = result.current_page;
				this.$store.commit('Mloading', false)
			}).catch((err) => {
				console.log(err)
				this.$store.commit('Mloading', false)
				alert('页面异常，请手动刷新页面，按 F5 ')
			})
		}
	}
}

</script>
<style>
.goods_list>.el-pagination {
	float: right;
}

.goods_list .el-icon-success {
	color: green;
}

.goods_list .hand {
	cursor: pointer;
}

</style>