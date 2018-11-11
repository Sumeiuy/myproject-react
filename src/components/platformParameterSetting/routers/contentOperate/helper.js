/*
* @function: 通过a标签解析url标签
* @param:url  url参数是字符串，解析的目标
*/

/* eslint-disable */
function parseURL(url) {
  //创建一个a标签
  var a =  document.createElement('a');
  //将url赋值给标签的href属性。
  a.href = url;
  return {
      source: url,
      protocol: a.protocol.replace(':',''), //协议
      host: a.hostname,   //主机名称
      port: a.port,   //端口
      query: a.search,  //查询字符串
      params: (function(){  //查询参数
        let ret = {},
            seg = a.search.replace(/^\?/,'').split('&'),
            len = seg.length, i = 0, s;
        for (;i<len;i++) {
            if (!seg[i]) { continue; }
            s = seg[i].split('=');
            ret[s[0]] = s[1];
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1], //文件名
      hash: a.hash.replace('#',''), //哈希参数
      path: a.pathname.replace(/^([^\/])/,'/$1'), //路径
      pathname: a.pathname,
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  //相对路径
      segments: a.pathname.replace(/^\//,'').split('/') //路径片段
  };
}
/* eslint-enable */

// 过滤数据
function filterData(data, key) {
  const filterData = [];
  if (data) {
    data.forEach(item => {
      filterData.push(item[key]);
    });
  }
  return filterData;
}
const activityColumnHelper = {
  parseURL,
  filterData,
};


export default activityColumnHelper;
export {
  parseURL,
  filterData,
};
