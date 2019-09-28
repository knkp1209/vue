<template>
	<div class="category">
		<div class="head">
			<span>分类名称</span>
			<span>分类图标</span>
			<span>显示或隐藏</span>
			<span>首页显示隐藏</span>
			<span>排序
		        <el-tooltip
		        class="item"
		        effect="dark"
		        content="在输入框里输入数字后，按回车或者鼠标点击输入框以外的地方，稍等片刻即可更新成功"
		        placement="bottom"
		        >
		          <i class="el-icon-info"></i>
		        </el-tooltip>
			</span>
			<span>操作</span>
		</div>
		<div v-for="(item,i) in categorys" :key="i" class="content">
			<div :class="{ 'two': i%2 == 0 }">
				<span>
					<i v-show="item.children" :class="{ 'el-icon-circle-plus': !item.open, 'el-icon-remove': item.open }" @click="op(i,item)"></i>
					{{item.name}}
				</span>
				<span>
					<img class="cat_img" :src="$config.StaticResource + item.url" />
				</span>
				<span>
					<i
					@click="updateHidden(item)"
					:class="{'el-icon-success' : !item.hidden, 'el-icon-error' : item.hidden}">
						<template v-if="item.hidden">
							隐藏
						</template>
						<template v-else>
							显示
						</template>
					</i>
				</span>
				<span>
					<i
					@click="updateIHidden(item)"
					:class="{'el-icon-success' : !item.i_hidden, 'el-icon-error' : item.i_hidden}">
						<template v-if="item.i_hidden">
							隐藏
						</template>
						<template v-else>
							显示
						</template>
					</i>
				</span>
				<span>
					<input type="text" v-model="item.sort" class="el-input__inner" :name="'sort_' + item.id" v-validate="'numeric|min_value:0|max_value:99999999'" @change="updateSort(item)"/>
				</span>
				<span>
					<button size="mini" @click="handleEdit(item)"><i>编辑</i></button>
					<button class="delete" size="mini" @click="handleDel(item)"><i>删除</i></button>
				</span>
			</div>
			<div v-show="item.open" v-for="(sub,j) in item.children" :key="j">
				<span>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					{{sub.name}}
				</span>
				<span>
					<img :src="$config.StaticResource + sub.url" />
				</span>
				<span>
					<i
					@click="updateHidden(sub)"
					:class="{'el-icon-success' : !sub.hidden, 'el-icon-error' : sub.hidden}">
						<template v-if="sub.hidden">
							隐藏
						</template>
						<template v-else>
							显示
						</template>
					</i>
				</span>
				<span>
					<i
					@click="updateIHidden(sub)"
					:class="{'el-icon-success' : !sub.i_hidden, 'el-icon-error' : sub.i_hidden}">
						<template v-if="sub.i_hidden">
							隐藏
						</template>
						<template v-else>
							显示
						</template>
					</i>
				</span>
				<span>
					<input type="text" v-model="sub.sort" class="el-input__inner" :name="'sort_' + sub.id" v-validate="'numeric|min_value:0|max_value:99999999'" @change="updateSort(sub)"/>
				</span>
				<span>
					<button size="mini" @click="handleEdit(sub)"><i>编辑</i></button>
					<button class="delete" size="mini" @click="handleDel(sub)"><i>删除</i></button>
				</span>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			categorys: this.$store.state.topCategoryList,
			sorts: [],
			shelfs: [],
			defaultProps: {
				children: 'children',
				label: 'name'
			}
		}
	},
	created() {
		if (this.$store.state.topCategoryList.length == 0) {
			this.fetchData();
		}
	},
	methods: {
		op(i, item) {
			if (item.open == false) {
				item.open = true;
				this.$set(this.categorys, i, item)
			} else {
				item.open = false;
				this.$set(this.categorys, i, item)
			}
		},
		handleEdit(category) {
			this.$router.push({
				name: 'category/editor',
				params: {
					category,
					id: category.id
				}
			})
		},
		handleDel(category) {
			this.deleteData(category);
		},
		updateSort(category) {
			if (this.errors.items.length > 0) {
				this.$message.error('排序只能是不小于0且不大于99999999的整数')
				return false;
			}
			this.putData(category, 'sort');
		},
		updateHidden(category) {
			this.putData(category, 'hidden');
		},
		updateIHidden(category) {
			this.putData(category, 'i_hidden');
		},
		putData(category, name) {
		},
		deleteData(category) {
		},
		getData() {
			this.$store.commit('Mloading', true)
			this.$http(this.$api.Categories,'index').then( res => {
				let { result } = res.data;
				this.table_data = result;
				this.storeData();
				this.$store.commit('Mloading', false)
			}).catch( msg => {
				this.$store.commit('Mloading', false)
			})
		},
		storeData() {
			this.table_data.forEach((item) => {
				this.sorts.push(item.sort);
			})
		},
		fetchData() {
			this.$http(this.$api.Categories,'index').then( res => {
				let { msg, result } = res.data
				this.$store.commit('MtopCategoryList', result)
				this.categorys = result
			}).catch( msg => {
				this.$message.error(msg)
			})
		},
	}
}

</script>
<style>
.category {
	background: #FFFFFF;
}

.category .head {
	display: flex;
	height: 60px;
	border-bottom: 1px solid #dcdfe6;
}

.category .content div {
	display: flex;
	height: 100px;
	background: #FFFFFF;
}

.category .content div:hover {
	background: #ebeef5;
}

.category .content .two {
	background: #fafafa;
}

.category span {
	flex: 2;
	width: 200px;
	font-size: 18px;
	text-align: left;
	padding-left: 20px;
}

.category .head span {
	height: 60px;
	line-height: 60px;
	color: #909399;
}

.category .content span {
	height: 100px;
	line-height: 100px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.category .content span>i {
	color: green;
	cursor: pointer;
}

.category button {
	display: inline-block;
	line-height: 1;
	white-space: nowrap;
	cursor: pointer;
	background: #fff;
	border: 1px solid #dcdfe6;
	color: #606266;
	-webkit-appearance: none;
	text-align: center;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	outline: 0;
	margin: 0;
	-webkit-transition: .1s;
	transition: .1s;
	font-weight: 500;
	padding: 5px 10px;
	font-size: 12px;
	border-radius: 3px;
}

.category .delete {
	background-color: #f56c6c;
	border-color: #f56c6c;
	color: #FFFFFF;
}

.category img {
	width: 80px;
	height: 80px;
	padding-top: 10px;
}

</style>
