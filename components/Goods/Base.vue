<template>
  <div class="goods_base">
    <template v-if="$store.state.visibleCategory">
      <el-dialog width="550px" title="添加分类" center :visible.sync="$store.state.visibleCategory">
        <category :part="true"></category>
      </el-dialog>
    </template>
    <el-form label-width="80px">
      <el-row type="flex" justify="left">
        <el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
          <el-form-item label="名称">
            <el-input v-model="base.name" name="name" v-validate="'required|max:200'" placeholder="商品名称 (必填)"></el-input>
            <i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="left">
        <el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
          <el-form-item label="单位">
            <el-input v-model="base.unit" name="unit" v-validate="'max:10'" placeholder="计件单位。如:件,箱,个"></el-input>
            <i class="my_err" v-show="errors.has('unit')">{{errors.first('unit')}}</i>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="left">
        <el-col :xs="24" :sm="24" :md="16" :lg="8" :xl="8">
          <el-form-item label="排序">
            <el-input v-model="base.sort" name="sort" v-validate="'numeric|min_value:0|max_value:99999999'" placeholder="填写的数字越大，排序越靠前"></el-input>
            <i class="my_err" v-show="errors.has('sort')">{{errors.first('sort')}}</i>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="left">
        <el-form-item label="分类">
          <div>
            <el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="18">
              <el-row type="flex" :gutter="10">
                <el-col :span="11">
                  <el-select v-model="base.cat_id" filterable multiple style="width: 100%;" placeholder="请选择" @change="getSub">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="11">
                  <el-select v-model="base.sub_cat_id" filterable multiple style="width: 100%;" placeholder="请选择">
                    <el-option v-for="item in options_sub" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="1">
                  <el-button size="mini" type="primary" @click="$store.commit('MvisibleCategory',true)">添加分类</el-button>
                </el-col>
              </el-row>
            </el-col>
          </div>
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="left">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
          <el-form-item label="上下架">
            <el-switch v-model="base.is_shelf" active-text="上架" inactive-text="下架">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="left">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
          <el-form-item label="商品参数">
            <dynamic-input :parameters="base.parameters" :tip_name="'上市时间'" :tip_value="'2018年8月20日'"></dynamic-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="left">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
          <el-form-item label="服务承诺">
            <tag key="promise" :dynamic-tags="base.promise" :tip="'例如：包邮 正品保证 七天退换'"></tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="left">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
          <el-form-item label="商品卖点">
            <tag key="mark" :dynamic-tags="base.mark" :tip="'例如：热卖 新品'"></tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="left">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
          <el-form-item label="运费模板">
            <el-select v-model="base.freight_id" placeholder="请选择">
              <el-option v-for="(item,i) in freights" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="left">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
          <el-form-item label="首页卖点">
            <tag v-if="$store.state.appSet" key="home_mark" :dynamic-tags="home_mark.value" :tip="'例如：热卖 新品'"></tag>
          </el-form-item>
          <p style="padding-left: 15px; color:#FF8F59;" v-if="$store.state.appSet">
            {{home_mark.remark}}
            <br />
            <el-button type="primary" size="mini" @click="submitHome">保存首页卖点</el-button>
            <i class="el-icon-back">只有点这里才会保存首页卖点哦</i>
          </p>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Tag from '@/components/Tag'
import DynamicInput from '@/components/DynamicInput'
// import Category from '@/components/Category'
export default {
  name: 'Goods_Base',
  data() {
    return {
      options_sub: [],
      freights: [{
        id: 0,
        name: '包邮（不使用运费模板）'
      }]
    }
  },
  props: {
    base: { // 商品基本信息
      type: Object,
      required: true,
    }
  },
  created() {
    this.getFreights()
    if (this.options.length == 0) {
      this.getOption();
    } else {
      this.getSub(this.base.pid_cat_id);
    }
  },
  computed: {
    options() {
      return this.$store.state.topCategoryList
    },
    home_mark() {
      return this.$store.state.appSet.goodsMark
    }
  },
  components: {
    Tag,
    DynamicInput,
    'category': () =>
      import('@/components/Category/Editor')
  },
  methods: {
    getSub(val) {
      this.options_sub = [];
      val.forEach((id) => {
        for (var i = 0; i < this.options.length; i++) {
          if (this.options[i].id == id) {
            if (this.options[i].children !== undefined) {
              this.options_sub.push.apply(this.options_sub, this.options[i].children);
            }
            break;
          }
        }
      })
    },
    getOption() {
      let result = [];
      this.$ajax({
        dataType: 'json',
        method: 'get',
        url: this.base_url + '/admin/categories',
      }).then((res) => {
        result = res.data.result
        this.$store.commit('MtopCategoryList', result)
        this.getSub(this.base.pid_cat_id);
      }).catch((err) => {
        console.log(err)
        // alert('页面异常，请手动刷新页面，按 F5 ')
      })
    },
    submitHome() {
      var method = 'post';
      var data = { goodsMark: this.home_mark.value }
      var url = this.base_url + '/admin/app';
      this.$ajax({
        dataType: 'json',
        method: method,
        url: url,
        data: data
      }).then((res) => {
        this.$message.success('保存首页卖点成功')
      }).catch((err) => {
        console.log(err)
        this.$message.error('保存失败')
      })
    },
    getFreights() {
     var url = this.base_url + '/admin/freights';
      this.$ajax({
        dataType: 'json',
        method: 'get',
        url: url,
      }).then((res) => {
        console.log(res)
        console.log()
        this.freights.push.apply(this.freights,res.data.result)
      }).catch((err) => {
        console.log(err)
        this.$message.error('获取运费模板失败')
      })
    }
  }
}

</script>
<style>
.goods_base .el-tag+.el-tag {
  margin-left: 10px;
}

.goods_base .button-new-tag {
  height: 32px;
  line-height: 30px;
  margin-left: 10px;
  padding-bottom: 0;
  padding-top: 0;
}

.goods_base .input-new-tag {
  margin-left: 10px;
  vertical-align: bottom;
  width: 180px;
  font-size: 12px;
}

.goods_base .el-dialog__body {
  padding-bottom: 0px;
  padding-top: 0px;
}

</style>
