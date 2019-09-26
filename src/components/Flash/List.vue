<template>
  <div>
    <el-table :data="table_data" stripe class="goods_list" ref="goods_list" :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
      <el-table-column label="商品" width="350px">
        <template slot-scope="scope">
          <div>{{scope.row.name}}</div>
          <div>{{scope.row.spec}}</div>
          <div v-if="isEnd(scope.row.end_time)">
            <el-tag type='danger'>已结束</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sell_price" label="秒杀价格">
      </el-table-column>
      <el-table-column prop="stock" label="秒杀库存">
      </el-table-column>
      <el-table-column label="单次下单限购数">
        <template slot-scope="scope">
          <div v-if="scope.row.max_qty > 0">
            {{scope.row.max_qty}}
          </div>
          <div v-else>
            不限购
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="start_time" label="开始时间">
      </el-table-column>
      <el-table-column prop="end_time" label="结束时间">
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
    handleEdit(index, row) {
      this.$activationNav('/Flash/Add')
      this.$router.push({ path: `/Flash/Editor/${row.id}` })
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
      let params = {
      	id:this.table_data[index].id,
        data:data
      }

      this.$http(this.$api.Flash,'update',params).then( res => {
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
      this.$http(this.$api.Flash,'delete',{id:id}).then( res => {
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
      this.$http(this.$api.Flash,'index',{data:params}).then( res => {
        let { msg, result } = res.data;
        this.total = result.total;
        this.table_data = result.data;
        this.page_size = result.page_size;
        this.current_page = result.current_page;
        this.$store.commit('Mloading', false)
      }).catch( msg => {
        this.$message.error(msg)
        this.$store.commit('Mloading', false)
        // alert('页面异常，请手动刷新页面，按 F5 ')
      })
    },
    isEnd(end_time) {
      end_time = new Date(end_time);
      let time = new Date();
      if (time > end_time) {
        return true;
      } else {
        return false;
      }
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
