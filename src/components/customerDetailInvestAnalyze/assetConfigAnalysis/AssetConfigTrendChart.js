/*
 * @Author: zhangjun
 * @Date: 2018-12-05 13:30:11
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-11 22:43:40
 * @description 资产配置变动走势chart图
 */
import React, { Component } from 'react';
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

export default class AssetConfigTrendChart extends Component {
  static propTypes ={
    // 资产配置变动走势echart图数据
    assetConfigTrendChart: PropTypes.array,
  }

  static defaultProps = {
    assetConfigTrendChart: [],
  }

  componentDidUpdate(prevProps) {
    const { assetConfigTrendChart } = this.props;
    if (prevProps.assetConfigTrendChart !== assetConfigTrendChart) {
      this.handleShowTip();
    }
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
        itemWidth: 8,
        itemHeight: 8,
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
    // 总资产占比
    const totalAssetAmountRateText = totalAssetAmount !== 0 ? `${totalAssetAmountRate}%` : '--';
    // 每类资产的资产量
    const assetClassifyElement = _.map(assetClassifyList, (item, index) => {
      const { classifyName, assetAmount, rate } = item;
      const rateText = totalAssetAmount !== 0 ? `${rate}%` : '--';
      return `
        <tr class="tableBody">
          <td>
            ${params[index].marker}
            ${classifyName}
          </td>
          <td>${rateText}</td>
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
              <th>
                类型
              </th>
              <th>占比</th>
              <th>资产量</th>
            </tr>
            <tr class="tableBody totalAsset">
              <td>
                总资产
              </td>
              <td>${totalAssetAmountRateText}</td>
              <td>${thousandFormat(totalAssetAmount)}</td>
            </tr>
            ${assetClassifyElementList}
          </table>
        </div>
      </div>
    `;
  }

  // echart渲染完，默认需要显示资金投入最大的toopTip
  @autobind
  handleReady(instance) {
    this.instance = instance;
    this.handleShowTip();
  }

  @autobind
  handleShowTip() {
    const { assetConfigTrendChart } = this.props;
    // 总资产数组
    const totalAssetAmountData = _.map(assetConfigTrendChart,
      item => _.toNumber(item.totalAssetAmount));
    // 总资产最大的dataIndex
    const dataIndex = _.findIndex(totalAssetAmountData,
      item => (item === _.max(totalAssetAmountData)));
    // 数据是dataIndex的toolTip
    // 图表所有数据加载完成，调用dispatchAction方法显示浮层提示框
    // 参考网址：https://blog.csdn.net/u013558749/article/details/83826672
    setTimeout(() => {
      if (this.instance) {
        this.instance.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex,
        });
      }
    }, 0);
  }

  render() {
    const { assetConfigTrendChart } = this.props;
    // echart图表配置项
    const option = this.getChartOption();
    return (
      <div className={styles.assetConfigTrendChart}>
        <IfWrap isRender={!_.isEmpty(assetConfigTrendChart)}>
          <IECharts
            onReady={this.handleReady}
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
