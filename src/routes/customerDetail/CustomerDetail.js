/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-09-21 14:46:57
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tabs } from 'antd';
import withRouter from '../../decorators/withRouter';
import { dva } from '../../helper';
import styles from './customerDetail.less';

const TabPane = Tabs.TabPane;
const effect = dva.generateEffect;
const effects = {};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends PureComponent {

  static propTypes = {
  }

  static defaultProps = {
  }

  componentDidMount() {}

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.breadCrumb}>面包屑</div>
        <div className={styles.custInfo}>
          <div className={styles.custBasicInfo}>基本信息</div>
          <div className={styles.custDetailInfo}>详细信息</div>
        </div>
        <div className={styles.tabContainer}>
          <Tabs
            className={styles.tab}
            defaultActiveKey={'accountInfo'}
            onTabClick={this.handleTabClick}
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
