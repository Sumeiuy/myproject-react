/*
 * @Author: zhangjun
 * @Date: 2018-12-05 13:30:11
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-07 14:51:27
 * @description 资产配置变动走势chart图
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import IECharts from '../../IECharts';
import IfWrap from '../../common/biz/IfWrap';
import { CHART_LINE_OPTIONS } from './config';
import { filterXAxisDate } from '../utils';
import { number } from '../../../helper';
import styles from './assetConfigTrendChart.less';

const { thousandFormat } = number;

export default class AssetConfigTrendChart extends PureComponent {
  static propTypes ={
    // 资产配置变动走势echart图数据
    assetConfigTrendChart: PropTypes.array.isRequired,
  }

  // 获取每个Serie数据
  @autobind
  getSerieData(name) {
    const { assetConfigTrendChart } = this.props;
    // 资产类别数组
    const assetClassifyArray = _.map(assetConfigTrendChart, item => item.assetClassifyList);
    // assetClassifyList是二位数组，需要返回相同类别下的数据组成Serie的data
    // 遍历第一层数组,并把第二层的过滤结果合并成一个新数组
    const serieData = _.reduce(assetClassifyArray, (serieList, list) => {
      // 遍历第二层数组，过滤出类别名相同的资产量，并返回一个新数组
      const assetAmountData = _.reduce(list, (assetAmountList, item) => {
        const { classifyName, assetAmount } = item;
        if (classifyName === name) {
          assetAmountList.push(assetAmount);
        }
        return assetAmountList;
      }, []);
      return [...serieList, ...assetAmountData];
    }, []);
    return serieData;
  }

  // 图表配置项
  @autobind
  getChartOption() {
    const { assetConfigTrendChart } = this.props;
    // x轴数据, 首先从数组中获取date数据，UI稿不需要展示年份，然后把年份截取掉
    const xAxisData = filterXAxisDate(_.map(assetConfigTrendChart, item => item.date));
    // 资产类别数组
    const assetClassifyArray = _.map(assetConfigTrendChart, item => item.assetClassifyList);
    // 资产类别名称数组
    const classifyNameList = _.map(assetClassifyArray[0], item => item.classifyName);
    // legend的data属性
    const legendData = _.map(classifyNameList, item => ({
      name: item,
      icon: 'circle',
    }));
    // 组装series数据
    const series = _.map(classifyNameList, name => (
      {
        name,
        type: 'line',
        symbol: 'none',
        areaStyle: { normal: {} },
        data: this.getSerieData(name),
      }
    ));
    const { xAxis, tooltip } = CHART_LINE_OPTIONS;
    return {
      ...CHART_LINE_OPTIONS,
      xAxis: {
        ...xAxis,
        boundaryGap: false,
        data: xAxisData,
      },
      color: ['#3c4f85', '#0064bb', '#03c2e9', '#8e76ff', '#b60609', '#f76c0e', '#ffca10'],
      legend: {
        data: legendData,
        padding: 5,
        right: 0,
      },
      tooltip: {
        ...tooltip,
        formatter: this.tooltipFormat,
      },
      series,
    };
  }

  // 图表浮层提示框
  @autobind
  tooltipFormat(params) {
    const { dataIndex } = params[0];
    const { assetConfigTrendChart } = this.props;
    // 账户收益走势图表返回的日期
    const filterDate = _.map(assetConfigTrendChart, item => item.date);
    const dateData = filterDate[dataIndex];
    // 资产类别数组
    // 当前y轴所有资产分类的数据
    const currentAssetData = assetConfigTrendChart[dataIndex];
    const { assetClassifyList, totalAssetAmount, totalAssetAmountRate } = currentAssetData;
    // 每类资产的资产量
    const assetClassifyElement = _.map(assetClassifyList, (item, index) => {
      const { classifyName, assetAmount, rate } = item;
      return `
        <tr class="tableBody">
          <td>${params[index].marker}${classifyName}</td>
          <td>${rate}%</td>
          <td>${thousandFormat(assetAmount)}</td>
        </tr>
      `;
    });
    // 每类资产的资产量返回的是数组，需要转换成字符串
    const assetClassifyElementList = assetClassifyElement.join('');
    return `
      <div class="echartTooltip">
        <div>${dateData}</div>
        <div class="echartTooltipTable">
          <table>
            <tr class="tableHeader">
              <th>类型</th>
              <th>占比</th>
              <th>资产量</th>
            </tr>
            <tr class="tableBody">
              <td>总资产</td>
              <td>${totalAssetAmountRate}%</td>
              <td>${thousandFormat(totalAssetAmount)}</td>
            </tr>
            ${assetClassifyElementList}
          </table>
        </div>
      </div>
    `;
  }

  render() {
    const {
      assetConfigTrendChart,
    } = this.props;
    // echart图表配置项
    const option = this.getChartOption();
    return (
      <div className={styles.assetConfigTrendChart}>
        <IfWrap isRender={!_.isEmpty(assetConfigTrendChart)}>
          <IECharts
            option={option}
            style={{
              height: '366px',
            }}
            resizable
          />
        </IfWrap>
      </div>
    );
  }
}
