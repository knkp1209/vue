export default function (api) {
		let params = {
			data: {
				current_page: this.current_page,
				page_size: this.page_size,
			}
		};
		this.$http(api, 'index', params).then(({data}) => {
			this.total = data.total;
			this.table_data = data.list;
			this.page_size = data.page_size;
			this.current_page = data.current_page;
		}).catch(msg => {
			this.$message.error(msg)
		})
}
