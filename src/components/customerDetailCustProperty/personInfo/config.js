/*
 * @Author: sunweibin
 * @Date: 2018-11-26 16:01:55
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-26 17:04:55
 * @description 客户属性中的个人客户需要用的配置项
 */

// 个人客户联系方式，弹出层中电话信息表格的colums
export const PHONE_COLUMNS = [
  {
    key: 'mainFlag',
    dataIndex: 'mainFlag',
    title: '主要',
    width: 100,
  },
  {
    key: 'phoneNumber',
    dataIndex: 'phoneNumber',
    title: '号码'
  },
  {
    key: 'source',
    dataIndex: 'source',
    title: '来源'
  },
  {
    key: 'contactWay',
    dataIndex: 'contactWay',
    title: '联系方式'
  },
  {
    key: 'modifyTime',
    dataIndex: 'modifyTime',
    title: '更新时间'
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 100,
  },
];
