import { dateFormat } from '../../routes/taskList/config';

/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 15:24:26
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-21 18:28:22
 * @Description: 新版客户360详情的产品订单T配置项
 */

export const SERVICE_ORDER_FLOW_COLUMNS = [
  {
    title: '订单编号',
    dataIndex: 'orderId',
  },
  {
    title: '类型',
    dataIndex: 'serviceType',
  },
  {
    title: '状态',
    dataIndex: 'serviceStatus',
  },
  {
    title: '创建者',
    dataIndex: 'creator',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
  },
  {
    title: '受理渠道',
    dataIndex: 'serviceChannel',
  },
  {
    title: '执行情况',
    dataIndex: 'condition',
  },
];

export const TRADE_ORDER_FLOW_COLUMNS = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    className: 'productCode',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
  },
  {
    title: '产品类型',
    dataIndex: 'productType',
  },
  {
    title: '操作类型',
    dataIndex: 'operationType',
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
  },
  {
    title: '金额（元）',
    dataIndex: 'money',
  },
  {
    title: '风险是否匹配',
    dataIndex: 'isRiskMatched',
  },
  {
    title: '期限是否匹配',
    dataIndex: 'isTimeMacthed',
  },
  {
    title: '投资品种是否匹配',
    dataIndex: 'isVarietyMatched',
  },
  {
    title: '签署确认书类型',
    dataIndex: 'confirmationType',
  },
  {
    title: '受理渠道',
    dataIndex: 'channel',
  },
  {
    title: '订单时间',
    dataIndex: 'orderTime',
  },
];

export const DATE_FORMATE_STR = 'YYYY-MM-DD';
export const DATE_FORMATE_STR_DETAIL = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_PAGE_SIZE = 5;
