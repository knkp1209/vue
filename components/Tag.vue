<template>
  <div>
    <el-tag :key="index" v-for="(tag,index) in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input class="input-new-tag" name="n_tip" v-validate="'max:10'" :placeholder="tip" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
    <i class="my_err" v-show="errors.has('n_tip')">{{errors.first('n_tip')}}</i>
  </div>
</template>
<script>
export default {
  name: 'Tag',
  data() {
    return {
      dynamicTags: this.storeName,
      inputVisible: false,
      inputValue: ''
    }
  },
  props: {
    storeName: { // 父组件的定义数据对象
      required: true
    },
    tip: {

    }
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.$validator.validateAll().then(result => {
          if (result) {
            this.dynamicTags.push(inputValue);
          }
        })
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}

</script>
<style scoped>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  height: 32px;
  line-height: 30px;
  margin-left: 10px;
  padding-bottom: 0;
  padding-top: 0;
}

.input-new-tag {
  margin-left: 10px;
  vertical-align: bottom;
  width: 180px;
  font-size: 12px;
}

</style>
