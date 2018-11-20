/*
 * @Author: yuanhaojie
 * @Date: 2018-11-20 15:24:26
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-20 15:39:00
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
