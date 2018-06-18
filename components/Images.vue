<template>
	<div>
		<el-upload
		  action="/api/index/index/upload"
		  list-type="picture-card"
		  drag
		  :on-preview="handlePictureCardPreview"
		  :on-remove="handleRemove"
		  :on-success="handleSuccess"
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
    /*
    *	当前文件列表ID(ID由服务端返回)
    */
    currentFileList(fileList){
    	this.imageId = [];
    	Object.keys(fileList).forEach((item)=>{
    		this.imageId.push(fileList[item]['response']['result'])
    	})
    },
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