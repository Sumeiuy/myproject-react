/*
 * @Author: XuWenKang
 * @Description: 收益率走势图
 * @Date: 2018-04-25 13:55:06
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-25 19:40:13
*/

import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import IECharts from '../IECharts';
import styles from './combinationYieldChart.less';

const TabPane = Tabs.TabPane;
export default class CombinationYieldChart extends PureComponent {
  static propTypes = {
    // tab切换
    tabChange: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    // this.myechart = ECharts.init(document.getElementById('abcdefg'));
    // this.myechart.setOption(option);
    // console.log('aaa', this.myechart);
    // window.IECharts = this.myechart;
  }

  render() {
    const { tabChange } = this.props;
    const option = {
      legend: {
        data: ['模拟数据', '模拟数据2'],
        bottom: 0,
        itemHeight: 0,
        itemGap: 20,
      },
      xAxis: {
        type: 'category',
        data: ['2018-01-01', '2018-01-02', '2018-01-03', '2018-01-04', '2018-01-05', '2018-01-06'],
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
      series: [{
        data: [2.44, 14, 35, 20, 60, 90],
        type: 'line',
        areaStyle: {
          normal: {
            color: 'rgba(141,189,233, 0.5)',
          },
        },
        name: '模拟数据',
        lineStyle: {
          normal: {
            color: 'rgb(141,189,233)',
          },
        },
      }, {
        data: [43, 21, 51, 23, 91, 40],
        type: 'line',
        areaStyle: {
          normal: {
            color: 'rgba(235,154,154, 0.5)',
          },
        },
        name: '模拟数据2',
        lineStyle: {
          normal: {
            color: 'rgb(235,154,154)',
          },
        },
      }],
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          console.log('params', params);
          return `
            <div>${params[0].axisValueLabel}</div>
            <div>${params[0].marker}${params[0].seriesName}: baseData</div>
            <div>${params[1].marker}${params[1].seriesName}: combinationData</div>
          `;
        },
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
    return (
      <div className={styles.yieldChartBox}>
        <h3>收益率走势</h3>
        <div className={styles.tabBox}>
          <Tabs defaultActiveKey="1" onChange={tabChange}>
            <TabPane tab="近三个月" key="1" />
            <TabPane tab="近一年" key="2" />
            <TabPane tab="全部" key="3" />
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
