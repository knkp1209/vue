import config from './config'
import axios from 'axios';

// export default (resource, type, params = { id: false, data: false, resources: false }) => { 上面这种写法获取不到 this
export default function (resource, type, params = { id: false, data: false }) {
  return new Promise((resolve, reject) => {
    if (this.$httpCount == 0) {
			this.$store.commit('Mloading', true);
    }
    this.$httpCount++;

    let request = {};
    if (type == 'create') {
      request.url = `${config.BaseUrl}/${resource}/create`
      request.method = 'get'
      if (params.data) {
        request.params = params.data
      }
    } else if (type == 'index') {
      request.url = `${config.BaseUrl}/${resource}`
      request.method = 'get'
      if (params.data) {
        request.params = params.data
      }
    } else if (type == 'read') {
      request.url = `${config.BaseUrl}/${resource}/${params.id}`
      request.method = 'get'
      if (params.data) {
        request.params = params.data
      }
    } else if (type == 'save') {
      request.url = `${config.BaseUrl}/${resource}`
      request.method = 'post'
      request.data = params.data
    } else if (type == 'update') {
      request.url = `${config.BaseUrl}/${resource}/${params.id}`
      request.method = 'put'
      request.data = params.data
    } else if (type == 'edit') {
			request.url = `${config.BaseUrl}/${resource}/${params.id}/edit`
			request.method = 'get'
			request.data = params.data
		} else if (type == 'delete') {
      request.url = `${config.BaseUrl}/${resource}/${params.id}`
      request.method = 'delete'
    } else if (type == 'batchDelete') {
			request.url = `${config.BaseUrl}/${resource}/batch`
			request.method = 'delete'
			request.data = params.data
    }
    request.dataType = 'json'
    axios(request).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error.response.data.msg)
			if (error.response.status === 401) { // 后端返回 401 说明要重新登录过期
				this.$router.push({name: 'Login'})
			}
    }).finally(() => {
      this.$httpCount--;
			if (this.$httpCount == 0) {
				this.$store.commit('Mloading', false);
			}
    })

  })
}
