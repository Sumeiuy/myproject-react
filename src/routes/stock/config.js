/**
 * @Description: 个股相关配置项
 * @Author: Liujianshu
 * @Date: 2018-02-26 16:47:00
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-02 15:31:48
 */
const config = {
  typeList: ['judge', 'report', 'bulletin'],
  // 个股点评
  judge: {
    key: 'judge',
    name: '点评',
    titleList: [
      {
        dataIndex: 'title',
        key: 'title',
        title: '标题',
      },
      {
        dataIndex: 'code',
        key: 'code',
        title: '股票代码',
      },
      {
        dataIndex: 'stockName',
        key: 'stockName',
        title: '股票名称',
      },
      {
        dataIndex: 'reportType',
        key: 'reportType',
        title: '报告类型',
      },
      {
        dataIndex: 'author',
        key: 'author',
        title: '作者',
      },
      {
        dataIndex: 'pubdate',
        key: 'pubdate',
        title: '发布日期',
      },
      {
        dataIndex: 'rate',
        key: 'rate',
        title: '内容评价',
      },
      {
        dataIndex: 'effect',
        key: 'effect',
        title: '对股价影响',
      },
    ],
  },
  // 个股研报
  report: {
    key: 'report',
    name: '研报',
  },
  // 个股公告
  bulletin: {
    key: 'bulletin',
    name: '公告',
  },
};

export default config;
