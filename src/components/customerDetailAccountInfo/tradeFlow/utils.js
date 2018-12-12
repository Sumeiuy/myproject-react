/*
 * @Author: sunweibin
 * @Date: 2018-12-07 09:25:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-07 09:49:30
 * @description 交易流水的辅助函数
 */
import _ from 'lodash';

// 将接口返回的分页器数据转换成分页器组件的props
export function getPage(page = {}) {
  return {
    pageSize: 10,
    current: page.pageNum || 1,
    total: page.totalCount || 0,
  };
}
// 针对表格中空数字列的展示
export function displayEmpty(text, record) {
  if (_.isNull(text)) {
    return '-';
  }
  if (record.flag) {
    // 表示空数据
    return '';
  }
  return '';
}
