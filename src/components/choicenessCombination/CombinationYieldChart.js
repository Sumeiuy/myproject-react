/*
 * @Author: XuWenKang
 * @Description: 收益率走势图
 * @Date: 2018-04-25 13:55:06
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-21 19:12:51
*/

import React, { Component } from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import IECharts from '../IECharts';
import styles from './combinationYieldChart.less';
import logable from '../../decorators/logable';
import { chartTabList } from '../../components/choicenessCombination/config';

const TabPane = Tabs.TabPane;
// const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
// 图表legend文字显示最大长度
const LEGEND_MAX_LENGTH = 8;

export default class CombinationYieldChart extends Component {
  static propTypes = {
    // tab切换
    tabChange: PropTypes.func.isRequired,
    // 对应的组合code
    combinationCode: PropTypes.string,
    // 对应的组合数据
    combinationItemData: PropTypes.object.isRequired,
    // 图表数据
    chartData: PropTypes.object.isRequired,
    // 组合排名tab当前选择的key
    rankTabActiveKey: PropTypes.string,
    // 图表高度
    chartHeight: PropTypes.string,
    // 标题
    title: PropTypes.string,
    isDetail: PropTypes.bool,
  }

  static defaultProps = {
    combinationCode: '',
    rankTabActiveKey: '',
    chartHeight: '166px',
    title: '收益率走势',
    isDetail: false,
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
      rankTabActiveKey,
      chartData,
      isDetail,
    } = this.props;
    // 如果是详情,并且图标数据发生变化
    if (isDetail && chartData.combinationCode !== newChartData.combinationCode) {
      this.setActiveKeyByIsAsset();
    }
    // 如果组合排名tab选中的key发生变化，重置chart里面tab的选中key
    if (newRankTabActiveKey !== rankTabActiveKey) {
      this.setState({
        activeKey: '',
      });
    }
    const { activeKey } = this.state;
    // 判断一下，如果图表数据有并且activeKey是空的话根据组合类型设置预设值
    if (_.isEmpty(activeKey) && !_.isEmpty(newChartData)) {
      this.setActiveKeyByIsAsset();
    }
  }

  @autobind
  setActiveKeyByIsAsset() {
    const { combinationItemData } = this.props;
    const isAsset = _.isNull(combinationItemData.weekEarnings);
    this.setState({
      // 如果是资产配置类组合默认值‘近一年’，否则‘近三个月’
      activeKey: isAsset ? chartTabList[1].key : chartTabList[0].key,
    });
  }

  @autobind
  getTabPaneList() {
    const { combinationItemData } = this.props;
    const isAsset = _.isNull(combinationItemData.weekEarnings);
    // 如果是资产配置类组合不显示近三个月的选项
    const list = isAsset ? chartTabList.slice(1, chartTabList.length) : chartTabList;
    return list.map(item => (
      <TabPane tab={item.label} key={item.key} />
    ));
  }

  @autobind
  getLegendData() {
    const { chartData, combinationItemData } = this.props;
    const legendData = [chartData.combinationName];
    const isAsset = _.isNull(combinationItemData.weekEarnings);
    // 如果非资产配置类组合，并且查询趋势图接口返回的baseName字段不为空，返回就多显示一个基准线
    if (!isAsset && !_.isEmpty(chartData.baseName)) {
      legendData.push(chartData.baseName);
    }
    return legendData;
  }

  @autobind
  getSeriesData() {
    const { chartData, combinationItemData } = this.props;
    const isAsset = _.isNull(combinationItemData.weekEarnings);
    const seriesData = [{
      data: chartData.combinationLine,
      type: 'line',
      name: chartData.combinationName,
      lineStyle: {
        normal: {
          color: 'rgb(141,189,233)',
        },
      },
    }];
    // 如果非资产配置类组合，并且查询趋势图接口返回的baseName字段不为空，返回就多显示一个基准线
    if (!isAsset && !_.isEmpty(chartData.baseName)) {
      seriesData.push({
        data: chartData.baseLine,
        type: 'line',
        name: chartData.baseName,
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
    const { chartData, combinationItemData } = this.props;
    const combinationNum = (chartData.combinationLine || EMPTY_ARRAY)[params[0].dataIndex] || 0;
    const isAsset = _.isNull(combinationItemData.weekEarnings);
    // 如果非资产配置类组合，并且查询趋势图接口返回的baseName字段不为空，返回就多显示一个基准数据
    if (!isAsset && !_.isEmpty(chartData.baseName)) {
      const baseNum = (chartData.baseLine || EMPTY_ARRAY)[params[0].dataIndex] || 0;
      return `
        <div>${params[0].axisValueLabel}</div>
        <div>${params[0].marker}${params[0].seriesName}: ${combinationNum.toFixed(2)}%</div>
        <div>${params[1].marker}${params[1].seriesName}: ${baseNum.toFixed(2)}%</div>
      `;
    }
    return `
      <div>${params[0].axisValueLabel}</div>
      <div>${params[0].marker}${params[0].seriesName}: ${combinationNum.toFixed(2)}%</div>
    `;
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '收益率走势图',
      value: '$args[0]',
    },
  })
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
      chartHeight,
      title,
    } = this.props;
    // const itemData = chartData[combinationCode] || EMPTY_OBJECT;
    const option = {
      legend: {
        data: this.getLegendData(),
        bottom: 0,
        itemHeight: 0,
        itemWidth: 10,
        itemGap: 5,
        textStyle: {
          fontSize: 10,
        },
        selectedMode: false,
        formatter: name => (
          name.length > LEGEND_MAX_LENGTH ? `${name.slice(0, LEGEND_MAX_LENGTH)}...` : name
        ),
      },
      xAxis: {
        type: 'category',
        data: chartData.timeLine,
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          fontSize: 10,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} %',
          fontSize: 10,
        },
      },
      series: this.getSeriesData(),
      tooltip: {
        trigger: 'axis',
        formatter: this.tooltipFormat,
      },
      color: ['#8dBde9', '#eb9a9a'],
      grid: {
        height: 'auto',
        width: 'auto',
        top: 10,
        bottom: 45,
        left: 48,
        right: 30,
      },
    };
    // 如果是资产配置类默认显示近一年，否则显示近三个月
    // const defaultActiveKey = true ? chartTabList[1].key : chartTabList[0].key;
    return (
      <div className={styles.yieldChartBox}>
        <h3>{title}</h3>
        <div className={styles.tabBox}>
          <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
            {this.getTabPaneList()}
          </Tabs>
        </div>
        <div className={styles.chartWrapper}>
          <IECharts
            key={chartData.combinationCode}
            option={option}
            resizable
            style={{
              height: chartHeight,
            }}
            notMerge
          />
        </div>
      </div>
    );
  }
}
