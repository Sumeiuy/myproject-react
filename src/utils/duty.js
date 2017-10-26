/**
 * @Author: sunweibin
 * @Date: 2017-10-26 10:46:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-10-26 12:13:04
 * @description 华泰职责ID视图
 * duty的key值取名规范为中文拼音名称首字母小写,使用下划线'_'连接,value值为职责ID
 */

const duty = {
  htsc_syzbcx: '1-46IDNZI', // HTSC 首页指标查询匹配值
  htsc_zhfw_yybzxg: '1-FCQM-34', // HTSC 综合服务-营业部执行岗
  htsc_yybfwg: '1-619Q', // HTSC 营业部服务岗
  htsc_fwjl: '1-6198', // HTSC 服务经理
  htsc_plyjsz: '1-3F4YMKW', // HTSC 批量佣金设置
  htsc_htggst: '1-FCQM-2', // HTSC 华泰公共视图
  htsc_xsfu_zbzxg: '1-FCQM-29', // HTSC 销售服务-总部执行岗
  htsc_hlwfwjl: '1-45X0P96', // HTSC 互联网服务经理
};

export const commission = {
  batch: [duty.htsc_plyjsz], // 批量佣金调整的权限
  single_1: [duty.htsc_zhfw_yybzxg, duty.htsc_yybfwg], // 单佣金调整的权限-1,此种权限需要必须是:岗位为服务岗
  single_2: [duty.htsc_hlwfwjl], // 单佣金调整的权限-2
  subscribe: [duty.htsc_zhfw_yybzxg, duty.htsc_yybfwg, duty.htsc_fwjl, duty.htsc_htggst], // 资讯订阅
  unsubscribe: [duty.htsc_zhfw_yybzxg, duty.htsc_yybfwg, duty.htsc_fwjl, duty.htsc_htggst], // 资讯退订
};

export default duty;
