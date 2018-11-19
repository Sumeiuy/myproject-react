/*
 * @Author: yuanhaojie
 * @Date: 2018-11-19 10:17:54
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-19 13:00:40
 * @Description: 产品订单
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';

import styles from './home.less';

const TabPane = Tabs.TabPane;

export default class ProductOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state ={
      activeTabKey: 'serviceOrder',
    };
  }

  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey }, () => {} );
  }

  render() {
    const { activeTabKey } = this.state;

    return (
      <div className={styles.productOrderContainer}>
        <Tabs type="card" onChange={this.handleTabChange} activeKey={activeTabKey}>
          <TabPane tab="服务订购" key="serviceOrder">
            <div className={styles.tabPaneWrap}>
            </div>
          </TabPane>
          <TabPane tab="服务订单流水" key="serviceOrderFlow">
            <div className={styles.tabPaneWrap}>
            </div>
          </TabPane>
          <TabPane tab="交易订单流水" key="tradeOrderFlow">
            <div className={styles.tabPaneWrap}>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
