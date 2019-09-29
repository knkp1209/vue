let admin = 'admin';
let _super = 'super'; // 加下划线避免关键字冲突
export default {
	GeeTest: 'geetest',
	Login: `${admin}/login`,
	Logout: `${admin}/logout`,
	Fn: `${_super}/fns`, // Resource
	Role: `${_super}/roles`, // Resource
	Account: `${_super}/accounts`, // Resource
	'Accounts-deleted': `${_super}/accounts-deleted`, // Get
	'Accounts-clean': `${_super}/accounts-clean`, // Delete
	'Provinces-Cities':`${admin}/provinces/cities`, // Get
	Config: `${admin}/config`,
	Upload: `/${admin}/upload`,
	Banners: `${admin}/banners`,
	Category: `${admin}/categories`,
	Goods: `${admin}/goods`,
	Specs:`${admin}/specs`,
	Freights: `${admin}/freights`,
	Labels: `${admin}/labels`,
	Flash: `${admin}/productFlash`,
	Team: `${admin}/productTeams`,
	Module: `${admin}/modules`,
	Coupon: `${admin}/coupons`,
}