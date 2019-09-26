<template>
  <div class="main">
    <el-form label-position="right" label-width="80px">
      <el-form-item label="商品">
        <el-select v-model="product_id" filterable placeholder="请选择" :disabled="product_id_disabled" v-validate="'required'" name="product_id">
          <el-option-group v-for="goods in goods_list" :key="goods.id" :label="goods.name">
            <el-option class="product" v-for="product in goods.products_options" :key="product.id" :label="goods.name + product.spec" :value="product.id">
              <span><label class="tip">价格：</label><label class="price">{{product.sell_price}}</label></span>
              <span><label class="tip">库存：</label><label>{{product.stock}} {{goods.unit}}</label></span>
              <span><label class="tip">规格：</label><label class="spec">{{product.spec}}</label></span>
            </el-option>
          </el-option-group>
        </el-select>
        <i class="my_err" v-show="errors.has('product_id')">{{errors.first('product_id')}}</i>
      </el-form-item>
      <el-form-item label="团购价">
        <el-input v-model="sell_price" name="sell_price" v-validate="'decimal:2|min_value:0|max_value:99999999|required'" placeholder="团购价格 (必填)"></el-input>
        <i class="my_err" v-show="errors.has('sell_price')">{{errors.first('sell_price')}}</i>
      </el-form-item>
      <el-form-item label="开团人数">
        <el-input v-model="people_qty" name="people_qty" v-validate="'numeric|min_value:0|max_value:99999999'" placeholder="满足开团人数即开团成功"></el-input>
        <i class="my_err" v-show="errors.has('people_qty')">{{errors.first('people_qty')}}</i>
      </el-form-item>
      <el-form-item label="开始时间">
        <div class="date_time">
          <el-date-picker v-model="start_date" name="start_date" v-validate="'required'" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>&nbsp;
          <el-time-select v-model="start_time" name="start_time" v-validate="'required'" :picker-options="{
    start: '00:00',
    step: '02:00',
    end: '22:00'
  }" placeholder="选择时间" format="HH:mm:ss" value-format="HH:mm:ss">
          </el-time-select>
        </div>
        <i class="my_err" v-show="errors.has('start_date')">{{errors.first('start_date')}}</i>
        <i class="my_err" v-show="errors.has('start_time')">{{errors.first('start_time')}}</i>
      </el-form-item>
      <el-form-item label="结束时间">
        <div class="date_time">
          <el-date-picker v-model="end_date" name="end_date" v-validate="'required'" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>&nbsp;
          <el-time-select v-model="end_time" name="end_time" v-validate="'required'" :picker-options="{
    start: '00:00',
    step: '02:00',
    end: '22:00'
  }" placeholder="选择时间" format="HH:mm:ss" value-format="HH:mm:ss">
          </el-time-select>
        </div>
        <i class="my_err" v-show="errors.has('end_date')">{{errors.first('end_date')}}</i>
        <i class="my_err" v-show="errors.has('end_time')">{{errors.first('end_time')}}</i>
      </el-form-item>
    </el-form>
    <div class="footer" v-loading="add_loading">
      <el-button @click="cancel">取 消</el-button>
      <el-button @click="post" type="primary">{{op_name}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Team_Editor',
  data() {
    return {
      op_name: '保 存',
      product_id_disabled: false,
      add_loading: false,
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      people_qty: null,
      sell_price: null,
      stock: null,
      product_id: null,
      goods_list: [],
    }
  },
  props: {
    id: {},
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'init'
  },
  created() {
    this.init()
    //   this.pid_disabled = true
    //   if (this.$route.params.category == undefined) {
    //     this.$router.push({ path: '/Category/List' })
    //     return false;
    //   }
    //   let category = this.$route.params.category;
    //   this.name = category.name
    //   if (category.pid != 0) {
    //     this.pid = category.pid
    //   }
    //   this.sort = category.sort
    //   this.show = !category.hidden
    //   this.i_show = !category.i_hidden
    //   this.img_url = category.url
    //   this.op_name = '更 新'
    // }
  },
  methods: {
    init() {
      this.product_id_disabled = false
      this.add_loading = false
      this.start_date = null
      this.start_time = null
      this.end_date = null
      this.end_time = null
      this.people_qty = null
      this.sell_price = null
      this.product_id = null
      this.put_product_id = null
      if (this.id != undefined) {
        this.product_id_disabled = true
        // this.product_id = '这是商品'
        this.getProduct();
      } else {
        this.$nextTick(() => {
          this.$validator.reset();
        })
        this.getProductList();
      }
    },
    getProductList() {
			this.$http(this.$api.Team,'create').then( res => {
        let { msg, result } = res.data
        this.goods_list = result.map(x => {
          let products = x.products_options
          for (let p_index in products) {
            products[p_index].spec = this.formatSpec(products[p_index].spec)
          }
          x.products_options = products;
          return x
        })
      }).catch( msg => {
        this.$message.error(msg)
      })
    },
    formatSpec(spec) {
      spec = JSON.parse(spec)
      let string = ''
      for (let s_index in spec) {
        string += s_index + ':' + spec[s_index] + ', '
      }
      return string
    },
    getProduct() {
      this.$http(this.$api.Team,'edit',{id:this.id}).then( res => {
        let { msg, result } = res.data
        this.put_product_id = result.product_id
        this.product_id = result.name + this.formatSpec(result.spec)
        this.$formatTime(result)
        this.sell_price = result.sell_price
        this.people_qty = result.people_qty
      }).catch( msg => {
      	this.$message.error(msg)
        // alert('页面异常，请手动刷新页面，按 F5 ')
      })
    },
    post() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.add_loading = true;
          let url = this.url
          let type = 'save'
          let params = {}
          let data = {
            product_id: this.product_id,
            sell_price: this.sell_price,
            people_qty: this.people_qty,
            start_time: this.start_date + ' ' + this.start_time,
            end_time: this.end_date + ' ' + this.end_time,
          }
          if (this.id != undefined) {
            params.id = this.id
            type = 'update'
            data.product_id = this.put_product_id
          }
          params.data = data
          this.$http(this.$api.Team,type,params).then( res => {
            this.$message({
              message: res.data.msg,
              type: 'success',
              onClose: () => {
                this.$router.push({ path: '/Team/List' })
              }
            });
          }).catch( msg => {
            this.$message.error(msg)
            this.add_loading = false;
          })
        }
      })
    },
    cancel() {
      if (this.id == undefined) {
        this.pid = '';
        this.name = '';
      }
    },
    setImgUrl(val) {
      this.img_url = val;
    },
  }
}

</script>
<style lang="less">
.product {
  .tip {
    color: #909399;
  }

  .spec {
    color: #303133;
  }

  .price {
    color: #F56C6C;
  }
}

.date_time {
  display: flex;
  width: 125%;
}

</style>
