/**
 * @Description: 精选组合部分配置项
 * @Author: Liujianshu
 * @Date: 2018-04-25 14:28:07
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-10 20:23:28
 */

const config = {
  formatStr: 'YYYY-MM-DD HH:mm',
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
        width: 170,
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
        width: 86,
      },
      {
        dataIndex: 'price',
        key: 'price',
        title: '成交价（元）',
        width: 115,
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
      },
      {
        dataIndex: 'time',
        key: 'time',
        title: '报告日期',
      },
      {
        dataIndex: 'combinationName',
        key: 'combinationName',
        title: '组合名称',
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
        title: '涨跌幅',
        width: '15%',
        align: 'left',
      },
      {
        dataIndex: 'combinationName',
        key: 'combinationName',
        title: '组合名称',
        width: '24%',
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
        width: '24%',
        align: 'left',
      },
      {
        dataIndex: 'customerName',
        key: 'customerName',
        title: '客户名称',
        width: '17%',
        align: 'left',
      },
      {
        dataIndex: 'coincideScale',
        key: 'coincideScale',
        title: '持仓重合比例',
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
  detailTitleList: {
    // 模拟实盘组合
    mnspzh: [
      {
        dataIndex: 'code',
        key: 'code',
        title: '证券代码',
        width: 70,
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: '证券名称',
        width: 110,
      },
      {
        dataIndex: 'industry',
        key: 'industry',
        title: '行业',
        width: 100,
      },
      {
        dataIndex: 'percent',
        key: 'percent',
        title: '持仓比例',
        width: 70,
      },
      {
        dataIndex: 'scNum',
        key: 'scNum',
        title: '证券数量（股）',
        width: 100,
      },
      {
        dataIndex: 'costPrice',
        key: 'costPrice',
        title: '成本价（元）',
        width: 80,
      },
      {
        dataIndex: 'newPrice',
        key: 'newPrice',
        title: '最新价格（元）',
        width: 100,
      },
      {
        dataIndex: 'floatRateReturn',
        key: 'floatRateReturn',
        title: '浮动收益（%）',
        width: 100,
      },
      {
        dataIndex: 'reason',
        key: 'reason',
        title: '理由',
      },
    ],
    // 行业股票组合
    hygpzh: [
      {
        dataIndex: 'code',
        key: 'code',
        title: '证券代码',
      },
      {
        dataIndex: 'name',
        key: 'name',
        title: '证券名称',
      },
      {
        dataIndex: 'industry',
        key: 'industry',
        title: '行业',
      },
      {
        dataIndex: 'callInTime',
        key: 'callInTime',
        title: '调入日期',
      },
      {
        dataIndex: 'callInPrice',
        key: 'callInPrice',
        title: '调入价格',
      },
      {
        dataIndex: 'percent',
        key: 'percent',
        title: '持仓比例',
      },
      {
        dataIndex: 'increase',
        key: 'increase',
        title: '累计涨幅',
      },
      {
        dataIndex: 'reason',
        key: 'reason',
        title: '理由',
      },
    ],
    // 配置类组合
    pzlzh: [
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
        title: '调入日期',
      },
      {
        dataIndex: 'callInPrice',
        key: 'callInPrice',
        title: '调入价格',
      },
      {
        dataIndex: 'percent',
        key: 'percent',
        title: '持仓比例',
      },
      {
        dataIndex: 'increase',
        key: 'increase',
        title: '累计涨幅',
      },
      {
        dataIndex: 'reason',
        key: 'reason',
        title: '理由',
      },
    ],
    // 配置类组合（资产配置型）
    pzlzhZCPZ: [
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
      },
      {
        dataIndex: 'weight',
        key: 'weight',
        title: '本期权重',
      },
      {
        dataIndex: 'rateReturn',
        key: 'rateReturn',
        title: '回报率',
      },
    ],
  },
};

export default config;
