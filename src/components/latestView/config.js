/**
 * @Author: XuWenKang
 * @Description: 最新观点页面相关配置
 * @Date: 2018-06-20 13:46:41
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-06-25 11:03:12
 */

const exported = {
  chiefViewpointType: [
    {
      show: true,
      label: '不限',
      value: '',
    },
    {
      show: true,
      label: '金牛模拟组合',
      value: '1',
    },
    {
      show: true,
      label: '每周首席投顾观点',
      value: '2',
    },
    {
      show: true,
      label: '专题',
      value: '3',
    },
    {
      show: true,
      label: '点评',
      value: '4',
    },
    {
      show: true,
      label: '组合精粹',
      value: '5',
    },
    {
      show: true,
      label: '个股精选',
      value: '6',
    },
  ],

  viewpointTitleList: [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      key: 'typeName',
      width: '14%',
    },
    {
      title: '相关股票',
      dataIndex: 'stockName',
      key: 'stockName',
      width: '16%',
    },
    {
      title: '行业',
      dataIndex: 'industryName',
      key: 'industryName',
      width: '13%',
    },
    {
      title: '报告日期',
      dataIndex: 'time',
      key: 'time',
      width: '13%',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: '13%',
    },
  ],

  dateFormatStr: 'YYYY-MM-DD',

  majorAssets: {
    tabArray: [
      {
        id: 1,
        key: 'weeklyMajorAssetList',
        name: '每周观点',
      },
      {
        id: 2,
        key: 'monthlyMajorAssetList',
        name: '战术配置',
      },
      {
        id: 3,
        key: 'yearlyMajorAssetList',
        name: '战略配置',
      },
    ],
    titleArray: [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: '40%',
      },
      {
        title: '类型',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '资产大类',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: '评级',
        dataIndex: 'gradeName',
        key: 'gradeName',
      },
      {
        title: '报告日期',
        dataIndex: 'time',
        key: 'time',
      },
    ],
    typeArray: [
      {
        show: true,
        label: '不限',
        value: '',
      },
      {
        show: true,
        label: '每周观点',
        value: '1',
      },
      {
        show: true,
        label: '战术配置',
        value: '2',
      },
      {
        show: true,
        label: '战略配置',
        value: '3',
      },
    ],
    categoryArray: [
      {
        show: true,
        label: '不限',
        value: '',
      },
      {
        show: true,
        label: '国内权益类资产',
        value: '1',
      },
      {
        show: true,
        label: '固定收益类资产',
        value: '2',
      },
      {
        show: true,
        label: '股权类资产',
        value: '5',
      },
      {
        show: true,
        label: '另类资产',
        value: '6',
      },
      {
        show: true,
        label: '海外资产',
        value: '4',
      },
      {
        show: true,
        label: '大宗资产',
        value: '3',
      },
    ],
  },

  directType: [
    {
      show: true,
      label: '不限',
      value: '',
    },
    {
      show: true,
      label: '调入',
      value: '1',
    },
    {
      show: true,
      label: '调出',
      value: '2',
    },
  ],

  // 首席观点筛选类型
  viewpointFilterType: '1',

  // 行业主题调整筛选类型
  industryThemeFilterType: '2',

  industryTitleList: [
    {
      title: '行业/主题',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    },
    {
      title: '调整方向',
      dataIndex: 'direction',
      key: 'direction',
      width: '15%',
    },
    {
      title: '理由',
      dataIndex: 'reason',
      key: 'reason',
      width: '50%',
    },
    {
      title: '调整时间',
      dataIndex: 'time',
      key: 'time',
      width: '15%',
    },
  ],
};

export default exported;
