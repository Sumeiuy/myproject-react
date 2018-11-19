/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-09 11:07:03
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';

import withRouter from '../../decorators/withRouter';
import AccountInfo from './tabpages/accountInfo/Home';
import BreadCrumb from '../../components/customerDetail/Breadcrumb';
import SummaryInfo from '../../components/customerDetail/SummaryInfo';
import CustomerBasicInfo from '../../components/customerDetail/CustomerBasicInfo';
import ServiceRelationship from './tabpages/serviceRelationship/Home';
import CustProperty from './tabpages/custProperty/connectedHome';
import ProductOrder from './tabpages/productOrder/Home';

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
    // 客户基本信息
    customerBasicInfo: PropTypes.object.isRequired,
    // 自建任务平台的服务类型、任务反馈字典
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
    // 添加服务记录
    addServeRecord: PropTypes.func.isRequired,
    // 添加服务记录窗口
    toggleServiceRecordModal: PropTypes.func.isRequired,
    // 获取客户基本信息
    getCustomerBasicInfo: PropTypes.func.isRequired,
    // 添加打电话记录
    addCallRecord: PropTypes.func.isRequired,
    // 当前服务记录id
    currentCommonServiceRecord: PropTypes.object.isRequired,
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
    const {
      getCustomerBasicInfo,
      getMotCustfeedBackDict,
      queryCustSummaryInfo,
    } = this.props;

    if(custId) {
      // 获取客户的基本信息
      getCustomerBasicInfo({ custId });
      // 获取概要信息
      queryCustSummaryInfo({ custId });
    }
    // 获取客户反馈字典信息
    getMotCustfeedBackDict({ pageNum: 1, pageSize: 10000, type: 2 });
  }

  componentDidUpdate(prevProps) {
    const { location: { query: prevQuery } } = prevProps;
    const {
      location: { query },
      getCustomerBasicInfo,
      queryCustSummaryInfo,
    } = this.props;
    if(query && query.custId) {
      if(prevQuery && prevQuery.custId) {
        if(query.custId !== prevQuery.custId) {
          // 查询基本信息
          getCustomerBasicInfo({ custId: query.custId });
          // 查询概要信息
          queryCustSummaryInfo({ custId: query.custId });
        }
      } else {
        // 查询基本信息
        getCustomerBasicInfo({ custId: query.custId });
        // 查询概要信息
        queryCustSummaryInfo({ custId: query.custId });
      }
    }
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
      addServeRecord,
      motSelfBuiltFeedbackList,
      toggleServiceRecordModal,
      customerBasicInfo,
      addCallRecord,
      currentCommonServiceRecord,
    } = this.props;

    const breadCrumbProps = {
      push: this.context.push,
      url: location.state && location.state.url,
    };

    // 客户基本信息组件props
    const CustomerBasicInfoProps = {
      push: this.context.push,
      addServeRecord,
      motSelfBuiltFeedbackList,
      toggleServiceRecordModal,
      customerBasicInfo,
      addCallRecord,
      currentCommonServiceRecord,
    };

    return (
      <div className={styles.container}>
        <div className={styles.breadCrumb}><BreadCrumb {...breadCrumbProps} /></div>
        <div className={styles.custInfo}>
          <div className={styles.custBasicInfo}>
            <CustomerBasicInfo {...CustomerBasicInfoProps}/>
          </div>
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
            <TabPane tab="账户信息" key="accountInfo">
              <AccountInfo location={location} />
            </TabPane>
            <TabPane tab="客户属性" key="customerInfo">
              <CustProperty />
            </TabPane>
            <TabPane tab="业务办理" key="businessProcessing">
            </TabPane>
            <TabPane tab="服务记录" key="serviceRecord">
            </TabPane>
            <TabPane tab="服务关系" key="serviceRelation">
              <ServiceRelationship location={location} />
            </TabPane>
            <TabPane tab="合约管理" key="contractManagement">
            </TabPane>
            <TabPane tab="投资者评估" key="investorAssessment">
            </TabPane>
            <TabPane tab="产品订单" key="productOrder">
              <ProductOrder />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
