/**
 * @fileOverview components/invest/PreformanceChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select } from 'antd';

import Icon from '../common/Icon';
import ChartBoard from './ChartBoard';

import styles from './PerformanceChartBoard.less';

const Option = Select.Option;


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
      <div className="investPerformanceBoard">
        <div className={styles.titleBar}>
          <div className={styles.titleText}>指标分布</div>
          <div className={styles.titleBarRight}>
            <div className={styles.iconBtn1}>
              <span>排序方式:</span>
              <Select defaultValue="1" className={styles.newSelect}>
                <Option value="1">按分公司</Option>
                <Option value="2">按营业部</Option>
              </Select>
              <Select defaultValue="1" className={styles.newSelect1}>
                <Option value="1">自高到低</Option>
                <Option value="2">自低到高</Option>
              </Select>
            </div>
            <div className={styles.iconBtn}>
              <Icon type="tables" className={styles.fixMargin} />
              <Icon type="zhuzhuangtu" className={styles.fixMargin} />
            </div>
            <div className={styles.iconBtn}>
              <Icon type="daochu" />
            </div>
          </div>
        </div>
        <ChartBoard chartData={chartData} />
      </div>
    );
  }
}
