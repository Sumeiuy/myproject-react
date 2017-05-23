/**
 * @fileOverview components/invest/ChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
// import Loading from '../../layouts/Loading';
import ChartBar from './ChartBar';
import styles from './ChartBoard.less';

export default class ChartBoard extends PureComponent {

  static propTypes = {
    level: PropTypes.string,
    location: PropTypes.object,
    style: PropTypes.object,
    chartData: PropTypes.array,
    // loading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    level: '',
    location: {},
    style: {},
    chartData: [],
    // loading: false,
  }

  render() {
    const { chartData, location, level, style } = this.props;
    return (
      <div className={styles.board} style={style}>
        {/* <Loading loading={loading} /> */}
        <Row type="flex">
          {
            chartData.map((item, index) => {
              const chartDataIndex = `chartData${index}`;
              return (
                <Col
                  span={8}
                  key={chartDataIndex}
                  className={styles.colWrapper}
                >
                  <ChartBar
                    chartData={item}
                    location={location}
                    level={location.query.level || level}
                  />
                </Col>
              );
            })
          }
        </Row>
      </div>
    );
  }
}
