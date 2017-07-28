/**
 * @description 历史对比折线图
 * @author sunweibin
 * @fileOverview history/HistoryComparePolyChart.js
 */

import React, { PropTypes, PureComponent } from 'react';

// import IECharts from '../IECharts';
import styles from './HistoryComparePolyChart.less';

export default class HistoryComparePolyChart extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  // constructor(props) {
  //   super(props);
  // }

  render() {
    console.warn('HistoryComparePolyChart', this.props.data);
    // 折线图配置项
    // const options = {
    //   animation: true,
    //   xAxis: {
    //     type: 'category',
    //     splitLine: {
    //       show: false,
    //     },
    //     axisPointer: {
    //         value: '2016-10-7',
    //         snap: true,
    //         lineStyle: {
    //             color: '#004E52',
    //             opacity: 0.5,
    //             width: 2
    //         },
    //         label: {
    //             show: false,
    //         },
    //         handle: {
    //             show: true,
    //             icon:'circle',
    //             color: '#004E52'
    //         }
    //     },
    //   },
    //   yAxis: {
    //     type: 'value',
    //     axisTick: {
    //       inside: true,
    //     },
    //     splitLine: {
    //       show: false,
    //     },
    //     z: 10,
    //   },
    //   series: [],
    // };
    return (
      <div className={styles.historyPoly}>
        <div className={styles.chartHd}>
          <div className={styles.headerLeft}>
            <span className={styles.chartHdCaption}>历史对比</span>
            <span className={styles.chartUnit}>(万元)</span>
          </div>
        </div>
        <div className={styles.chartMain}>
          {/*
            <IECharts
              option={options}
              resizable
              style={{
                height: '325px',
              }}
            />
          */}
        </div>
        <div className={styles.chartFoot}>
          <span className={styles.tipDot} />
          <span className={styles.tipIndicator}>总交易量</span>
          <span className={styles.tipTime}>2017/05/16:</span>
          <span className={styles.currentValue}>68.78</span>
          <span className={styles.tipUnit}>万元</span>
          <span className={styles.tipTime}>2017/05/17</span>
          <span className={styles.contrastValue}>68.78</span>
          <span className={styles.tipUnit}>万元</span>
        </div>
      </div>
    );
  }
}
