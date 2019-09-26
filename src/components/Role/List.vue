<template>
	<div>
		<el-row class="tableBefore">
			<el-col>
				<el-button size="mini" type="danger" @click="batchDelete()">批量删除</el-button>
			</el-col>
		</el-row>
		<el-table :data="table_data" stripe
							:header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
							max-height="760"
							row-key="id"
							:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
							border
							@selection-change="handleSelectionChangeRow"
		>
			<el-table-column
							type="selection"
							width="55">
			</el-table-column>
			<el-table-column prop="name" label="角色">
			</el-table-column>
			<el-table-column prop="update_time" label="更新时间" width="200" sortable>
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间" width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="160">
				<template slot-scope="scope">
					<div v-loading="scope.row.id === false">
						<el-button size="mini" @click="handleEditRow(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteData(scope.$index, scope.row)">删除</el-button>
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
		name: 'RoleList',
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
			handleEditRow(index, row) {
				this.$activationNav('/Role/Create', `/Role/Update/${row.id}`)
			},
			handleSizeChangePage(val) {
				this.page_size = val;
				this.requestData();
			},
			handleCurrentChangePage(val) {
				this.current_page = val;
				this.requestData();
			},
			deleteData(index, row) { // 这里的row还是双向绑定的
				this.$_delete(index, row, this.$api.Role)
			},
			batchDelete() {
				this.$_batchDelete('Role')
			},
			requestData() {
				this.$getList(this.$api.Role)
			},
		}
	}
</script>
