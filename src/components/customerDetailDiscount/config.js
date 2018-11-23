/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券相关config
 * @Date: 2018-11-21 16:48:58
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-23 11:17:00
 */
import React from 'react';

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
    render: text => (
      <span title={text}>{text}</span>
    ),
  },
  {
    title: '产品名称',
    dataIndex: 'productText',
    key: 'productText',
    className: '',
    width: 192,
    render: text => (
      <span title={text}>{text}</span>
    ),
  },
  {
    title: '产品简称',
    dataIndex: 'introduce',
    key: 'introduce',
    className: '',
    width: 304,
    render: text => (
      <span title={text}>{text}</span>
    ),
  },
  {
    title: '到期日',
    dataIndex: 'endTime',
    key: 'endTime',
    className: '',
    width: 130,
    render: text => (
      <span title={text}>{text}</span>
    ),
  },
  {
    title: '产品活动标签',
    dataIndex: 'label',
    key: 'label',
    className: '',
    width: 270,
    render: text => (
      <span title={text}>{text}</span>
    ),
  },
];
// 根据传入的参数判断是否需要显示title，如果值等于默认值则不显示
export const checkIsNeedTitle = value => (value !== DEFAULT_VALUE);
