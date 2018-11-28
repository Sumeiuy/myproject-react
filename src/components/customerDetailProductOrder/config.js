/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 15:24:26
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-28 12:23:37
 * @Description: 新版客户360详情的产品订单T配置项
 */

export const SERVICE_ORDER_FLOW_COLUMNS = [
  {
    title: '订单编号',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
    className: 'orderNumber',
    width: 208,
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    key: 'typeName',
    width: 113,
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    key: 'statusName',
    width: 85,
  },
  {
    title: '创建者',
    dataIndex: 'creatorName',
    key: 'creatorName',
    width: 211,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 135,
  },
  {
    title: '受理渠道',
    dataIndex: 'receivingChannel',
    key: 'receivingChannel',
    width: 129,
  },
  {
    title: '执行情况',
    dataIndex: 'executiveCondition',
    key: 'executiveCondition',
    className: 'executiveCondition',
  },
];

export const TRADE_ORDER_FLOW_COLUMNS = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'productCode',
    width: '8%',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '12%',
  },
  {
    title: '产品类型',
    dataIndex: 'productType',
    key: 'productType',
    width: '7%',
  },
  {
    title: '操作类型',
    dataIndex: 'operationType',
    key: 'operationType',
    width: '6%',
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    key: 'orderStatus',
    width: '7%',
  },
  {
    title: '金额（元）',
    dataIndex: 'money',
    key: 'money',
    width: '7%',
  },
  {
    title: '风险是否匹配',
    dataIndex: 'riskMatched',
    key: 'riskMatched',
    width: '8%',
  },
  {
    title: '期限是否匹配',
    dataIndex: 'timeMacthed',
    key: 'timeMacthed',
    width: '8%',
  },
  {
    title: '投资品种是否匹配',
    dataIndex: 'varietyMatched',
    key: 'varietyMatched',
    width: '10%',
  },
  {
    title: '签署确认书类型',
    dataIndex: 'confirmationType',
    key: 'confirmationType',
    width: '10%',
  },
  {
    title: '受理渠道',
    dataIndex: 'channel',
    key: 'channel',
    width: '8%',
  },
  {
    title: '订单时间',
    dataIndex: 'orderTime',
    key: 'orderTime',
    width: '9%',
  },
];

export const SERVICE_PRODUCT_LIST_COLUMNS = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'productCode',
    width: '11%',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '13%',
  },
  {
    title: '操作类型',
    dataIndex: 'operateType',
    key: 'operateType',
    width: '8%',
  },
  {
    title: '产品类型',
    dataIndex: 'productType',
    key: 'productType',
    width: '10%',
  },
  {
    title: '产品佣金(%)',
    dataIndex: 'productCommission',
    key: 'productCommission',
    width: '10%',
  },
  {
    title: '风险是否匹配',
    dataIndex: 'matchRisk',
    key: 'matchRisk',
    width: '10%',
  },
  {
    title: '期限是否匹配',
    dataIndex: 'matchTime',
    key: 'matchTime',
    width: '10%',
  },
  {
    title: '投资品牌是否匹配',
    dataIndex: 'matchInvestmentBrand',
    key: 'matchInvestmentBrand',
    width: '12%',
  },
  {
    title: '签署确认书类型',
    dataIndex: 'confirmationType',
    key: 'confirmationType',
    width: '16%',
  },
];

// 服务订购产品信息列表
export const SERVICE_ORDER_TABLE_COLUMNS = [
  {
    title: '产品代码',
    dataIndex: 'name',
    key: 'name',
    width: '14%',
  },
  {
    title: '服务名称',
    dataIndex: 'aliasName',
    key: 'aliasName',
    width: '16%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '14%',
  },
  {
    title: '开始日期',
    dataIndex: 'startDt',
    key: 'startDt',
    width: '14%',
  },
  {
    title: '结束日期',
    dataIndex: 'endDt',
    key: 'endDt',
    width: '14%',
  },
  {
    title: '佣金（‰）',
    dataIndex: 'intrRate',
    key: 'intrRate',
    width: '14%',
  },
  {
    title: '订购方式',
    dataIndex: 'orderType',
    key: 'orderType',
    width: '14%',
  },
];

export const DATE_FORMATE_STR = 'YYYY-MM-DD';
export const DATE_FORMATE_STR_DETAIL = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_PAGE_SIZE = 10;
