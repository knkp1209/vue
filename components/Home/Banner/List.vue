<template>
	<div>
		<el-table :data="table_data" stripe  ref="banner_list" class="banner_list">
			<el-table-column label="主图" width="270">
				<template slot-scope="scope">
					<img :src="base_url + '/public/uploads/' + scope.row.url" style="height: 104px; width: 250px;" />
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<el-table-column prop="stock" label="跳转功能" width="110" sortable>
			</el-table-column>
			<el-table-column prop="sell_price" label="目标" width="100" sortable>
			</el-table-column>
			<el-table-column prop="sort" label="排序" sortable>
				<template slot-scope="scope">
					<el-input v-model="scope.row.sort" @blur="updateSort(scope.$index)" :name="'sort_' + scope.$index" v-validate="'numeric|min_value:0|max_value:99999999'">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column label="状态" width="100">
				<template slot-scope="scope">
					<i @click="updateHidden(scope.$index)" class="hand" :class="{ 'el-icon-success': !scope.row.hidden, 'el-icon-error': scope.row.hidden }">
						<template v-if="scope.row.hidden">
							隐藏
						</template>
						<template v-else>
							显示
						</template>
					</i>
				</template>
			</el-table-column>
			<el-table-column prop="update_time" label="更新时间" width="100" sortable>
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
	</div>
</template>
<script>
export default {
	data() {
		return {
			table_data: [],
			sorts: [],
			shelfs: [],
			url: this.base_url + '/admin/banners',
		}
	},
	created() {
		this.$store.commit('MactiveHomeBannerTabs', '/Home/Banner/List');
		this.getData();
	},
	methods: {
		handleEdit(index, row) {
			this.$message.success('功能暂未开放')
			// this.$router.push({ path: `/Home/Banner/Editor/${row.id}` })
		},
		updateSort(index) {
			if (this.table_data[index].sort != this.sorts[index]) {
				this.putData(index,'sort');
			}
		},
		updateHidden(index) {
			this.putData(index,'hidden');
		},
		putData(index,name) {
			let data = {};
			if (name == 'sort') {
				data[name] = this.table_data[index][name];
			} else if (name == 'hidden') {
				data[name] = !this.table_data[index][name];
			}
			this.$ajax({
				method: 'put',
				url: this.url + '/' + this.table_data[index].id,
				data:data,
			}).then((res) => {
				if (name == 'sort') {
					this.$refs.banner_list.sort('sort','descending')
				} else if (name == 'hidden') {
					this.table_data[index].hidden = !this.table_data[index].hidden
				}
				this.$message.success('更新成功');
			}).catch((err) => {
				console.log(err);
				this.$message.error('更新失败');
			})
		},
		deleteData(index, row) { // 这里的row还是双向绑定的
			let id = row.id;
			row.id = false;
			this.$ajax({
				method: 'delete',
				url: this.url + '/' + id,
			}).then(() => {
				this.$message.success('删除成功');
				this.table_data.splice(index,1);
			}).catch((err) => {
				this.$message.error('删除失败');
				row.id = true;
			})
		},
		getData() {
			this.$store.commit('Mloading', true)
			this.$ajax({
				method: 'get',
				url: this.url,
			}).then((res) => {
				let { result } = res.data;
				this.table_data = result;
				this.storeData();
				this.$store.commit('Mloading', false)
			}).catch((err) => {
				console.log(err)
				this.$store.commit('Mloading', false)
			})
		},
		storeData() {
			this.table_data.forEach((item) => {
				this.sorts.push(item.sort);
			})
		}
	}
}

</script>
<style>
.banner_list .el-icon-success {
	color: green;
}

.banner_list .hand {
	cursor: pointer;
}
</style>