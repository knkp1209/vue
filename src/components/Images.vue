<template>
  <div>
    <el-upload :ref="name"
      :action="$config.BaseUrl + $api.Upload"
      list-type="picture-card"
      drag
      :file-list="fileList"
      :limit="max_upload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
      :multiple ="multiple">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'Images',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList:[],
    };
  },
  created() {
    let temp = {};
    for(let i = 0; i < this.imageUrls.length; i++) {
      temp = {
        url: this.$config.StaticResourceUrl  + this.imageUrls[i]['url'],
        response:{data:this.imageUrls[i]},
      }
      this.fileList.push(temp);
    }
    if (this.imageUrls.length >= this.max_upload) {
      this.$nextTick(() => {
        this.$refs[this.name].$el.children[1].style.display = 'none';
      })
    }
  },
  props: {
    imageUrls: { // 父组件的定义数据对象
      required: true,
    },
    multiple: {
      required: true
    },
    max_size: {
      required: true
    },
    max_upload: {
      required: true
    },
    name: {
      required: true //
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.myDel(file)
      this.$refs[this.name].$el.children[1].style.display = 'inline-block';
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response,file,fileList){
      this.myAdd(response)
      if (fileList.length == this.max_upload){
        this.$refs[this.name].$el.children[1].style.display = 'none';
      }
    },
    handleExceed(files, fileList){
      this.$message.error('图片最多上传' + this.max_upload + '张')
    },
    handleBeforeUpload(file){
      const isLt2M = file.size <= this.max_size * 1024 * 1024;

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过' +  this.max_size + 'MB!');
      }
      return isLt2M;
    },
    /*
    * 添加成功上传的图片ID
    */
    myAdd(response) {
      this.imageUrls.push(response['data'])
    },
    myDel(file) {
      let val = file['response']['data'];
      let index = this.imageUrls.indexOf(val);
      if (index > -1) {
        this.imageUrls.splice(index,1);
      }
    },
  }
}
</script>

<style scoped>
</style>
<style>
.el-upload-dragger {
  width: 230px !important;
  height: 150px !important;
}
.el-upload--picture-card{
  width:auto !important;
  height:auto !important;
}
</style>