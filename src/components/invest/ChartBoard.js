/**
 * @fileOverview components/invest/ChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import Loading from '../../layouts/Loading';
import ChartBar from './ChartBar';
import styles from './ChartBoard.less';

export default class ChartBoard extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    chartData: PropTypes.array,
    loading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    location: {},
    chartData: [],
    loading: false,
  }

  render() {
    const { chartData, loading, location: { query } } = this.props;
    return (
      <div className={styles.board}>
        <Loading loading={loading} />
        <Row type="flex">
          {
            chartData.map((item, index) => {
              const chartDataIndex = `chartData${index}`;
              return (
                <Col span={6} key={chartDataIndex} className={styles.colWrapper}>
                  <ChartBar chartData={item} level={query.scope} />
                </Col>
              );
            })
          }
        </Row>
      </div>
    );
  }
}
