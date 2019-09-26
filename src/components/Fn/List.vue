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
			<el-table-column prop="describe" label="功能描述" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="auth_name" label="权限名称" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="auth_path" :show-overflow-tooltip="true">
				<template slot="header">
					<el-tooltip content="包含模块控制器方法的完整方法名" placement="top">
						<span>权限路径<i class="el-icon-info"></i></span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="name" :show-overflow-tooltip="true">
				<template slot="header">
					<el-tooltip content="vue路由名称" placement="top">
						<span>路由名称<i class="el-icon-info"></i></span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="path" :show-overflow-tooltip="true">
				<template slot="header">
					<el-tooltip content="vue组件路由路径" placement="top">
						<span>路由路径<i class="el-icon-info"></i></span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="component" :show-overflow-tooltip="true">
				<template slot="header">
					<el-tooltip content="vue组件文件路径" placement="top">
						<span>文件路径<i class="el-icon-info"></i></span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column>
				<template slot="header">
					<el-tooltip content="是否开启vue组件路由父子传值介质" placement="top">
						<span>路由介质<i class="el-icon-info"></i></span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<span v-if="scope.row.props"><i class="el-icon-success"></i></span>
					<span v-else><i class="el-icon-error"></i></span>
				</template>
			</el-table-column>
			<el-table-column label="路由重定向" :show-overflow-tooltip="true">
				<template slot-scope="scope">
					<span v-if="scope.row.redirect == null"><i class="el-icon-error"></i></span>
					<span v-else>{{scope.row.redirect}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="router" label="">
				<template slot="header">
					<el-tooltip content="是否作为vue组件路由" placement="top">
						<span>开启路由<i class="el-icon-info"></i></span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<span v-if="scope.row.router"><i class="el-icon-success"></i></span>
					<span v-else><i class="el-icon-error"></i></span>
				</template>
			</el-table-column>
			<el-table-column prop="menu_name" label="菜单栏名称" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column label="菜单栏状态">
				<template slot-scope="scope">
					<span v-if="scope.row.menu_status"><i class="el-icon-success"></i></span>
					<span v-else><i class="el-icon-error"></i></span>
				</template>
			</el-table-column>
			<el-table-column label="根节点">
				<template slot-scope="scope">
					<span v-if="scope.row.leaf == 0"><i class="el-icon-success"></i></span>
					<span v-else-if="scope.row.leaf == 1"><i class="el-icon-error"></i></span>
					<span v-else>路由根节点，菜单叶子节点</span>
				</template>
			</el-table-column>
			<el-table-column label="类型">
				<template slot-scope="scope">
					<span v-if="scope.row.type == 0">后台</span>
					<span v-else-if="scope.row.type == 1">前端</span>
				</template>
			</el-table-column>
			<el-table-column prop="update_time" label="更新时间" width="200" sortable>
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
			<el-pagination @size-change="handleSizeChangePage" @current-change="handleCurrentChangePage"
										 :current-page="current_page"
										 :page-sizes="[2,8, 10, 15, 20, 30, 40, 50, 200]" :page-size="page_size"
										 layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'FnList',
		data() {
			return {
				table_data: [],
				selected_ids: [],
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
				this.$activationNav('/Fn/Create', `/fn/Update/${row.id}`)
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
				this.$_delete(index, row, this.$api.Fn)
			},
			batchDelete() {
				this.$_batchDelete('Fn')
			},
			requestData() {
				this.$getList(this.$api.Fn)
			},
		}
	}
</script>
