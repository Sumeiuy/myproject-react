/**
 * @Description: 精选组合部分配置项
 * @Author: Liujianshu
 * @Date: 2018-04-25 14:28:07
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-05 13:28:45
 */
import React from 'react';
import IconPopover from './IconPopover';

const config = {
  formatStr: 'YYYY-MM-DD HH:mm',
  formatDateStr: 'YYYY-MM-DD',
  timeRange: [
    {
      show: true,
      label: '全部',
      value: '',
    },
    {
      show: true,
      label: '近三个月',
      value: '3',
    },
    {
      show: true,
      label: '近半年',
      value: '6',
    },
    {
      show: true,
      label: '近一年',
      value: '12',
    },
  ],
  directionRange: [
    {
      show: true,
      label: '全部',
      value: '',
    },
    {
      show: true,
      label: '调入/增/买',
      value: '1',
      icon: '买',
      title: '最新调入',
    },
    {
      show: true,
      label: '调出/减/卖',
      value: '2',
      icon: '卖',
      title: '最新调出',
    },
  ],
  titleList: {
    history: [
      {
        dataIndex: 'time',
        key: 'time',
        title: '时间',
        width: 136,
      },
      {
        dataIndex: 'directionName',
        key: 'directionName',
        title: '调仓方向',
        width: 86,
      },
      {
        dataIndex: 'securityName',
        key: 'securityName',
        title: '证券名称',
        width: 100,
      },
      {
        dataIndex: 'securityCode',
        key: 'securityCode',
        title: '证券代码',
        width: 106,
      },
      {
        dataIndex: 'price',
        key: 'price',
        title: '成交价（元）',
        width: 125,
      },
      {
        dataIndex: 'reason',
        key: 'reason',
        title: '理由',
      },
      {
        dataIndex: 'combinationName',
        key: 'combinationName',
        title: '所属组合',
        width: 174,
      },
      {
        dataIndex: 'view',
        key: 'view',
        title: '持仓客户',
        width: 80,
      },
    ],
    report: [
      {
        dataIndex: 'title',
        key: 'title',
        title: '标题',
      },
      {
        dataIndex: 'author',
        key: 'author',
        title: '作者',
        width: 100,
      },
      {
        dataIndex: 'time',
        key: 'time',
        title: '报告日期',
        width: 170,
      },
      {
        dataIndex: 'combinationName',
        key: 'combinationName',
        title: '组合名称',
        width: 220,
      },
    ],
    ten: [
      {
        dataIndex: 'name',
        key: 'name',
        title: '证券名称及代码',
        width: '27%',
        align: 'left',
      },
      {
        dataIndex: 'callInTime',
        key: 'callInTime',
        title: '调入时间',
        width: '22%',
        align: 'left',
      },
      {
        dataIndex: 'priceLimit',
        key: 'priceLimit',
        title: '近7天涨跌幅',
        width: '17%',
        align: 'left',
      },
      {
        dataIndex: 'combinationName',
        key: 'combinationName',
        title: '组合名称',
        width: '22%',
        align: 'left',
      },
      {
        dataIndex: 'title',
        key: 'title',
        title: '持仓客户',
        width: '12%',
        align: 'right',
      },
    ],
    // 组合详情-订购客户
    orderCust: [
      {
        dataIndex: 'customerId',
        key: 'customerId',
        title: '客户号',
        width: '22%',
        align: 'left',
      },
      {
        dataIndex: 'customerName',
        key: 'customerName',
        title: '客户名称',
        width: '19%',
        align: 'left',
      },
      {
        dataIndex: 'coincideScale',
        key: 'coincideScale',
        title: <IconPopover title="持仓重合比例" />,
        width: '22%',
        align: 'left',
      },
      {
        dataIndex: 'relevance',
        key: 'relevance',
        title: '持仓关联',
        width: '37%',
        align: 'left',
      },
    ],
    // 组合详情-订购客户
    custRepeat: [
      {
        dataIndex: 'proportionName',
        key: 'proportionName',
        title: <IconPopover title="持仓重合比例" />,
        width: '30%',
        align: 'left',
      },
      {
        dataIndex: 'custNum',
        key: 'custNum',
        title: '客户数',
        width: '20%',
        align: 'left',
      },
      {
        dataIndex: 'custProportion',
        key: 'custProportion',
        title: '客户数/组合订购客户数',
        width: '50%',
        align: 'left',
      },
    ],
    // 组合详情-历史报告
    historyReport: [
      {
        dataIndex: 'title',
        key: 'title',
        title: '标题',
        width: '65%',
        align: 'left',
      },
      {
        dataIndex: 'author',
        key: 'author',
        title: '作者',
        width: '17%',
        align: 'left',
      },
      {
        dataIndex: 'time',
        key: 'time',
        title: '报告日期',
        width: '18%',
        align: 'left',
      },
    ],
  },
  typeList: ['history', 'report'],
  securityType: [
    {
      name: '股票',
      value: '1',
      shortName: 'GP',
    },
    {
      name: '基金',
      value: '2',
      shortName: 'JJ',
    },
    {
      name: '债券',
      value: '3',
      shortName: 'ZQ',
    },
  ],
  // 跳转持仓查客户source
  sourceType: {
    security: 'securitiesProducts', // 证券类产品
    combination: 'orderCombination', // 组合资讯类
  },
  // 趋势图tab
  chartTabList: [
    {
      label: '近3个月',
      key: '3',
    },
    {
      label: '近一年',
      key: '12',
    },
    {
      label: '全部',
      key: 'all',
    },
  ],
  // 收益率排序
  yieldRankList: [
    {
      show: true,
      value: '1',
      label: '近7天收益率从高到低',
      showName: '近7天收益率',
      showNameKey: 'weekEarnings',
    },
    {
      show: true,
      value: '2',
      label: '近30天收益率从高到低',
      showName: '近30天收益率',
      showNameKey: 'monthEarnings',
    },
    {
      show: true,
      value: '3',
      label: '当年收益率从高到低',
      showName: '当年收益率',
      showNameKey: 'yearEarnings',
    },
    {
      show: true,
      value: '4',
      label: '累计收益率从高到低',
      showName: '累计收益率',
      showNameKey: 'totalEarnings',
    },
  ],
  // 筛选默认值
  riskDefaultItem: {
    key: 'all',
    value: 'all',
    label: '全部',
  },
  detailTitleType: {
    // 模拟实盘组合
    MNSPZH: 0,
    // 行业股票组合
    HYGPZH: 1,
    // 配置类组合
    PZLZH: 2,
    // 资产配置组合
    ZCPZZH: 3,
  },
  detailTitleList: [
    // 模拟实盘组合
    [
      {
        dataIndex: 'code',
        key: 'code',
        title: '证券代码',
        width: 60,
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: '证券名称',
        width: 80,
      },
      {
        dataIndex: 'industry',
        key: 'industry',
        title: '行业',
        width: 60,
      },
      {
        dataIndex: 'percent',
        key: 'percent',
        title: '持仓比例(%)',
        width: 75,
      },
      {
        dataIndex: 'scNum',
        key: 'scNum',
        title: '证券数量(股)',
        width: 80,
      },
      {
        dataIndex: 'costPrice',
        key: 'costPrice',
        title: '成本价(元)',
        width: 70,
      },
      {
        dataIndex: 'newPrice',
        key: 'newPrice',
        title: '最新价格(元)',
        width: 80,
      },
      {
        dataIndex: 'floatRateReturn',
        key: 'floatRateReturn',
        title: '浮动收益率(%)',
        width: 90,
      },
      {
        dataIndex: 'reason',
        key: 'reason',
        title: '理由',
        width: 380,
      },
    ],
    // 行业股票组合
    [
      {
        dataIndex: 'code',
        key: 'code',
        title: '证券代码',
        width: 60,
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: '证券名称',
        width: 80,
      },
      {
        dataIndex: 'industry',
        key: 'industry',
        title: '行业',
        width: 60,
      },
      {
        dataIndex: 'callInTime',
        key: 'callInTime',
        title: '调入日期',
        width: 110,
      },
      {
        dataIndex: 'callInPrice',
        key: 'callInPrice',
        title: '调入价格(元)',
        width: 80,
      },
      {
        dataIndex: 'percent',
        key: 'percent',
        title: '持仓比例(%)',
        width: 75,
      },
      {
        dataIndex: 'increase',
        key: 'increase',
        title: '累计涨幅(%)',
        width: 80,
      },
      {
        dataIndex: 'reason',
        key: 'reason',
        title: '理由',
        width: 380,
      },
    ],
    // 配置类组合
    [
      {
        dataIndex: 'code',
        key: 'code',
        title: '基金代码',
        width: 60,
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: '基金简称',
        width: 80,
      },
      {
        dataIndex: 'category',
        key: 'category',
        title: '分类',
        width: 60,
      },
      {
        dataIndex: 'callInTime',
        key: 'callInTime',
        title: '调入日期',
        width: 110,
      },
      {
        dataIndex: 'callInPrice',
        key: 'callInPrice',
        title: '调入价格(元)',
        width: 80,
      },
      {
        dataIndex: 'percent',
        key: 'percent',
        title: '持仓比例(%)',
        width: 75,
      },
      {
        dataIndex: 'increase',
        key: 'increase',
        title: '累计涨幅(%)',
        width: 80,
      },
      {
        dataIndex: 'reason',
        key: 'reason',
        title: '理由',
        width: 380,
      },
    ],
    // 配置类组合（资产配置型）
    [
      {
        dataIndex: 'code',
        key: 'code',
        title: '基金代码',
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: '基金简称',
      },
      {
        dataIndex: 'category',
        key: 'category',
        title: '分类',
      },
      {
        dataIndex: 'callInTime',
        key: 'callInTime',
        title: '调仓日期',
        width: 110,
      },
      {
        dataIndex: 'currHoldRate',
        key: 'currHoldRate',
        title: '本期权重(%)',
      },
      {
        dataIndex: 'rateReturn',
        key: 'rateReturn',
        title: '回报率(%)',
      },
    ],
  ],
  // 概览周月年
  weekMonthYear: [
    {
      name: '周',
      key: 'Week',
      percent: 'weekEarnings',
      ranking: 'weekCurrentRank',
      total: 'weekAmout',
    },
    {
      name: '月',
      key: 'Month',
      percent: 'monthEarnings',
      ranking: 'monthCurrentRank',
      total: 'monthAmout',
    },
    {
      name: '年',
      key: 'Year',
      percent: 'yearEarnings',
      ranking: 'yearCurrentRank',
      total: 'yearAmout',
    },
  ],
  overlayStyle: {
    width: '240px',
    padding: '10px',
    wordBreak: 'break-all',
  },
};

export const {
  formatStr,
  formatDateStr,
  timeRange,
  directionRange,
  titleList,
  typeList,
  securityType,
  sourceType,
  chartTabList,
  yieldRankList,
  riskDefaultItem,
  detailTitleType,
  detailTitleList,
  weekMonthYear,
  overlayStyle,
} = config;
