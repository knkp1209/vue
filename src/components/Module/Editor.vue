<template>
  <div class="main">
    <el-form label-position="right" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="title" name="title" v-validate="'required|max:200'" placeholder="标题 (必填)"></el-input>
        <i class="my_err" v-show="errors.has('title')">{{errors.first('title')}}</i>
      </el-form-item>
      <el-form-item label="商品选择">
        <!-- <keep-alive> -->
          <goods-select :key="id"  ref="moduleGoodsSelect" :selected_product_id_list="selected_product_id_list"></goods-select>
        <!-- </keep-alive> -->
      </el-form-item>
      <el-form-item label="上下架">
        <el-switch v-model="enable" active-text="上架" inactive-text="下架">
        </el-switch>
      </el-form-item>
      <el-form-item label="展示数量">
        <el-input v-model="qty" name="qty" v-validate="'required|numeric|min_value:0|max_value:99999999'" placeholder="需要特别展示的数量"></el-input>
        <i class="my_err" v-show="errors.has('qty')">{{errors.first('qty')}}</i>
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
import GoodsSelect from '@/components/Module/GoodsSelect'
export default {
  name: 'Module_Editor',
  data() {
    return {
      op_name: '保 存',
      add_loading: false,
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      qty: null,
      title: null,
      product_id: null,
      enable: true,
      selected_product_id_list: [],
    }
  },
  props: {
    id: {},
  },
  components: {
    GoodsSelect
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'onload'
  },
  created() {
    this.onload()
  },
  methods: {
    onload() {
      if (this.id) {
        this.requestModule()
      } else {
        this.init()
      }
    },
    init() {
      this.$nextTick(() => {
        this.$validator.reset();
      })
      this.add_loading = false
      this.start_date = null
      this.start_time = null
      this.end_date = null
      this.end_time = null
      this.qty = null
      this.title = null
      this.product_id = null
      this.enable = true
      this.put_product_id = null
      this.selected_product_id_list = []
    },
    requestModule() {
      this.$http(this.$api.Module,'edit',{id:this.id}).then(({ data }) => {
        let result = data.result
        this.$formatTime(result)
        this.$toBool(result)
        this.selected_product_id_list = result.product_id_list
        this.$assign(result)
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
    post() {
      this.$validator.validateAll().then(result => {
         if (this.$refs.moduleGoodsSelect.goods_list_post.length == 0) {
          this.$message({
            message: '请选择商品再保存',
            type: 'error'
          });
          return false;
        }
        if (result) {
          this.add_loading = true;
          let url = this.url
          let type = 'save'
          let params = {}
          let data = {
            title: this.title,
            enable: this.enable,
            page: "Home", // 暂时写死
            qty: this.qty,
            start_time: this.start_date + ' ' + this.start_time,
            end_time: this.end_date + ' ' + this.end_time,
            goods_list: this.$refs.moduleGoodsSelect.goods_list_post
          }
          if (this.id != undefined) {
            params.id = this.id
            type = 'update'
          }
          params.data = data
          this.$http(this.$api.Module,type,params).then( res => {
            this.$message({
              message: res.data.msg,
              type: 'success',
              onClose: () => {
                this.$router.push({ path: '/Module/List' })
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
