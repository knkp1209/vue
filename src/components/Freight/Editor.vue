<template>
  <div class="fright_editor">
    <el-form label-position="right" label-width="100px">
      <el-form-item label="模板名称">
        <el-input v-model="name" name="name" v-validate="'required|max:200'" placeholder="运费名称 (必填)"></el-input>
        <i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
      </el-form-item>
      <el-form-item label="计价方式">
        <el-radio v-model="pricing_method" label="QTY">按件数</el-radio>
        <el-radio v-model="pricing_method" label="WEIGHT">按重量</el-radio>
      </el-form-item>
      <el-form-item label="运费设置">
        <div class="freight">
          <div>
            <div>
              <span>除指定地区外，其余地区的运费采用“默认运费”</span>
            </div>
            <span>默认运费：</span>
            <el-input v-model="init" name="init" v-validate="'required|numeric|min_value:0|max_value:99999999'">
            </el-input>
            <span v-if="pricing_method == 'QTY'">件内</span>
            <span v-else-if="pricing_method == 'WEIGHT'">克内</span>
            <el-input v-model="init_fee" name="init_fee" v-validate="'required|decimal:2|numeric|min_value:0|max_value:99999999'">
            </el-input>
            <span>元，<br />每增加</span>
            <el-input v-model="exceed" name="exceed" v-validate="'required|numeric|min_value:0|max_value:99999999'">
            </el-input>
            <span v-if="pricing_method == 'QTY'">件</span>
            <span v-else-if="pricing_method == 'WEIGHT'">克</span>
            <span>，增加运费</span>
            <el-input v-model="exceed_fee" name="exceed_fee" v-validate="'required|decimal:2|numeric|min_value:0|max_value:99999999'">
            </el-input>
            <span>元</span>
            <div>
              <i class="my_err" v-show="errors.has('init')">{{errors.first('init')}}</i>
              <i class="my_err" v-show="errors.has('init_fee')">{{errors.first('init_fee')}}</i>
              <i class="my_err" v-show="errors.has('exceed_fee')">{{errors.first('exceed_fee')}}</i>
            </div>
          </div>
          <div v-for="(item,i) in regions" :key="i" class="region">
            <div class="choose_region">
              <address-list @emitRegion="(cites) => getRegion(cites,i)"></address-list>
            </div>
            <div class="region_list">
              <el-tag size="mini" v-for="(city,j) in item.region_list" :key="j">{{city['name']}}</el-tag>
            </div>
            <div class="freight_set">
              <el-input v-model="item.init" :name="'init_' + i" v-validate="'required|numeric|min_value:0|max_value:99999999'">
              </el-input>
              <span v-if="pricing_method == 'WEIGHT'">克内</span>
              <span v-else-if="pricing_method == 'QTY'">件内</span>
              <el-input v-model="item.init_fee" :name="'init_fee_' + i" v-validate="'required|decimal:2|numeric|min_value:0|max_value:99999999'">
              </el-input>
              <span>元，<br />每增加</span>
              <el-input v-model="item.exceed" :name="'exceed_' + i" v-validate="'required|numeric|min_value:0|max_value:99999999'">
              </el-input>
              <span v-if="pricing_method == 'WEIGHT'">克</span>
              <span v-else-if="pricing_method == 'QTY'">件</span>
              <span>，增加运费</span>
              <el-input v-model="item.exceed_fee" :name="'exceed_fee_' + i" v-validate="'required|decimal:2|numeric|min_value:0|max_value:99999999'">
              </el-input>
              <span>元</span>
              <el-button type="danger" size="mini" @click="delRegion(i)">
                删除
              </el-button>
              <div>
                <i class="my_err" v-show="errors.has('init_' + i)">{{errors.first('init_' + i)}}</i>
                <i class="my_err" v-show="errors.has('init_fee_' + i)">{{errors.first('init_fee_' + i)}}</i>
                <i class="my_err" v-show="errors.has('exceed_fee_' + i)">{{errors.first('exceed_fee_' + i)}}</i>
              </div>
            </div>
          </div>
          <div>
            <el-button type="primary" size="mini" @click="addRegion">
              <i class="el-icon-plus"></i>
              为指定地区设置运费
            </el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="footer" v-loading="add_loading">
      <el-button @click="cancel">取 消</el-button>
      <el-button @click="post" type="primary">{{op_name}}</el-button>
    </div>
  </div>
</template>
<script>
import AddressList from '@/components/Freight/AddressList'
export default {
  name: 'Freight_Editor',
  data() {
    return {
      regions: [],
      init: '',
      exceed: '',
      init_fee: '',
      exceed_fee: '',
      op_name: '添 加',
      pricing_method: 'QTY',
      add_loading: false,
      name: '',
    }
  },
  props: {
    id: {},
    part: {},
  },
  components: { AddressList },
  created() {},
  methods: {
    addRegion() {
      this.regions.push({
        init: '',
        init_fee: '',
        exceed_fee: '',
        region_list: []
      })
    },
    delRegion(i) {
      this.regions.splice(i, 1)
    },
    getRegion(cites, i) {
      this.regions[i].region_list = cites
    },
    post() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.add_loading = true
          let url = this.url
          let type = 'save'
          let data = {
            name: this.name,
            pricing_method: this.pricing_method,
            init: this.init,
            exceed: this.exceed,
            init_fee: this.init_fee,
            exceed_fee: this.exceed_fee,
            regions: this.regions
          }
          this.$http(this.$api.Freights,'save',{data:data}).then( res => {
            this.$message.success(res.data.msg);
          }).catch( msg => {
            this.$message.error(msg);
          }).finally(res =>{
            this.add_loading = false
          })
        }
      })
    },
    cancel() {
      if (this.part == true) {
        this.$store.commit('MvisibleCategory', false)
      }
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
<style>
.fright_editor {
  background: #FFFFFF;
  text-align: center;
  padding: 20px 0;
}

.fright_editor .el-form {
  width: 80%;
  margin: 0 auto;
}

.fright_editor .footer {
  margin-top: 15px;
}

.freight {
  width: 100%;
  /*background: blue;*/
  border: 1px solid #DCDCDC;
}

.freight>div {
  margin-bottom: 5px;
}

.freight .el-input {
  width: 50px;
}

.freight input {
  text-align: center;
  padding: 0 5px;
  height: 20px;
}

.freight .region {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 5px 5px;
  border-top: 1px solid #DCDCDC;
}

.freight .region .region_list {
  text-align: left;
}

.freight .region .region_list .el-tag {
  margin-left: 4px;
}


.freight .region .choose_region {
  flex: 1;
}

.freight .freight_set {
  flex: 2;
  min-width: 300px;
}

</style>
