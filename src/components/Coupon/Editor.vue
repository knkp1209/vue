<template>
  <div class="main">
    <el-form label-position="right" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="title" name="title" v-validate="'required|max:200'" placeholder="标题 (必填)"></el-input>
        <i class="my_err" v-show="errors.has('title')">{{errors.first('title')}}</i>
      </el-form-item>
      <el-form-item label="可领取总次数">
        <el-input v-model="total" name="total" v-validate="'required|numeric|min_value:0|max_value:99999999'" placeholder="可领取总次数"></el-input>
        <i class="my_err" v-show="errors.has('total')">{{errors.first('total')}}</i>
      </el-form-item>
      <el-form-item label="每次领取张数">
        <el-input v-model="use_total" name="use_total" v-validate="'required|numeric|min_value:0|max_value:99999999'" placeholder="每次领取张数"></el-input>
        <i class="my_err" v-show="errors.has('use_total')">{{errors.first('use_total')}}</i>
      </el-form-item>
      <el-form-item label="剩余领取次数">
        <el-input v-model="stock" disabled></el-input>
      </el-form-item>
      <el-form-item label="优惠金额">
        <el-input v-model="amount" name="amount" v-validate="'required|decimal:2|min_value:0|max_value:99999999'" placeholder="优惠金额"></el-input>
        <i class="my_err" v-show="errors.has('amount')">{{errors.first('amount')}}</i>
      </el-form-item>
      <el-form-item label="限制使用金额">
        <el-input v-model="amount_limit" name="amount_limit" v-validate="'required|decimal:2|min_value:0|max_value:99999999'" placeholder="限制使用金额"></el-input>
        <i class="my_err" v-show="errors.has('amount_limit')">{{errors.first('amount_limit')}}</i>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="enable" active-text="可领取" inactive-text="不可领取">
        </el-switch>
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
  name: 'Coupon_Editor',
  data() {
    return {
      op_name: '保 存',
      add_loading: false,
      start_date: null,
      start_time: null,
      end_date: null,
      end_time: null,
      title:null,
      total: null,
      use_total: 1,
      amount: null,
      amount_limit: null,
      stock: null,
      enable: true,
    }
  },
  props: {
    id: {},
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
        this.requestCoupon()
      } else {
        this.init()
      }
    },
    init() {
      this.$nextTick(() => {
        this.$validator.reset();
      })
			this.start_date =  null
			this.start_time =  null
			this.end_date =  null
			this.end_time =  null
			this.title = null
			this.total =  null
			this.use_total =  1
			this.amount =  null
			this.amount_limit =  null
			this.stock =  null
			this.enable =  true
    },
    requestCoupon() {
      this.$http(this.$api.Coupon,'edit',{id:this.id}).then(({ data }) => {
        let result = data.result
        this.$formatTime(result)
        this.$toBool(result)
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
        if (result) {
          this.add_loading = true;
          let url = this.url
          let type = 'save'
          let params = {}
          let data = {
            title: this.title,
            total: this.total,
            use_total: this.use_total,
            amount: this.amount,
            amount_limit: this.amount_limit,
            enable: this.enable,
            start_time: this.start_date + ' ' + this.start_time,
            end_time: this.end_date + ' ' + this.end_time
          }
          if (this.id != undefined) {
            params.id = this.id
            type = 'update'
          }
          params.data = data
          this.$http(this.$api.Coupon,type,params).then( res => {
            this.$message({
              message: res.data.msg,
              type: 'success',
              onClose: () => {
                this.$router.push({ path: '/Coupon/List' })
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
