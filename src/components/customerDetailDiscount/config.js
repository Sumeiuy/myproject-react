/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券相关config
 * @Date: 2018-11-21 16:48:58
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-23 13:27:38
 */
export const DEFAULT_VALUE = '--';

export const couponTitleList = [
  {
    title: '优惠券名称',
    dataIndex: 'ticketName',
    key: 'ticketName',
    className: 'firstStyle',
    width: 120,
  },
  {
    title: '优惠券类型',
    dataIndex: 'ticketTypeText',
    key: 'ticketTypeText',
    className: '',
    width: 160,
  },
  {
    title: '优惠券编号',
    dataIndex: 'ticketId',
    key: 'ticketId',
    className: '',
    width: 320,
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
    className: '',
    width: 186,
  },
  {
    title: '使用状态',
    dataIndex: 'statusText',
    key: 'statusText',
    className: '',
    width: 104,
  },
  {
    title: '来源营销活动名称',
    dataIndex: 'sourceName',
    key: 'sourceName',
    className: '',
    width: 274,
  },
];
export const productTitleList = [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    className: 'firstStyle',
    width: 110,
  },
  {
    title: '产品名称',
    dataIndex: 'productText',
    key: 'productText',
    className: '',
    width: 192,
  },
  {
    title: '产品简称',
    dataIndex: 'introduce',
    key: 'introduce',
    className: '',
    width: 304,
  },
  {
    title: '到期日',
    dataIndex: 'endTime',
    key: 'endTime',
    className: '',
    width: 130,
  },
  {
    title: '产品活动标签',
    dataIndex: 'label',
    key: 'label',
    className: '',
    width: 270,
  },
];
// 根据传入的参数判断是否需要显示title，如果值等于默认值则不显示
export const checkIsNeedTitle = value => (value !== DEFAULT_VALUE);
// 优惠券列表需要tooltip的dataindex
export const COUPON_LIST_NEED_TOOLTIP = [
  'ticketName',
  'ticketTypeText',
  'sourceName',
];
// 优惠券详情需要tooltip的dataindex
export const COUPON_DETAIL_NEED_TOOLTIP = [
  'productCode',
  'productText',
  'introduce',
  'label',
];

