/**
 * @Author: XuWenKang
 * @Description: 最新观点页面相关配置
 * @Date: 2018-06-20 13:46:41
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-20 17:41:39
 */

export default {
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
};
