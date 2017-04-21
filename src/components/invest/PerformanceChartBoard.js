/**
 * @fileOverview components/invest/PreformanceChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Button, Icon } from 'antd';

import ChartBoard from './ChartBoard';

import styles from './PerformanceChartBoard.less';

export default class PerformanceChartBoard extends PureComponent {

  static propTypes = {
    chartData: PropTypes.array,
  }

  static defaultProps = {
    chartData: [],
  }

  render() {
    const { chartData } = this.props;
    if (chartData.length === 0) {
      return null;
    }
    return (
      <div>
        <div className={styles.titleBar}>
          <div className={styles.titleText}>指标分布</div>
          <div className={styles.exportBtn}>
            <Button><Icon type="export" />导出</Button>
          </div>
        </div>
        <ChartBoard chartData={chartData} />
      </div>
    );
  }
}
