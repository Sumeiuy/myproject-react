/**
 * @Author: XuWenKang
 * @Description: 客户360，客户属性tab相关配置
 * @Date: 2018-11-07 15:17:38
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-09 17:21:48
 */

export const CUST_TYPE = {
  // 个人客户类型标识
  personCustType: 'per',
  // 普通机构客户类型标识
  organizationCustType: 'org',
  // 产品机构客户类型标识
  productCustType: 'pro',
};
const config = {
  MemberGradeColumns: [
    {
      title: '变更前等级',
      dataIndex: 'beforeChangeLevel',
      key: 'beforeChangeLevel',
      className: 'firstStyle',
    },
    {
      title: '变更后等级',
      dataIndex: 'afterChangeLevel',
      key: 'afterChangeLevel',
      className: 'firstStyle',
    },
    {
      title: '操作来源',
      dataIndex: 'source',
      key: 'source',
      className: 'firstStyle',
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
      className: 'firstStyle',
    },
  ],
  integralFlowColumns: [
    {
      title: '交易ID',
      dataIndex: 'tradeId',
      key: 'tradeId',
      className: 'firstStyle',
    },
    {
      title: '交易日期',
      dataIndex: 'tradeDate',
      key: 'tradeDate',
      className: 'firstStyle',
    },
    {
      title: '交易渠道',
      dataIndex: 'tradeChannel',
      key: 'tradeChannel',
      className: 'firstStyle',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      className: 'firstStyle',
    },
    {
      title: '子类型',
      dataIndex: 'subType',
      key: 'subType',
      className: 'firstStyle',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      className: 'firstStyle',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      className: 'firstStyle',
    },
    {
      title: '产品数量',
      dataIndex: 'productQuantity',
      key: 'productQuantity',
      className: 'firstStyle',
    },
    {
      title: '基本点数',
      dataIndex: 'basePoints',
      key: 'basePoints',
      className: 'firstStyle',
    },
    {
      title: '变更前等级',
      dataIndex: 'beforeChangeLevel',
      key: 'beforeChangeLevel',
      className: 'firstStyle',
    },
    {
      title: '变更前等级',
      dataIndex: 'beforeChangeLevel',
      key: 'beforeChangeLevel',
      className: 'firstStyle',
    },
    {
      title: '变更前等级',
      dataIndex: 'beforeChangeLevel',
      key: 'beforeChangeLevel',
      className: 'firstStyle',
    },
    {
      title: '变更前等级',
      dataIndex: 'beforeChangeLevel',
      key: 'beforeChangeLevel',
      className: 'firstStyle',
    },
  ]
};
export default config;
export const {
  MemberGradeColumns,
  integralFlowColumns,
} = config;

