/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-09 16:14:37
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';

import withRouter from '../../decorators/withRouter';

import styles from './home.less';

const TabPane = Tabs.TabPane;

@withRouter
export default class Home extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 新版客户360详情中的概要信息
    summaryInfo: PropTypes.object.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 当前的tab页面, 默认展示 账户信息 Tab页
      activeTabKey: 'accountInfo',
    };
  }

  componentDidMount() {

  }

  // 切换客户360详情页的Tab
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey });
  }

  render() {
    const { activeTabKey } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.breadCrumb}>面包屑</div>
        <div className={styles.custInfo}>
          <div className={styles.custBasicInfo}>基本信息</div>
          <div className={styles.custDetailInfo}>详细信息</div>
        </div>
        <div className={styles.tabContainer}>
          <Tabs
            activeKey={activeTabKey}
            className={styles.tab}
            defaultActiveKey={'accountInfo'}
            onChange={this.handleTabChange}
            animated={false}
            tabBarGutter={40}
          >
            <TabPane tab="账号信息" key="accountInfo">
            </TabPane>
            <TabPane tab="客户属性" key="customerInfo">
            </TabPane>
            <TabPane tab="业务办理" key="businessProcessing">
            </TabPane>
            <TabPane tab="服务记录" key="serviceRecord">
            </TabPane>
            <TabPane tab="服务关系" key="serviceRelation">
            </TabPane>
            <TabPane tab="涨乐会员" key="zhangleVIP">
            </TabPane>
            <TabPane tab="合约管理" key="contractManagement">
            </TabPane>
            <TabPane tab="投资者评估" key="investorAssessment">
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
