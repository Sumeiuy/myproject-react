/*
 * @Author: yuanhaojie
 * @Date: 2018-12-04 13:54:08
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-12-04 18:22:00
 * @Description: 首页-投顾绩效-图表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import ChartContiner from './ChartContainer';
import IECharts from '../IECharts';
import {
  getOpenedAccountsChartData,
} from './utils';
import styles from './performanceCharts.less';

export default class PerformanceCharts extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object.isRequired,
  };

  // 业务开通（户）
  @autobind
  renderOpenedAccounts() {
    const { option } = getOpenedAccountsChartData(this.props.indicators);
    return (
      <ChartContiner dataSource={{ title: '业务开通（户）' }}>
        <IECharts
          option={option}
          style={{
            height: '200px',
            paddingTop: '15px',
          }}
          resizable
        />
      </ChartContiner>
    );
  }

  // 净创收
  @autobind
  renderNetIncome() {
  }

  render() {
    const gutter = 18;
    return (
      <div className={styles.indexBox}>
        <div className={styles.listItem}>
          <Row gutter={gutter}>
            <Col span={8}>
              TEST1
            </Col>
            <Col span={8}>
              TEST2
            </Col>
            <Col span={8}>
              TEST3
            </Col>
          </Row>
        </div>
        <div className={styles.listItem}>
          <Row gutter={gutter}>
            <Col span={8}>
              {this.renderOpenedAccounts()}
            </Col>
            <Col span={8}>
              {this.renderNetIncome()}
            </Col>
            <Col span={8}>
              TEST6
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
