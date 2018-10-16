/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 15:21:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';

import withRouter from '../../decorators/withRouter';
import AccountInfo from './tabpages/accountInfo/Home';
import BreadCrumb from '../../components/customerDetail/Breadcrumb';
import SummaryInfo from '../../components/customerDetail/SummaryInfo';

import styles from './home.less';

const TabPane = Tabs.TabPane;

@withRouter
export default class Home extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 新版客户360详情中的概要信息
    summaryInfo: PropTypes.object.isRequired,
    // 查询新版客户360详情中的概要信息
    queryCustSummaryInfo: PropTypes.func.isRequired,
    // 更多重点标签信息
    moreLabelInfo: PropTypes.object.isRequired,
    // 查询更多重点标签
    queryAllKeyLabels: PropTypes.func.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
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
    // 初始化的时候查询客户概要信息
    const { location: { query: { custId } } } = this.props;
    this.props.queryCustSummaryInfo({ custId });
  }

  // 切换客户360详情页的Tab
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey });
  }

  render() {
    const { activeTabKey } = this.state;
    const {
      location,
      summaryInfo,
      moreLabelInfo,
      queryAllKeyLabels,
    } = this.props;

    const breadCrumbProps = {
      push: this.context.push,
      url: location.state && location.state.url,
    };

    return (
      <div className={styles.container}>
        <div className={styles.breadCrumb}><BreadCrumb {...breadCrumbProps} /></div>
        <div className={styles.custInfo}>
          <div className={styles.custBasicInfo}>基本信息</div>
          <div className={styles.custDetailInfo}>
            <SummaryInfo
              location={location}
              data={summaryInfo}
              moreLabelInfo={moreLabelInfo}
              queryAllKeyLabels={queryAllKeyLabels}
            />
          </div>
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
              <AccountInfo />
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
