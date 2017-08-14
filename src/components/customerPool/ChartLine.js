/**
 * @file customer/ChartLine.js
 *
 * @author xuxiaoqin
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import IECharts from '../IECharts';

// y轴通用配置项
const yAxisOptions = {
  type: 'value',
  max: 1,
  min: -1,
  interval: 0.5,
  boundaryGap: false,
  axisLine: {
    show: false,
    onZero: false,
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    show: true,
    inside: true,
    textStyle: {
      color: '#666',
    },
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: ['#efefef'],
    },
  },
};

// x轴通用配置项
const xAxisOptions = {
  type: 'category',
  boundaryGap: false,
  axisLine: {
    show: true,
    onZero: false,
    lineStyle: {
      color: '#efefef',
    },
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: ['#efefef'],
    },
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    show: true,
    textStyle: {
      color: '#999',
    },
    formatter: '{value}月',
  },
};

export default class ChartLineWidget extends PureComponent {

  static propTypes = {
    chartData: PropTypes.array,
  }

  static defaultProps = {
    chartData: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  @autobind
  rateFilter(val) {
    let value = val;
    if (value && value !== undefined) {
      if (value > 0) {
        value = `+${parseFloat(value).toFixed(2)}%`;
      } else {
        value = `${parseFloat(value).toFixed(2)}%`;
      }
      return value;
    } else if (value === 0) {
      return '0.00%';
    }
    return '--';
  }

  @autobind
  profitFilter(val) {
    let value = val;
    if (value && value !== undefined) {
      value = parseFloat(value).toFixed(2);
      let result = '';
      let counter = 0;
      value = (value || 0).toString();
      const numList = value.split('.');
      const intPart = numList[0].toString();
      for (let i = intPart.length - 1; i >= 0; i--) {
        counter++;
        result = intPart.charAt(i) + result;
        if (!(counter % 3) && i !== 0) { result = `,${result}`; }
      }
      result = result.replace('-,', '-');
      if (numList[1]) {
        if (value >= 0) {
          value = `+${result}.${numList[1]}`;
        } else {
          value = `${result}.${numList[1]}`;
        }
      } else {
        value = `${result}.00`;
      }
      return value;
    } else if (value === 0) {
      return '0.00';
    }
    return '--';
  }

  render() {
    let { chartData = [] } = this.props;
    const assetProfits = [];
    let minAssetProfit = 0 - 1;
    let maxAssetProfit = 1;
    let assetProfitInterval = 0.5;

    const assetProfitRates = [];
    let minAssetProfitRate = 0 - 1;
    let maxAssetProfitRate = 1;
    let assetProfitRateInterval = 0.5;

    let chartDataIsEmpty = false;
    // 如果是空数据的情况
    if (_.isEmpty(chartData)) {
      chartDataIsEmpty = true;
      chartData = [];
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      // 设置在无数据情况下的假数据
      const defaultChartItem = {
        assetProfit: 0,
        assetProfitRate: 0,
      };
      for (let i = 0; i < 6; i++) {
        let monthFullValue = '';
        let monthValue = 0;
        // 因为处理的时候，只需要展示月份，而不需要展示年份，
        // 因此只需要看月份数值是否是1，2,3,4,5
        // 其余6,7,8,9,10,11,12不需要处理
        if (month < 6 && (month - i) <= 0) {
          monthValue = ((month - i) + 12) < 10 ? `0${(month - i) + 12}` : (month - i) + 12;
        } else {
          monthValue = (month - i) < 10 ? `0${month - i}` : month - i;
        }
        monthFullValue = `${year}${monthValue}`;
        chartData.unshift(Object.assign({ month: monthFullValue }, defaultChartItem));
      }
    }

    // 1.从chartData中提取所有的收益数字
    // 2.从chartData中提取所有的收益率数字
    for (let i = 0; i < chartData.length; i++) {
      assetProfits.push(chartData[i].assetProfit);
      assetProfitRates.push(chartData[i].assetProfitRate);
    }
    // 提取出最大收益和最小收益
    maxAssetProfit = Math.max(...assetProfits);
    minAssetProfit = Math.min(...assetProfits);
    // 提取出最大收益率和最小收益率
    maxAssetProfitRate = Math.max(...assetProfitRates);
    minAssetProfitRate = Math.min(...assetProfitRates);

    // TODO: 此处需要对无数据的情况下进行处理,
    // 以及当所有月份的数字都是是0
    let chartItemProfitAllIsZero = false;
    if (chartDataIsEmpty) {
      chartItemProfitAllIsZero = true;
    }
    if (!chartDataIsEmpty) {
      let hasZeroNumber = 0;
      for (let i = 0; i < chartData.length; i++) {
        if (Object.is(chartData[i].assetProfit, 0)) {
          hasZeroNumber++;
        }
      }
      if (hasZeroNumber === 6) {
        chartItemProfitAllIsZero = true;
      }
    }

    if (chartDataIsEmpty || chartItemProfitAllIsZero) {
      maxAssetProfit = 1.00;
      minAssetProfit = -1.00;
      maxAssetProfitRate = 1.00;
      minAssetProfitRate = -1.00;
    }
    // 计算出最大收益和最小收益的与其中间值的间隔
    // 因为背景上需要有4个格子,所以计算间隔的时候需要除以4
    assetProfitInterval = (maxAssetProfit - minAssetProfit) / 4;
    // 计算出最大收益率和最小收益率与其中间值的间隔
    // TODO对在收益率都是0的情况下进行了除错设置
    if (maxAssetProfitRate === 0 && minAssetProfitRate === 0) {
      maxAssetProfitRate = 1.00;
      minAssetProfitRate = -1.00;
    }
    assetProfitRateInterval = (maxAssetProfitRate - minAssetProfitRate) / 4;
    // 图表配置
    const options = {
      grid: {
        bottom: '20%',
        top: '14%',
      },
      xAxis: {
        ...xAxisOptions,
        data: chartData.map(item => item.month),
      },
      yAxis: [
        {
          ...yAxisOptions,
          min: minAssetProfit,
          max: maxAssetProfit,
          interval: assetProfitInterval,
          axisLabel: {
            ...yAxisOptions.axisLabel,
            formatter(value, index) {
              if (index === 1 || index === 3) {
                return '';
              }
              return parseFloat(value).toFixed(2);
            },
          },
        },
        {
          ...yAxisOptions,
          splitLine: {
            show: false,
          },
          axisLabel: {
            ...yAxisOptions.axisLabel,
            formatter(value, index) {
              if (index === 1 || index === 3) {
                return '';
              }
              if (value >= 0) {
                return `+${parseFloat(value).toFixed(2)}%`;
              }
              return `${parseFloat(value).toFixed(2)}%`;
            },
          },
          min: minAssetProfitRate,
          max: maxAssetProfitRate,
          interval: assetProfitRateInterval,
        },
      ],
      series: {
        name: '收益',
        type: 'line',
        smooth: true,
        data: chartData.map(item => item.assetProfit),
        lineStyle: {
          normal: {
            color: '#f8cc6d',
          },
        },
        itemStyle: {
          normal: {
            opacity: 0,
          },
        },
        seriesAreaStyle: {
          areaStyle: {
            normal: {
              color: '#ef9e49',
              opacity: '0.1',
            },
          },
        },
      },

    };


    return (
      <IECharts option={options} style={{ width: 300, height: 135 }} />
    );
  }
}
