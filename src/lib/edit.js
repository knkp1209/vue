export default function (api,data,module) {
	this.$validator.validateAll().then(result => {
		if (result) {
			this.add_loading = true;
			let type = 'save'
			let params = {}
			if (this.id != undefined) {
				params.id = this.id
				type = 'update'
			}
			params.data = data
			this.$http(api,type,params).then( ({msg}) => {
				this.$message({
					message: msg,
					type: 'success',
					duration: 500,
					onClose: () => {
						this.$activationNav('/' + module + '/List')
					}
				});
			}).catch( msg => {
				this.$message.error(msg)
				this.add_loading = false;
			})
		}
	})
}
