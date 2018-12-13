/*
 * @Author: sunweibin
 * @Date: 2018-11-26 16:01:55
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 13:56:17
 * @description 客户属性中的个人客户需要用的配置项
 */

// 个人客户联系方式，弹出层中电话信息表格的colums
export const PHONE_COLUMNS = [
  {
    key: 'mainFlag',
    dataIndex: 'mainFlag',
    title: '主要',
    width: 28,
  },
  {
    key: 'contactWay',
    dataIndex: 'contactWay',
    title: '联系方式',
    width: 56,
  },
  {
    key: 'phoneNumber',
    dataIndex: 'phoneNumber',
    title: '号码',
    width: 97,
  },
  {
    key: 'source',
    dataIndex: 'source',
    title: '来源',
    width: 72,
    needEllipse: true,
  },
  {
    key: 'modifyTime',
    dataIndex: 'modifyTime',
    title: '更新时间',
    width: 138,
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 42,
  },
];
// 个人客户联系方式，弹出层中地址信息表格的columns
export const ADDRESS_COLUMNS = [
  {
    key: 'mainFlag',
    dataIndex: 'mainFlag',
    title: '主要',
    width: 28,
  },
  {
    key: 'addressType',
    dataIndex: 'addressType',
    title: '地址类型',
    width: 56,
    needEllipse: true,
  },
  {
    key: 'address',
    dataIndex: 'address',
    title: '地址',
    width: 264,
    needEllipse: true,
  },
  {
    key: 'zipCode',
    dataIndex: 'zipCode',
    title: '邮编',
    width: 50,
  },
  {
    key: 'country',
    dataIndex: 'country',
    title: '国家/地区',
    width: 63,
  },
  {
    key: 'province',
    dataIndex: 'province',
    title: '省/(直辖)市',
    width: 98,
    needEllipse: true,
  },
  {
    key: 'city',
    dataIndex: 'city',
    title: '城市',
    width: 56,
    needEllipse: true,
  },
  {
    key: 'source',
    dataIndex: 'source',
    title: '来源',
    width: 72,
    needEllipse: true,
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 42,
  },
];
// 个人客户联系方式，弹出层中其他信息表格的columns
export const OTHER_COLUMNS = [
  {
    key: 'mainFlag',
    dataIndex: 'mainFlag',
    title: '主要',
    width: 28,
  },
  {
    key: 'contactWay',
    dataIndex: 'contactWay',
    title: '联系方式',
    width: 56,
  },
  {
    key: 'contactText',
    dataIndex: 'contactText',
    title: '号码',
    width: 252,
    needEllipse: true,
  },
  {
    key: 'source',
    dataIndex: 'source',
    title: '来源',
    width: 72,
    needEllipse: true,
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 42,
  },
];
