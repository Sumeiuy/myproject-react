/**
 * @Author: sunweibin
 * @Date: 2018-08-07 18:29:24
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-15 13:37:55
 * @description 通用审批人弹框配置项
 */

export const APPROVER_TABLE_COLUMNS = [
  {
    dataIndex: 'empNo',
    key: 'empNo',
    title: '工号',
    width: 120,
  },
  {
    dataIndex: 'empName',
    key: 'empName',
    title: '姓名',
    width: 120,
  },
  {
    dataIndex: 'belowDept',
    key: 'belowDept',
    title: '所属营业部',
  },
];

// 分配处理人的搜索框组件的 style prop
export const SERACH_INPUT_STYLE = { width: '240px' };

// 处理人表格的垂直滚动配置
export const APPROVER_TABLE_SCROLL = { y: 294 };
