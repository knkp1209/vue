import lazyLoading from './lazyLoading'
export default (routers,data) => {
  //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
  //所以这里要做一些转换
  generaMenu(routers,data)
}
function generaMenu(routers,data){
    data.forEach((item)=>{
        item.component = lazyLoading(item.component)
        if (item.leaf == 0 || item.leaf == 2){
            let temp = item.children;
            item.children = [];
            generaMenu(item.children,temp)
        }
        routers.push(item)
    })
}