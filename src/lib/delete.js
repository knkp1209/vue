export default function (index, row, api) {
		let id = row.id;
		row.id = false;
		this.$confirm('请核对删除信息, 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			this.$http(api, 'delete', {id: id}).then(res => {
				this.$message.success('删除成功');
				/* 只有全部删除才重新获取
				this.table_data.splice(index, 1);
				this.total = this.total - 1;
				// 当前页数据全部删除，重新获取
				if (this.table_data.length == 0 && this.total > 0) {
					this.requestData();
				}
				*/
				// 只有删除就重新获取
				this.requestData();
			}).catch(msg => {
				row.id = id;
				this.$message.error(msg);
			})
		}).catch(() => {
			row.id = id;
			this.$message({
				type: 'info',
				message: '已取消删除'
			});
		});
}
