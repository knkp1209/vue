<template>
	<div>
		<el-upload
		  :action="base_url + '/admin/upload'"
		  list-type="picture-card"
		  drag
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
    };
  },
	props: {
	  imageUrls: { // 父组件的定义数据对象
	    required: true
	  },
    multiple: {
      required: true
    },
    max_size: {
      required: true
    },
    max_upload: {
      required: true
    }
	},
	methods: {
    handleRemove(file, fileList) {
      this.myDel(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response,file,fileList){
      this.myAdd(response)
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
    *	当前文件列表ID(ID由服务端返回) 废弃
    */
    currentFileList(fileList){
    	this.imageUrls = [];
    	Object.keys(fileList).forEach((item)=>{
        this.imageUrls.push(fileList[item]['response']['result'])
    	})
    },
    /*
    * 添加成功上传的图片ID
    */
    myAdd(response) {
      this.imageUrls.push(response['result'])
    },
    myDel(file) {
      let val = file['response']['result'];
      let index = this.imageUrls.indexOf(val);
      if (index > -1) {
        this.imageUrls.splice(index,1);
      }
    }
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