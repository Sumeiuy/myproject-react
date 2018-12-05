/*
 * @Author: zhangjun
 * @Date: 2018-12-04 11:09:01
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-05 11:07:48
 */

// 资产分类
const ASSET_CLASSIFY_LIST = [
  {
    show: true,
    value: '01',
    label: '按大类资产分布',
  },
  {
    show: true,
    value: '02',
    label: '按产品类型分布',
  }
];

// 雷达图配置项
const CHART_RADAR_OPTIONS = {
  name: {
    textStyle: {
      color: '#108ee9',
      borderRadius: 3,
      padding: [3, 5]
    },
    rich: {
      name: {
        color: '#666666',
        lineHeight: 12,
        fontSize: 12,
        align: 'center',
      },
      value: {
        color: '#333333',
        lineHeight: 14,
        align: 'center',
        fontSize: 12,
      },
    },
  },
  nameGap: 0,
  splitNumber: 3,
  splitArea: {
    areaStyle: { // 分隔区域的样式设置。
      show: true,
      color: ['#f4f6f9', '#e9eaec'],
    }
  },
};

const CHART_SERIES_OPTIONS = {
  type: 'radar',
  itemStyle: {
    normal: {
      lineStyle: {
        color: '#ff8008',
      },
      areaStyle: {
        color: '#fec965',
        opacity: 1
      },
    }
  },
  symbol: 'circle',
};

// 表格列配置项
const TABLE_COLUMNS = [
  {
    title: '产品种类',
    dataIndex: 'classifyName',
    width: 110,
  },
  {
    title: '持仓金额 (万元)',
    dataIndex: 'holdAmount',
  },
  {
    title: '期间收益 (万元)',
    dataIndex: 'periodProfit',
  },
  {
    title: '客户配置权重',
    dataIndex: 'configWeight',
  },
];

// 期末资产配置注解说明
const END_TERM_ASSET_TIP = [
  '1.上图为客户持仓在各资产类别上的分布情况。持仓数据为统计期内最后一个交易日客户持仓时点数据。',
  '2. 期间收益指统计期内在该类资产上累计获得的收益。',
  '3. 各类资产均转化为人民币计算。',
  '4. 负债为信用账户负债额度，总资产包含信用账户负债',
  '5.点击上图右上角可以切换资产分类方式。',
];

export {
  ASSET_CLASSIFY_LIST,
  CHART_RADAR_OPTIONS,
  CHART_SERIES_OPTIONS,
  TABLE_COLUMNS,
  END_TERM_ASSET_TIP,
};
