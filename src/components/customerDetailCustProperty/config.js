/**
 * @Author: XuWenKang
 * @Description: 客户360，客户属性tab相关配置
 * @Date: 2018-11-07 15:17:38
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-12 10:24:08
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
      className: 'publicStyle',
    },
    {
      title: '操作来源',
      dataIndex: 'source',
      key: 'source',
      className: 'publicStyle',
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
      className: 'lastStyle',
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
      className: 'publicStyle',
    },
    {
      title: '交易渠道',
      dataIndex: 'tradeChannel',
      key: 'tradeChannel',
      className: 'publicStyle',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      className: 'publicStyle',
    },
    {
      title: '子类型',
      dataIndex: 'subType',
      key: 'subType',
      className: 'publicStyle',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      className: 'publicStyle',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      className: 'publicStyle',
    },
    {
      title: '产品数量',
      dataIndex: 'productQuantity',
      key: 'productQuantity',
      className: 'publicStyle',
    },
    {
      title: '基本点数',
      dataIndex: 'basePoints',
      key: 'basePoints',
      align: 'right',
      className: 'lastStyle',
    },
    {
      title: '点数类型',
      dataIndex: 'pointType',
      key: 'pointType',
      className: 'publicStyle',
    },
    {
      title: '处理日期',
      dataIndex: 'processDate',
      key: 'processDate',
      className: 'publicStyle',
    },
    {
      title: '所有者',
      dataIndex: 'owners',
      key: 'owners',
      className: 'publicStyle',
    },
    {
      title: '取消的交易ID	',
      dataIndex: 'cancelledId',
      key: 'cancelledId',
      className: 'lastStyle',
    },
  ]
};
export default config;
export const {
  MemberGradeColumns,
  integralFlowColumns,
} = config;

