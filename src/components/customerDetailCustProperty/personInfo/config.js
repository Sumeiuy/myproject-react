/*
 * @Author: sunweibin
 * @Date: 2018-11-26 16:01:55
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 20:32:49
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
// 个人客户联系方式，弹出层中地址信息表格的columns
export const ADDRESS_COLUMNS = [
  {
    key: 'mainFlag',
    dataIndex: 'mainFlag',
    title: '主要',
    width: 100,
  },
  {
    key: 'addressType',
    dataIndex: 'addressType',
    title: '地址类型',
  },
  {
    key: 'address',
    dataIndex: 'address',
    title: '地址',
  },
  {
    key: 'zipCode',
    dataIndex: 'zipCode',
    title: '邮编',
  },
  {
    key: 'country',
    dataIndex: 'country',
    title: '国家/地区',
  },
  {
    key: 'province',
    dataIndex: 'province',
    title: '省/(直辖)市',
  },
  {
    key: 'city',
    dataIndex: 'city',
    title: '城市',
  },
  {
    key: 'source',
    dataIndex: 'source',
    title: '来源',
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 100,
  },
];
// 个人客户联系方式，弹出层中其他信息表格的columns
export const OTHER_COLUMNS = [
  {
    key: 'mainFlag',
    dataIndex: 'mainFlag',
    title: '主要',
    width: 100,
  },
  {
    key: 'contactWay',
    dataIndex: 'contactWay',
    title: '联系方式',
  },
  {
    key: 'contactText',
    dataIndex: 'contactText',
    title: '号码',
  },
  {
    key: 'source',
    dataIndex: 'source',
    title: '来源',
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 100,
  },
];
// 个人客户添加联系方式，Tab
export const ADD_CONTACT_TABS = {
  phone: '电话信息',
  address: '地址信息',
  other: '其他信息'
};
