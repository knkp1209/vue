<template>
	<div>
		<el-table :data="table_data" stripe
							:header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
							max-height="760"
							row-key="id"
							:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
							border
							@selection-change="handleSelectionChangeRow"
		>
			<el-table-column prop="account" label="账号">
			</el-table-column>
			<el-table-column prop="role_name" label="角色">
			</el-table-column>
			<el-table-column prop="name" label="应用名称">
			</el-table-column>
			<el-table-column prop="db_host" label="数据库IP">
			</el-table-column>
			<el-table-column prop="db_name" label="数据库名称">
			</el-table-column>
			<el-table-column prop="db_user" label="数据库用户名">
			</el-table-column>
			<el-table-column prop="db_password" label="数据库密码">
			</el-table-column>
			<el-table-column prop="delete_time" label="删除时间" width="200" sortable>
			</el-table-column>
			<el-table-column prop="update_time" label="更新时间" width="200" sortable>
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间" width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="160">
				<template slot-scope="scope">
					<div v-loading="scope.row.id === false">
						<el-button size="mini" type="danger" @click="cleanData(scope.$index, scope.row)">清理</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination">
			<el-pagination @size-change="handleSizeChangePage" @current-change="handleCurrentChangePage" :current-page="current_page"
										 :page-sizes="[2,8, 10, 15, 20, 30, 40, 50, 200]" :page-size="page_size"
										 layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'AccountDeletedList',
		data() {
			return {
				table_data: [],
				selected_ids:[],
				current_page: 1,
				total: 0,
				page_size: 10,
			}
		},
		created() {
			this.requestData();
		},
		methods: {
			handleSelectionChangeRow(selection) {
				this.selected_ids = [];
				for (var i in selection) {
					this.selected_ids.push(selection[i]['id'])
				}
			},
			handleSizeChangePage(val) {
				this.page_size = val;
				this.requestData();
			},
			handleCurrentChangePage(val) {
				this.current_page = val;
				this.requestData();
			},
			cleanData(index, row) { // 这里的row还是双向绑定的
				this.$_delete(index, row, this.$api['Accounts-clean'])
			},
			requestData() {
				this.$getList(this.$api['Accounts-deleted'])
			},
		}
	}
</script>
