/**
 * @description 历史对比排名区域
 * @author sunweibin
 * @fileOverview history/HistoryCompareRankChart.js
 */

import React, { /* PropTypes, */ PureComponent } from 'react';

import styles from './HistoryCompareRankChart.less';

export default class HistoryCompareRankChart extends PureComponent {
  static propTypes = {
    // name: React.PropTypes.string,
  };

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className={styles.historyRange}>
        <div className={styles.chartHd}>
          <div className={styles.headerLeft}>
            <span className={styles.chartHdCaption}>排名</span>
            <span className={styles.chartUnit}>(万元)</span>
          </div>
        </div>
      </div>
    );
  }
}
