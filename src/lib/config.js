let base_url = null
let static_resource_url = null
if (process.env.NODE_ENV === 'development') { // 开发环境
  base_url = '/api'
  static_resource_url = 'http://t.com/uploads/';
} else {
  base_url = 'http://applet.site'
  static_resource_url = 'http://applet.site/uploads/';
}
export default {
	BaseUrl: base_url,
	StaticResourceUrl: static_resource_url,
	unselectedDeleteMs: 3000
}