/**
 * @Description: 精选组合部分配置项
 * @Author: Liujianshu
 * @Date: 2018-04-25 14:28:07
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-04-25 16:47:41
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
};

export default config;
