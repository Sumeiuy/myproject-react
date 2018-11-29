/*
 * @Author: sunweibin
 * @Date: 2018-11-27 19:41:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 10:30:42
 * @description 机构客户联系方式配置项
 */
// 机构客户电话信息表格columns
export const ORG_PHONE_COLUMNS = [
  {
    key: 'mainFlag',
    dataIndex: 'mainFlag',
    title: '主要',
    width: 80,
  },
  {
    key: 'contractType',
    dataIndex: 'contractType',
    title: '联系人类型',
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '姓名',
  },
  {
    key: 'certificateType',
    dataIndex: 'certificateType',
    title: '证件类型',
  },
  {
    key: 'cretificateNo',
    dataIndex: 'cretificateNo',
    title: '证件号码',
  },
  {
    key: 'duty',
    dataIndex: 'duty',
    title: '职务',
  },
  {
    key: 'mobileNumber',
    dataIndex: 'mobileNumber',
    title: '手机号码',
  },
  {
    key: 'landlineNumber',
    dataIndex: 'landlineNumber',
    title: '固定电话',
  },
  {
    key: 'email',
    dataIndex: 'email',
    title: '电子邮件',
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 100,
  },
];
// 机构客户地址信息表格columns
export const ORG_ADDRESS_COLUMNS = [
  {
    key: 'mainFlag',
    dataIndex: 'mainFlag',
    title: '主要',
    width: 80,
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
// 个人客户|机构客户添加联系方式的Tabs
export const ADD_CONTACT_TABS = {
  phone: '电话信息',
  address: '地址信息',
  other: '其他信息'
};
// 添加|编辑联系方式弹出框的styles
export const MODAL_STYLE = {
  width: '780px',
};
export const FORM_STYLE = {
  width: '200px',
};
// 添加联系方式的提示
export const WARNING_MESSAGE = {
  per_phone: '请客户先通过线上自助或线下临柜的方式维护主联系方式',
  per_address: '请客户先通过线上自助或线下临柜的方式维护主要地址',
  per_other: '请客户先通过线上自助或线下临柜的方式维护主要邮箱',
  org_phone: '请客户先通过线上自助或线下临柜的方式维护主要联系人',
  org_address: '请客户先通过线上自助或线下临柜的方式维护主要地址',
};
// 编辑Modal的标题集合
export const MODAL_TITLES = {
  phone: '编辑电话信息',
  address: '编辑地址信息',
  other: '编辑其他信息',
};
