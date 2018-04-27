/*
 * @Author: XuWenKang
 * @Description: 收益率走势图
 * @Date: 2018-04-25 13:55:06
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-26 21:10:24
*/

import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import IECharts from '../IECharts';
import styles from './combinationYieldChart.less';
import { chartTabList } from '../../routes/choicenessCombination/config';

const TabPane = Tabs.TabPane;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
export default class CombinationYieldChart extends PureComponent {
  static propTypes = {
    // tab切换
    tabChange: PropTypes.func.isRequired,
    // 对应的组合code
    combinationCode: PropTypes.string,
    // 图表数据
    getCombinationLineChart: PropTypes.func.isRequired,
    chartData: PropTypes.object.isRequired,
    // 组合排名tab当前选择的key
    rankTabActiveKey: PropTypes.string,
  }

  static defaultProps = {
    combinationCode: '',
    rankTabActiveKey: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      chartData: newChartData,
      rankTabActiveKey: newRankTabActiveKey,
    } = nextProps;
    const {
      combinationCode,
      rankTabActiveKey,
    } = this.props;
    const { activeKey } = this.state;
    // 判断一下，如果图表数据有并且activeKey是空的话根据组合类型设置预设值
    if (_.isEmpty(activeKey) && !_.isEmpty(newChartData[combinationCode])) {
      this.setState({
        // 如果是资产配置类组合默认值‘近一年’，否则‘近三个月’
        activeKey: true ? chartTabList[1].key : chartTabList[0].key,
      });
    }
    // 如果组合排名tab选中的key发生变化，重置chart里面tab的选中key
    if (newRankTabActiveKey !== rankTabActiveKey) {
      this.resetActiveKey();
    }
  }

  @autobind
  getTabPaneList() {
    // const { chartData, combinationCode } = this.props;
    // const itemData = chartData[combinationCode] || EMPTY_OBJECT;
    // 如果是资产配置类组合不显示近三个月的选项
    const list = true ? chartTabList.slice(1, chartTabList.length) : chartTabList;
    return list.map(item => (
      <TabPane tab={item.label} key={item.key} />
    ));
  }

  @autobind
  getLegendData() {
    const { chartData, combinationCode } = this.props;
    const itemData = chartData[combinationCode] || EMPTY_OBJECT;
    const legendData = [itemData.combinationName];
    // 如果非资产配置类组合，就多现实一个基准线
    if (true) {
      legendData.push(itemData.baseName);
    }
    return legendData;
  }

  @autobind
  getSeriesData() {
    const { chartData, combinationCode } = this.props;
    const itemData = chartData[combinationCode] || EMPTY_OBJECT;
    const seriesData = [{
      data: itemData.combinationLine,
      type: 'line',
      areaStyle: {
        normal: {
          color: 'rgba(141,189,233, 0.5)',
        },
      },
      name: itemData.combinationName,
      lineStyle: {
        normal: {
          color: 'rgb(141,189,233)',
        },
      },
    }];
    // 如果非资产配置类组合，就多现实一个基准线
    if (true) {
      seriesData.push({
        data: itemData.baseLine,
        type: 'line',
        areaStyle: {
          normal: {
            color: 'rgba(235,154,154, 0.5)',
          },
        },
        name: itemData.baseName,
        lineStyle: {
          normal: {
            color: 'rgb(235,154,154)',
          },
        },
      });
    }
    return seriesData;
  }

  @autobind
  tooltipFormat(params) {
    const { chartData, combinationCode } = this.props;
    const itemData = chartData[combinationCode] || EMPTY_OBJECT;
    const combinationNum = (itemData.combinationData || EMPTY_ARRAY)[params[0].dataIndex];
    // 如果是资产配置类组合，就多现实一个基准数据
    if (true) {
      const baseNum = (itemData.baseData || EMPTY_ARRAY)[params[0].dataIndex];
      return `
        <div>${params[0].axisValueLabel}</div>
        <div>${params[0].marker}${params[0].seriesName}: ${combinationNum}</div>
        <div>${params[1].marker}${params[1].seriesName}: ${baseNum}</div>
      `;
    }
    return `
      <div>${params[0].axisValueLabel}</div>
      <div>${params[0].marker}${params[0].seriesName}: ${combinationNum}</div>
    `;
  }

  // 在组合排名tab切换时用于重置图表组件tab的状态
  @autobind
  resetActiveKey() {
    // const { chartData, combinationCode } = this.props;
    // const itemData = chartData[combinationCode] || EMPTY_OBJECT;
    const activeKey = true ? chartTabList[1].key : chartTabList[0].key;
    this.setState({
      activeKey,
    });
  }

  @autobind
  handleTabChange(key) {
    const { tabChange, combinationCode } = this.props;
    tabChange({
      combinationCode,
      key,
    });
    this.setState({
      activeKey: key,
    });
  }

  render() {
    const { activeKey } = this.state;
    const {
      chartData,
      combinationCode,
    } = this.props;
    const itemData = chartData[combinationCode] || EMPTY_OBJECT;
    const option = {
      legend: {
        data: this.getLegendData(),
        bottom: 0,
        itemHeight: 0,
        itemGap: 20,
      },
      xAxis: {
        type: 'category',
        data: itemData.timeLine,
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} %',
        },
      },
      series: this.getSeriesData(),
      tooltip: {
        trigger: 'axis',
        formatter: this.tooltipFormat,
      },
      color: ['#8dBde9', '#eb9a9a'],
      height: 166,
      width: 224,
      grid: {
        height: 'auto',
        width: 'auto',
        top: 10,
        bottom: 45,
        left: 45,
        right: 25,
      },
    };
    // 如果是资产配置类默认显示近一年，否则显示近三个月
    // const defaultActiveKey = true ? chartTabList[1].key : chartTabList[0].key;
    return (
      <div className={styles.yieldChartBox}>
        <h3>收益率走势</h3>
        <div className={styles.tabBox}>
          <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
            {this.getTabPaneList()}
          </Tabs>
        </div>
        <div className={styles.chartWrapper}>
          <IECharts
            option={option}
            resizable
            style={{
              height: '166px',
            }}
          />
        </div>
      </div>
    );
  }
}
