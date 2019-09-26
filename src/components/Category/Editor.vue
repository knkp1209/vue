<template>
  <div class="main">
    <el-form label-position="right" label-width="80px">
      <el-form-item label="父级分类">
        <el-select v-model="pid" filterable placeholder="请选择" :disabled="pid_disabled">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="name" name="name" v-validate="'required|max:200'" placeholder="分类名称 (必填)"></el-input>
        <i class="my_err" v-show="errors.has('name')">{{errors.first('name')}}</i>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="sort" name="sort" v-validate="'numeric|min_value:0|max_value:99999999'" placeholder="填写的数字越大，排序越靠前"></el-input>
        <i class="my_err" v-show="errors.has('sort')">{{errors.first('sort')}}</i>
      </el-form-item>
      <el-form-item label="显示">
        <el-checkbox label="是" v-model="show"></el-checkbox>
      </el-form-item>
      <el-form-item label="首页显示">
        <el-checkbox label="是" v-model="i_show"></el-checkbox>
      </el-form-item>
      <el-form-item label="图片">
        <my-image v-if="$store.state.config" key="category" name="category" @emit_set_img="setImgUrl" :imageUrl="img_url" :max_size="max_size" :max_upload="1"></my-image>
      </el-form-item>
    </el-form>
    <span class="my_tip">父级分类可不选，不选父级分类时，添加的分类为最高顶级分类</span>
    <div class="footer" v-loading="add_category_loading">
      <el-button @click="cancel">取 消</el-button>
      <el-button @click="post" type="primary">{{op_name}}</el-button>
    </div>
  </div>
</template>
<script>
import MyImage from '@/components/MyImage'
export default {
  name: 'Category_Editor',
  data() {
    return {
      op_name: '添 加',
      add_category_loading: false,
      pid_disabled: false,
      img_url: '',
      name: '',
      sort: '',
      show: true,
      i_show: false,
      pid: ''
    }
  },
  computed: {
    options() {
      return this.$store.state.topCategoryList
    },
    max_size() {
      return this.$store.state.config.maxSize.value
    }
  },
  props: {
    id: {},
    part: {},
  },
  components: { MyImage },
  created() {
    if (this.id != undefined) {
      this.pid_disabled = true
      if (this.$route.params.category == undefined) {
        this.$router.push({ path: '/Category/List' })
        return false;
      }
      let category = this.$route.params.category;
      this.name = category.name
      if (category.pid != 0) {
        this.pid = category.pid
      }
      this.sort = category.sort
      this.show = !category.hidden
      this.i_show = !category.i_hidden
      this.img_url = category.url
      this.op_name = '更 新'
    }
    if (this.options.length == 0) {
      this.init();
    }
  },
  methods: {
    init() {
      this.$http(this.$api.Categories, 'index').then( res => {
        let { msg, result } = res.data
        this.$store.commit('MtopCategoryList', result)
      }).catch(msg => {
        this.$message.error(msg)
      })
    },
    post() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.add_category_loading = true;
          let type = 'save'
          let params = {}
          let data = {
            hidden: !this.show,
            i_hidden: !this.i_show,
            sort: this.sort,
            name: this.name,
            url: this.img_url
          }
          if (this.id != undefined) {
            params.id = this.id
            type = 'update'
          }
          if (this.pid == '') {
            data.pid = 0;
          } else {
            data.pid = this.pid;
          }
          params.data = data
          this.$http(this.$api.Categories, type, params).then( res => {
            if (this.part == true) {
              this.$store.commit('MvisibleCategory', false)
            }
            let { msg, result } = res.data
            this.add_category_loading = false;
            if (this.id == undefined) {
              this.pid = '';
              this.name = '';
              if (data.pid == 0) {
                this.options.push(result);
              } else {
                for (var i = 0; i < this.options.length; i++) {
                  if (this.options[i].id == data.pid) {
                    if (this.options[i].children === undefined) {
                      this.options[i].children = [];
                    }
                    this.options[i].children.push(result);
                    break;
                  }
                }
              }
            } else {
              for (var i = 0; i < this.options.length; i++) {
                if (this.options[i].id == this.id) {
                  result.children = this.options[i].children
                  this.options.splice(i, 1, result)
                  break;
                } else {
                  if (this.options[i].children != undefined) {
                    for (var j = 0; j < this.options[i].children.length; j++) {
                      if (this.options[i].children[j].id == this.id) {
                        this.options[i].children.splice(j, 1, result);
                        break;
                      }
                    }
                  }
                }
              }
            }
            this.$message({
              message: msg,
              type: 'success'
            });
          }).catch(function(err) {

            if (this.id == undefined) {
              this.pid = '';
              this.name = '';
            }
            if (this.part == true) {
              this.$store.commit('MvisibleCategory', false)
            }
            this.$message({
              message: '添加失败',
              type: 'error'
            });
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
</style>
