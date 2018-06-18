<template>
	<div>
		<el-upload
		  action="/api/index/index/upload"
		  list-type="picture-card"
		  drag
		  :limit="maxUpload"
		  :on-preview="handlePictureCardPreview"
		  :on-remove="handleRemove"
		  :on-success="handleSuccess"
		  :on-exceed="handleExceed"
		  :before-upload="handleBeforeUpload"
		  multiple>
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
      imageId:[],
    };
  },
	props: {
	  storeName: { // 父组件的定义数据对象
	    required: true
	  }
	},
	methods: {
    handleRemove(file, fileList) {
      this.currentFileList(fileList)
      this.$emit('imageIds',this.imageId,this.storeName)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response,file,fileList){
    	this.currentFileList(fileList)
    	this.$emit('imageIds',this.imageId,this.storeName)
    },
    handleExceed(files, fileList){
    	this.$message.error('图片最多上传' + this.$store.state.maxUpload + '张')
    },
    handleBeforeUpload(file){
      const isLt2M = file.size / 1024 / 1024 < this.$store.state.maxSize;

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    /*
    *	当前文件列表ID(ID由服务端返回)
    */
    currentFileList(fileList){
    	this.imageId = [];
    	Object.keys(fileList).forEach((item)=>{
    		this.imageId.push(fileList[item]['response']['result'])
    	})
    },
  },
  computed: {
    maxUpload () {
      return this.$store.state.maxUpload;
    }
  }
}
</script>

<style scoped>
</style>
<style>
.el-upload-dragger {
  width: 230px;
  height: 150px;
}
.el-upload--picture-card{
	width:auto;
	height:auto;
}
</style>