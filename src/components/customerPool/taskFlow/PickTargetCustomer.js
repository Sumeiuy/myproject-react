/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-12 14:12:02
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Tabs } from 'antd';
// import { autobind } from 'core-decorators';
// import classnames from 'classnames';
// import _ from 'lodash';
import CustomerSegment from './CustomerSegment';
import styles from './pickTargetCustomer.less';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

// const FormItem = Form.Item;

const TabPane = Tabs.TabPane;

export default class PickTargetCustomer extends PureComponent {
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleTabChange(key) {
    console.log(key);
  }

  render() {
    return (
      <div className={styles.pickCustomerSection}>
        <div className={styles.title}>目标客户</div>
        <div className={styles.divider} />
        <div className={styles.tabsSection}>
          <Tabs onChange={this.handleTabChange} type="card">
            <TabPane tab="客户细分" key="1">
              <CustomerSegment />
            </TabPane>
            <TabPane tab="标签圈人" key="2">Content of Tab Pane 2</TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
