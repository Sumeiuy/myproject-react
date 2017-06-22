/**
 * @fileOverview components/invest/ChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';

import ChartBar from './ChartBar';
import styles from './ChartBoard.less';

export default class ChartBoard extends PureComponent {

  static propTypes = {
    level: PropTypes.string.isRequired,
    scope: PropTypes.number.isRequired,
    location: PropTypes.object,
    style: PropTypes.object,
    chartData: PropTypes.array,
    // loading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    location: {},
    style: {},
    chartData: [],
    // loading: false,
  }

  render() {
    const { chartData, location, level, style, scope } = this.props;
    return (
      <div className={styles.board} style={style}>
        {/* <Loading loading={loading} /> */}
        <Row type="flex">
          {
            chartData.map((item) => {
              if (!_.isObject(item)) {
                return null;
              }
              const { indiModel } = item;
              if (!indiModel) {
                return null;
              }
              return (
                <Col
                  span={8}
                  xl={{ span: 6 }}
                  key={indiModel.key}
                  className={styles.colWrapper}
                >
                  <ChartBar
                    chartData={item}
                    location={location}
                    level={location.query.level || level}
                    scope={scope}
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
