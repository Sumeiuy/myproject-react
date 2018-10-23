/*
 * @Author: sunweibin
 * @Date: 2018-10-23 10:39:57
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-23 17:30:46
 * @description 新版客户360详情底部概览信息
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import AccountSummary from './AccountSummary';
import AccountDetail from './AccountDetail';
import { ACCOUNT_INFO_TABS } from './config';
import { logCommon } from '../../decorators/logable';

import styles from './accountInfoTabs.less';

const TabPane = Tabs.TabPane;

export default class AccountInfoTabs extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询账户概要Tab下的数据
    accountSummary: PropTypes.object.isRequired,
    // 查询账户概要
    queryAccountSummary: PropTypes.func.isRequired,
    // 查询普通账户、信用账户、期权账户
    queryAccountInfo: PropTypes.func.isRequired,
    accountInfo: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 默认激活的Tab，为账户概览
      activeTabKey: 'accountSummary',
    };
  }

  componentDidMount() {
    // 初始化的时候查询账户概览
    this.querySummary();
  }

  componentDidUpdate(prevProps) {
    const { location: { query: { custId: nextId } } } = this.props;
    const { location: { query: { custId: prevId } } } = prevProps;
    if (nextId !== prevId && !_.isEmpty(nextId)) {
      // 如果切换了用户，则需要将Tab切换到账户概览，并且查询下数据
      this.setState({ activeTabKey: 'accountSummary' });
      this.querySummary();
    }
  }

  // 查询账户概览
  @autobind
  querySummary() {
    const { location: { query: { custId } } } = this.props;
    if (!_.isEmpty(custId)) {
      this.props.queryAccountSummary({ custId });
    }
  }

  // 查询普通账户、信用账户、期权账户信息
  @autobind
  queryAccountInByType(accoutType) {
    const { location: { query: { custId } } } = this.props;
    if (!_.isEmpty(custId)) {
      this.props.queryAccountInfo({ custId, accoutType });
    }
  }

  // 查询接口
  @autobind
  queryApiForTab() {
    const { activeTabKey } = this.state;
    if (activeTabKey === 'accountSummary') {
      // 账户概览Tab
      this.querySummary();
    } else if (activeTabKey === 'normalAccount') {
      // 普通账户Tab
      this.queryAccountInByType('Normal');
    } else if (activeTabKey === 'creditAccount') {
      // 信用账户Tab
      this.queryAccountInByType('Credit');
    } else {
      // 期权账户Tab
      this.queryAccountInByType('Option');
    }
  }

  // 切换Tab,并且记录日志，这样主要是由于切换Tab的onChange回调没有返回Tab的名称
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey }, this.queryApiForTab);
    logCommon({
      type: 'Click',
      payload: {
        name: ACCOUNT_INFO_TABS[activeTabKey],
      },
    });
  }

  render() {
    const { accountSummary } = this.props;
    const { activeTabKey } = this.state;

    return (
      <div className={styles.tabsContainer}>
        <Tabs type="card" onChange={this.handleTabChange} activeKey={activeTabKey}>
          <TabPane tab="账户概览" key="accountSummary">
            <div className={styles.tabPaneWrap}>
              <AccountSummary data={accountSummary} />
            </div>
          </TabPane>
          <TabPane tab="普通账户" key="normalAccount">
            <div className={styles.tabPaneWrap}>
              <AccountDetail type="Normal" />
            </div>
          </TabPane>
          <TabPane tab="信用账户" key="creditAccount">
            <div className={styles.tabPaneWrap}>
              <AccountDetail type="Credit" />
            </div>
          </TabPane>
          <TabPane tab="期权账户" key="optionAccount">
            <div className={styles.tabPaneWrap}>
              <AccountDetail type="Option" />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
