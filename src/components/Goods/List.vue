<template>
  <div>
    <el-table :data="table_data" stripe class="goods_list" ref="goods_list" :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
      <el-table-column label="主图" width="80">
        <template slot-scope="scope">
          <img :src="$config.StaticResource + scope.row.url" style="height: 60px; width: 60px;" />
				</template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="150">
      </el-table-column>
      <el-table-column label="销售价格" width="150">
        <template slot-scope="scope">
          {{scope.row.sell_price_min}} ~ {{scope.row.sell_price_max}}
        </template>
      </el-table-column>
      <el-table-column label="原价" width="150">
        <template slot-scope="scope">
          {{scope.row.price_min}} ~ {{scope.row.price_max}}
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="50">
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="80" sortable>
      </el-table-column>
      <el-table-column prop="sale" label="销量" width="80" sortable>
      </el-table-column>
      <el-table-column prop="visit" label="浏览量" width="90" sortable>
      </el-table-column>
      <el-table-column prop="favorite" label="收藏量" width="90" sortable>
      </el-table-column>
      <el-table-column prop="grade" label="评分" width="90" sortable>
      </el-table-column>
      <el-table-column prop="comment_count" label="评价数" width="90" sortable>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="100" :render-header="(h,{column,$index}) => renderHeader(h,{column,$index},
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
      <el-table-column prop="update_time" label="更新时间" width="200" sortable>
      </el-table-column>
      <el-table-column width="145" label="操作" fixed="right">
        <template slot-scope="scope">
          <div v-loading="!scope.row.id">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.$index, scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="block goods_list">
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
    }
  },
  created() {
    this.getData();
  },
  methods: {
    renderHeader(h, { column, $index }, tip) {
      return h('span', {}, [
        h('span', {}, column.label + ' '),
        h('el-tooltip', { props: { class: 'item', content: tip, placement: 'bottom' } },
          [
            h('i', { class: 'el-icon-info' })
          ])
      ])
    },
    handleEdit(index, row) {
			this.$activationNav('/Goods/Add')
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
      if (this.errors.items.length > 0) {
        this.$message.error('排序只能是不小于0且不大于99999999的整数')
        return false;
      }
      this.putData(index, 'sort');
    },
    updateShelf(index) {
      this.putData(index, 'shelf');
    },
    putData(index, name) {
      let data = {};
      if (name == 'sort') {
        data[name] = this.table_data[index][name];
      } else {
        data[name] = !this.table_data[index][name];
      }
      this.$http(this.$api.Goods,'update',{id:this.table_data[index].id}).then( res => {
        if (name == 'sort') {
          this.$refs.goods_list.sort('sort', 'descending')
        } else if (name == 'shelf') {
          this.table_data[index].shelf = !this.table_data[index].shelf
        }
        this.$message.success(res.data.msg);
      }).catch( msg => {
        this.$message.error(msg);
      })
    },
    deleteData(index, row) { // 这里的row还是双向绑定的
      let id = row.id;
      row.id = false;
      this.$http(this.$api.Goods,'delete',{id:id}).then( res => {
        this.$message.success(res.data.msg);
        this.table_data.splice(index, 1);
        this.total = this.total - 1;
        // 当前页数据全部删除，重新获取
        if (this.table_data.length == 0 && this.total > 0) {
          this.getData();
        }
      }).catch( msg => {
        this.$message.error(msg);
      })
    },
    getData() {
      this.$store.commit('Mloading', true);
      let params = {
      	data: {
					current_page: this.current_page,
					page_size: this.page_size,
				}
      };
      this.$http(this.$api.Goods,'index',{data: params}).then( res => {
        let { msg, result } = res.data;
        this.total = result.total;
        this.table_data = result.data;
        this.page_size = result.page_size;
        this.current_page = result.current_page;
        this.$store.commit('Mloading', false)
      }).catch( msg => {
        this.$store.commit('Mloading', false)
        this.$message.error(msg)
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
