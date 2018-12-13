/*
 * @Author: sunweibin
 * @Date: 2018-11-27 19:41:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 13:48:25
 * @description 机构客户联系方式配置项
 */
// 机构客户电话信息表格columns
export const ORG_PHONE_COLUMNS = [
  {
    key: 'mainFlag',
    dataIndex: 'mainFlag',
    title: '主要',
    width: 28,
  },
  {
    key: 'contractType',
    dataIndex: 'contractType',
    title: '联系人类型',
    width: 112,
    needEllipse: true,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '姓名',
    width: 42,
    needEllipse: true,
  },
  {
    key: 'certificateType',
    dataIndex: 'certificateType',
    title: '证件类型',
    width: 126,
  },
  {
    key: 'cretificateNo',
    dataIndex: 'cretificateNo',
    title: '证件号码',
    width: 148,
  },
  {
    key: 'duty',
    dataIndex: 'duty',
    title: '职务',
    width: 70,
    needEllipse: true,
  },
  {
    key: 'mobile',
    dataIndex: 'mobile',
    title: '手机号码',
    width: 91,
  },
  {
    key: 'landline',
    dataIndex: 'landline',
    title: '固定电话',
    width: 105,
  },
  {
    key: 'email',
    dataIndex: 'email',
    title: '电子邮件',
    width: 120,
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 42,
  },
];
// 机构客户地址信息表格columns
export const ORG_ADDRESS_COLUMNS = [
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
  },
  {
    key: 'address',
    dataIndex: 'address',
    title: '地址',
    width: 264,
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
  },
  {
    key: 'city',
    dataIndex: 'city',
    title: '城市',
    width: 56,
  },
  {
    key: 'source',
    dataIndex: 'source',
    title: '来源',
    width: 72,
  },
  {
    key: 'operate',
    dataIndex: 'operate',
    title: '操作',
    width: 42,
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

// 来源Code
export const SOURCE_CODE = {
  // 理财平台Code
  finance: '102330',
  // ORCM来源的Code
  ocrm: '102030',
  // 客户服务中心
  custCenter: '102330',
  // 涨乐财付通
  zhangle: '102220',
  // 综柜
  zonggui: '102014',
  // 95597
  callCenter: '102091',
};

// 需要格式校验的Code值
export const FORMART_CODE = {
  // 联系方式为手机
  mobile: '104123',
  // 家庭电话
  homeline: '104121',
  // 办公电话
  officeline: '104120',
  // email
  email: '104124',
  // 传真
  tax: '104122',
  // 其他联系方式
  other: '104129',
};
