export default function (module) {
	if (this.selected_ids.length == 0) {
		this.$message({
			message: this.$tips.unselectedDelete,
			type: 'warning',
			duration: this.$config.unselectedDeleteMs
		});
		return;
	}
	this.$confirm('请核对删除信息, 是否继续?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		this.$http(this.$api[module],'batchDelete',{data:this.selected_ids}).then(() => {
			this.$message.success('删除成功');
			this.requestData();
		}).catch(msg => {
			this.$message.error(msg);
		})
	}).catch(() => {
		this.$message({
			type: 'info',
			message: '已取消删除'
		});
	});
}
