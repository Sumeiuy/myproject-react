/**
 * @Description: 个股相关配置项
 * @Author: Liujianshu
 * @Date: 2018-02-26 16:47:00
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-12 14:45:27
 */
const config = {
  // 只开放个股点评，个股研报、个股公告先隐藏
  // typeList: ['StockReview'],
  typeList: ['StockReview', 'StockReport', 'StockEvent'],
  // 个股点评
  StockReview: {
    key: 'StockReview',
    name: '点评',
    titleList: [
      {
        dataIndex: 'title',
        key: 'title',
        title: '标题',
        align: 'left',
      },
      {
        dataIndex: 'code',
        key: 'code',
        title: '股票代码',
        align: 'left',
      },
      {
        dataIndex: 'stockName',
        key: 'stockName',
        title: '股票名称',
        align: 'left',
      },
      {
        dataIndex: 'reportType',
        key: 'reportType',
        title: '报告类型',
        align: 'left',
      },
      {
        dataIndex: 'author',
        key: 'author',
        title: '作者',
        align: 'left',
      },
      {
        dataIndex: 'pubdate',
        key: 'pubdate',
        title: '发布日期',
        align: 'left',
      },
      {
        dataIndex: 'rate',
        key: 'rate',
        title: '内容评价',
        align: 'left',
      },
      {
        dataIndex: 'effect',
        key: 'effect',
        title: '对股价影响',
        align: 'left',
      },
    ],
  },
  // 个股研报
  StockReport: {
    key: 'StockReport',
    name: '研报',
    titleList: [
      {
        dataIndex: 'title',
        key: 'title',
        title: '标题',
        align: 'left',
      },
      {
        dataIndex: 'code',
        key: 'code',
        title: '股票代码',
        align: 'left',
      },
      {
        dataIndex: 'stockName',
        key: 'stockName',
        title: '股票名称',
        align: 'left',
      },
      {
        dataIndex: 'industry',
        key: 'industry',
        title: '行业',
        align: 'left',
      },
      {
        dataIndex: 'rateLevel',
        key: 'rateLevel',
        title: '评级',
        align: 'left',
      },
      {
        dataIndex: 'author',
        key: 'author',
        title: '分析师',
        align: 'left',
      },
      {
        dataIndex: 'organization',
        key: 'organization',
        title: '机构',
        align: 'left',
      },
      {
        dataIndex: 'pubdate',
        key: 'pubdate',
        title: '报告日期',
        align: 'left',
      },
    ],
  },
  // 个股公告
  StockEvent: {
    key: 'StockEvent',
    name: '公告',
    titleList: [
      {
        dataIndex: 'title',
        key: 'title',
        title: '标题',
        align: 'left',
      },
      {
        dataIndex: 'code',
        key: 'code',
        title: '股票代码',
        align: 'left',
      },
      {
        dataIndex: 'stockName',
        key: 'stockName',
        title: '股票名称',
        align: 'left',
      },
      {
        dataIndex: 'reportType',
        key: 'reportType',
        title: '公告类型',
        align: 'left',
      },
      {
        dataIndex: 'source',
        key: 'source',
        title: '公告来源',
        align: 'left',
      },
      {
        dataIndex: 'pubdate',
        key: 'pubdate',
        title: '公告日期',
        align: 'left',
      },
    ],
  },
};

export default config;
