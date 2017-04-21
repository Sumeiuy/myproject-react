/**
 * @fileOverview components/invest/ChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import CharBar from './ChartBar';
import styles from './ChartBoard.less';

export default class ChartBoard extends PureComponent {

  static propTypes = {
    chartData: PropTypes.array,
  }

  static defaultProps = {
    chartData: [],
  }

  render() {
    const { chartData } = this.props;
    return (
      <div className={styles.board}>
        <div className={styles.chartRow}>
          <Row type="flex">
            <Col span={6} className={styles.chartContainer}>
              <CharBar chartData={chartData[0]} />
            </Col>
            <Col span={6} className={styles.chartContainer}>
              <CharBar chartData={chartData[1]} />
            </Col>
            <Col span={6} className={styles.chartContainer}>
              <CharBar chartData={chartData[2]} />
            </Col>
            <Col span={6} className={styles.chartContainer}>
              <CharBar chartData={chartData[3]} />
            </Col>
          </Row>
        </div>
        <div className={styles.chartRow}>
          <Row type="flex">
            <Col span={6} className={styles.chartContainer}>
              <CharBar chartData={chartData[4]} />
            </Col>
            <Col span={6} className={styles.chartContainer}>
              <CharBar chartData={chartData[5]} />
            </Col>
            <Col span={6} className={styles.chartContainer}>
              <CharBar chartData={chartData[6]} />
            </Col>
            <Col span={6} className={styles.chartContainer}>
              <CharBar chartData={chartData[7]} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
