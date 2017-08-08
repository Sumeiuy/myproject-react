/**
 * @fileOverview chartRealTime/ChartRadar.js
 * @author yangquanjian
 * @description 雷达图
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import IECharts from '../IECharts';
import styles from './chartRadar.less';

const orgClass = {
  level2: '分公司',
  level3: '营业部',
};

export default class ChartRadar extends PureComponent {

  static propTypes = {
    radarData: PropTypes.array.isRequired,
    total: PropTypes.string.isRequired,
    localScope: PropTypes.string.isRequired,
    selectCore: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    const { localScope } = props;
    this.state = {
      levelName: orgClass[`level${localScope}`],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { localScope: preLevel, radarData: preRadar } = this.props;
    const { localScope, radarData } = nextProps;
    if (preLevel !== localScope) {
      this.setState({
        levelName: orgClass[`level${localScope}`],
      });
    }
    if (!_.isEqual(radarData, preRadar)) {
      this.state.radar.clear();
      // TODO 当数据变化的时候，需要修改options
    }
  }

  componentWillUnmount() {
    const { radar } = this.state;
    if (radar && radar.clear) {
      radar.clear();
    }
  }

  @autobind
  createOption(scopeNum, data) {
    const indicatorData = [];// name
    const period = []; // 本期数据值
    const PreviousPeriod = []; // 上期
    // const realPeriod = []; // 本期真实数据
    // const realPrevious = []; // 上期真实数据
    _.each(data, (item) => {
      const { indicator_name: name, rank_current: current, rank_contrast: contrast } = item;
      indicatorData.push({ name, max: scopeNum });
      period.push(scopeNum - current);
      // realPeriod.push(current);
      PreviousPeriod.push(scopeNum - contrast);
      // realPrevious.push(contrast);
    });
    const options = {
      title: {
        show: false,
        text: '指示分析',
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
        indicator: indicatorData,
      },
      series: [{
        name: '本期 vs 上期',
        type: 'radar',
        smooth: true,
        symbolSize: 1,
        data: [
          {
            value: period,
            name: '本期',
            areaStyle: {
              normal: {
                color: 'rgba( 56, 216, 232, 0.2 )',
              },
            },
            itemStyle: {
              normal: {
                color: '#38d8e8',
                lineStyle: {
                  color: 'rgb( 56, 216, 232 )',
                  width: 1,
                },
              },
            },
            label: {
              normal: {
                show: true,
                formatter(p) {
                  return scopeNum - p.value;
                },
                textStyle: {
                  color: '#ff7a39',
                },
              },
            },
          },
          {
            value: PreviousPeriod,
            name: '上期',
            areaStyle: {
              normal: {
                left: '10px',
                color: 'rgba( 117, 111, 184, 0.2 )',
              },
            },
            itemStyle: {
              normal: {
                color: '#756fb8',
                lineStyle: {
                  color: 'rgb( 117, 111, 184 )',
                  width: 1,
                },
              },
            },
            label: {
              normal: {
                show: true,
                formatter(p) {
                  return scopeNum - p.value;
                },
                textStyle: {
                  color: '#3983ff',
                },
              },
            },
          },
        ],
      }],
    };
    return options;
  }

  @autobind
  radarOnReady(instance) {
    this.setState({
      radar: instance,
    });
  }

  // @autobind
  // labelShow(params) {
  //   // const { selectIndex } = this.state;
  //   // const { indexData } = this.props;
  //   // const current = indexData.data[selectIndex].rank_current;
  //   // const contrast = indexData.data[selectIndex].rank_contrast;
  //   // const dataMode = [current, contrast]; // 选中项的排名
  //   // const dataIndex = params.dataIndex; // 图标数据下标 本期、上期
  //   // const preValue = params.value; // 当先图标数值
  //   // const gcount = indexData.scopeNum; // 总公司数
  //   // if (preValue === (gcount - dataMode[dataIndex])) {
  //   //   return dataMode[dataIndex];
  //   // }
  //   // return '';
  // }

  render() {
    const { radarData, total, selectCore, localScope } = this.props;
    if (localScope === '1') {
      return null;
    }
    const { levelName } = this.state;
    const options = this.createOption(total, radarData);
    return (
      <div className={styles.radarBox}>
        <div className={styles.titleDv}>强弱指示分析</div>
        <div className={styles.radar}>
          <IECharts
            option={options}
            resizable
            onReady={this.radarOnReady}
            style={{
              height: '380px',
            }}
          />
        </div>
        <div className={styles.radarInfo}>
          <i />{radarData[selectCore].indicator_name}：本期排名：
            <span className={styles.now}>
              {radarData[selectCore].rank_current}
            </span>
            上期排名：
            <span className={styles.before}>
              {radarData[selectCore].rank_contrast}
            </span>
            共 <span className={styles.all}>{total}</span> 家{levelName}
        </div>
      </div>
    );
  }
}
