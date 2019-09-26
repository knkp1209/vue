<template>
  <div>
    <el-button type="text" @click="open">去挑选</el-button>
    <el-dialog title="选择商品" :visible.sync="dialog_table_visible">
      <div>
        <label>分类</label>
        <el-select v-model="cate_parent_id" clearable filterable placeholder="请选择" value-key="id" @change="changeCateParent">
          <el-option v-for="item in cate_parent_list" :key="item.id" :label="item.name" :value="item">
          </el-option>
        </el-select>
        <el-select v-model="cate_sub_id" clearable filterable placeholder="请选择" value-key="id" @change="changeCateSub">
          <el-option v-for="item in cate_sub_list" :key="item.id" :label="item.name" :value="item">
          </el-option>
        </el-select>
        <el-checkbox v-model="flash" border>秒杀</el-checkbox>
        <el-checkbox v-model="team" border>团购</el-checkbox>
        <el-button type="info" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </div>
      <div>
        <el-table ref="moduleGoodsSelectTable" :data="goods_list" height="550" border stripe :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}" @selection-change="selectGoods">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column property="product_id" label="ID"></el-table-column>
          <el-table-column label="商品">
            <template slot-scope="scope">
              <div>{{scope.row.name}}</div>
              <div>{{scope.row.spec}}</div>
            </template>
          </el-table-column>
          <el-table-column property="sell_price" label="价格"></el-table-column>
        </el-table>
      </div>
      <div>
        <el-button type="primary" @click="close">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Goods_Table',
  data() {
    return {
      flash: false,
      team: false,
      cate_parent_id: null,
      cate_parent_list: [],
      cate_sub_id: null,
      cate_sub_list: [],
      goods_list: [],
      goods_list_post: [],
      cate_name: '',
      cate_parent_list_map: {},
      dialog_table_visible: true,
      is_first: true,
    };
  },
  created(){
			this.requestCateList()
			this.requestGoodsList()
  },
  props: {
    selected_product_id_list: Array
  },
  methods: {
    changeCateParent(e) {
      this.cate_sub_id = null
      if (e) {
        this.cate_name = e.name
        this.updateSubList(e.id)
      }
    },
    changeCateSub(e) {
      this.cate_name = e.name
    },
    updateSubList(id) {
      let index = this.cate_parent_list_map[id]
      let list = this.cate_parent_list[index].children;
      if (list) {
        this.cate_sub_list = list
      } else {
        this.cate_sub_list = []
      }
    },
    cateParentListMap(cate_list) {
      let temp = {}
      for (let i in cate_list) {
        temp[cate_list[i].id] = i;
      }
      this.cate_parent_list_map = temp;
    },
    search() {
      this.requestGoodsList();
    },
    requestGoodsList() {
      let params = {};
      if (this.flash) {
        params.flash = 1
      }
      if (this.team) {
        params.team = 1
      }
      if (this.cate_parent_id) {
        params.category_id = this.cate_parent_id
      }
      if (this.cate_sub_id) {
        params.category_id = this.cate_sub_id
      }
      this.$http(this.$api.Module,'create',{data:params}).then(({ data }) => {
        this.goods_list = data.result
        this.checkTableSelected()
      }).catch( msg => {
        this.$message.error(msg);
      })
    },
    requestCateList() {
      this.$http(this.$api.Categories,'index').then(({ data }) => {
        this.cate_parent_list = data.result;
        this.cateParentListMap(this.cate_parent_list)
      }).catch( msg => {
        this.$message.error(msg)
      })
    },
    open() {
      this.dialog_table_visible = true
    },
    close() {
      this.dialog_table_visible = false
    },
    selectGoods(e) {
    	console.log(e)
      let type = 'Default';
      let flag = '';
      if (this.cate_parent_id || this.cate_sub_id) {
        // flag = ''
      } else if (this.team) {
        type = 'Team';
        flag = '团购';
      } else if (this.flash) {
        type = 'Flash';
        flag = '秒杀';
      }
      let product = {};
      this.goods_list_post = [];
      for (let i in e) {
        product = {
          type: type,
          goods_id: e[i].goods_id,
          product_id: e[i].product_id,
          flag: flag
        }
        this.goods_list_post.push(product)
      }
    },
    checkTableSelected() {
			this.$nextTick(() => {
        if (this.$refs.moduleGoodsSelectTable) {
          if (this.selected_product_id_list.length > 0) {
            this.goods_list.forEach((row, index) => {
              if (this.selected_product_id_list.indexOf(row.product_id) >= 0) {
                this.$refs.moduleGoodsSelectTable.toggleRowSelection(this.goods_list[index], true)
              }
            })
          } else {
            this.$refs.moduleGoodsSelectTable.clearSelection()
          }
        }
        if (this.is_first) {
					this.dialog_table_visible = false
          this.is_first = false
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
.el-select {
  width: 120px;
}

.el-dialog {
  div+div {
    margin-top: 10px;
  }
}

</style>
<style>
</style>
