/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 15:24:26
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-26 18:26:36
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
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: '产品类型',
    dataIndex: 'productType',
    key: 'productType',
  },
  {
    title: '操作类型',
    dataIndex: 'operationType',
    key: 'operationType',
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    key: 'orderStatus',
  },
  {
    title: '金额（元）',
    dataIndex: 'money',
    key: 'money',
  },
  {
    title: '风险是否匹配',
    dataIndex: 'isRiskMatched',
    key: 'isRiskMatched',
  },
  {
    title: '期限是否匹配',
    dataIndex: 'isTimeMacthed',
    key: 'isTimeMacthed',
  },
  {
    title: '投资品种是否匹配',
    dataIndex: 'isVarietyMatched',
    key: 'isVarietyMatched',
  },
  {
    title: '签署确认书类型',
    dataIndex: 'confirmationType',
    key: 'confirmationType',
  },
  {
    title: '受理渠道',
    dataIndex: 'channel',
    key: 'channel',
  },
  {
    title: '订单时间',
    dataIndex: 'orderTime',
    key: 'orderTime',
  },
];

export const SERVICE_PRODUCT_LIST_COLUMNS = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'productCode',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: '操作类型',
    dataIndex: 'operateType',
    key: 'operateType',
  },
  {
    title: '产品类型',
    dataIndex: 'productType',
    key: 'productType',
  },
  {
    title: '产品佣金(%)',
    dataIndex: 'productCommission',
    key: 'productCommission',
  },
  {
    title: '风险是否匹配',
    dataIndex: 'matchRisk',
    key: 'matchRisk',
  },
  {
    title: '期限是否匹配',
    dataIndex: 'matchTime',
    key: 'matchTime',
  },
  {
    title: '投资品牌是否匹配',
    dataIndex: 'matchInvestmentBrand',
    key: 'matchInvestmentBrand',
  },
  {
    title: '签署确认书类型',
    dataIndex: 'confirmationType',
    key: 'confirmationType',
  },
];

export const DATE_FORMATE_STR = 'YYYY-MM-DD';
export const DATE_FORMATE_STR_DETAIL = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_PAGE_SIZE = 10;
