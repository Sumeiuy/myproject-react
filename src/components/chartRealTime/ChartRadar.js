/**
 * @fileOverview chartRealTime/ChartRadar.js
 * @author yangquanjian
 * @description 雷达图
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import IECharts from '../IECharts';
import styles from './chartRadar.less';

export default class ChartRadar extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    chartData: PropTypes.object,
  }

  static defaultProps = {
    location: {},
    chartData: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      wrapperH: 0,
    };
  }

  componentDidMount() {
    const element = this.getElement;
    this.getEmelHeight(element);
  }

  @autobind
  getEmelHeight(element) {
    this.setState({
      wrapperH: element.clientHeight,
    });
  }

  @autobind
  labelShow(params) {
    const dataMode = [2, 1]; // 选中项的排名
    const dataIndex = params.dataIndex; // 图标数据下标 本期、上期
    const preValue = params.value; // 当先图标数值
    const gcount = 32; // 总公司数
    if (preValue === (gcount - dataMode[dataIndex])) {
      return dataMode[dataIndex];
    }
    return '';
  }

  render() {
    const options = {
      title: {
        show: false,
        text: '强弱指示分析',
      },
      gird: { x: '7%', y: '7%', width: '38%', height: '38%' },
      legend: {
        data: [
          { name: '本期', icon: 'square' },
          { name: '上期', icon: 'square' },
        ],
        bottom: 0,
        left: '10%',
        itemGap: 20,
      },
      radar: {
        shape: 'circle',
        splitNumber: 6,
        // polarIndex: 1,
        center: ['50%', '45%'],
        name: {
          textStyle: {
            color: '#666666',
          },
        },
        splitLine: {
          lineStyle: {
            color: [
              '#ebf2ff',
            ].reverse(),
          },
        },
        splitArea: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#b9e7fd',
          },
        },
        indicator: [
          { name: '有效客户数', max: 32 },
          { name: '强弱指示分析', max: 32 },
          { name: '有效客户数', max: 32 },
          { name: '基础股基交易率', max: 32 },
          { name: 'OTC产品销量', max: 32 },
          { name: '高净值客户', max: 32 },
          { name: '新开资产', max: 32 },
          { name: '新开客户', max: 32 },
        ],
      },
      series: [{
        name: '本期 vs 上期',
        type: 'radar',
        smooth: true,
        symbolSize: 1,
        data: [
          {
            value: [32, 30, 29, 28, 27, 31, 26, 25],
            name: '本期',
            areaStyle: {
              normal: {
                color: 'rgba(117, 111,184, 0.5)',
              },
            },
            itemStyle: {
              normal: {
                color: '#38d8e8',
              },
            },
            label: {
              normal: {
                show: true,
                formatter: this.labelShow,
                textStyle: {
                  color: '#ff7a39',
                },
              },
            },
            // symbolSize: 5,
            // syboml: 'circle',
          },
          {
            value: [30, 31, 27, 26, 28, 29, 25, 24],
            name: '上期',
            areaStyle: {
              normal: {
                color: 'rgba(58, 216,232, 0.5)',
              },
            },
            itemStyle: {
              normal: {
                color: '#756fb8',
              },
            },
            label: {
              normal: {
                show: true,
                formatter: this.labelShow,
                textStyle: {
                  color: '#3983ff',
                },
              },
            },
          },
        ],
      }],
    };
    return (
      <div ref={ref => (this.getElement = ref)} className={styles.radarBox}>
        <IECharts
          option={options}
          resizable
          style={{
            height: this.state.wrapperH,
          }}
        />
      </div>
    );
  }
}
