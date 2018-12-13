/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-07 11:47:09
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';

import withRouter from '../../decorators/withRouter';
import AccountInfo from './tabpages/accountInfo/connectedHome';
import BreadCrumb from '../../components/customerDetail/Breadcrumb';
import SummaryInfo from '../../components/customerDetail/SummaryInfo';
import CustomerBasicInfo from '../../components/customerDetail/CustomerBasicInfo';
import ServiceRelationship from './tabpages/serviceRelationship/Home';
import BusinessHand from './tabpages/businessHand/Home';
import CustProperty from './tabpages/custProperty/connectedHome';
import ServiceRecord from './tabpages/serviceRecord/Home';
import DiscountCoupon from './tabpages/discountCoupon/connectedHome';
import { logCommon } from '../../decorators/logable';
import ProductOrder from './tabpages/productOrder/Home';
import InvestAnalyze from './tabpages/investAnalyze/connectedHome';
import ContractManage from './tabpages/contractManage/Home';
import CustProfit from './tabpages/custProfit/Home';
import {
  ACCOUNT_INFO_TAB_KEY,
  CUSTOMER_INFO_TAB_KEY,
  INVEST_ANALYZE_TAB_KEY,
  BUNESSINESS_PROCESS_TAB_KEY,
  SERVICE_RECORD_TAB_KEY,
  SERVICE_RELATION_TAB_KEY,
  CONTRACT_MANAGE_TAB_KEY,
  /* INVESTOR_ASSESSMENT_TAB_KEY, */
  PRODUCT_ORDER_TAB_KEY,
  DISCOUNT_COUPON_TAB_KEY,
  CUST_PRFIT_TAB_KEY,
  custDetailTabMap,
} from '../../components/customerDetail/config';

// 获取客户360全部的权限信息
import getCustomerDetailPermission from '../../config/customerDetail/permission';

import IfWrap from '../../components/common/biz/IfWrap';

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
    // 字典
    cust360Dict: PropTypes.object.isRequired,
    // 查询省市城市数据
    queryProvinceCity: PropTypes.func.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    custBasic: PropTypes.object,
    cust360Dict: PropTypes.object,
    queryProvinceCity: PropTypes.func,
  };

  @autobind
  getChildContext() {
    const {
      customerBasicInfo,
      cust360Dict,
      queryProvinceCity,
    } = this.props;
    return {
      custBasic: customerBasicInfo,
      cust360Dict,
      queryProvinceCity,
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

    if (custId) {
      // 获取客户的基本信息
      getCustomerBasicInfo({ custId });
      // 获取概要信息
      queryCustSummaryInfo({ custId });
    }
    // 获取客户反馈字典信息
    getMotCustfeedBackDict({
      pageNum: 1,
      pageSize: 10000,
      type: 2,
    });
  }

  componentDidUpdate(prevProps) {
    const { location: { query: { custId: prevCustId } } } = prevProps;
    const {
      location: { query: { custId } },
      getCustomerBasicInfo,
      queryCustSummaryInfo,
    } = this.props;

    if (custId && custId !== prevCustId) {
      // 查询基本信息
      getCustomerBasicInfo({ custId });
      // 查询概要信息
      queryCustSummaryInfo({ custId });
    }
  }

  // 获取客户360页面当前的tabKey
  getActiveTabKey(accountInfoTabPermission) {
    const { location: { query: { activeTabKey } } } = this.props;
    // 初次进入客户360时，如果没有指定tab，则默认展示用户有权限看到的第一个tab
    if (!activeTabKey && !accountInfoTabPermission) {
      // 用户可以看到的第一个tab是客户属性
      return CUSTOMER_INFO_TAB_KEY;
    }
    // 有权限默认显示账户户信息tab
    return activeTabKey || ACCOUNT_INFO_TAB_KEY;
  }

  // 切换客户360详情页的Tab
  @autobind
  handleTabChange(activeTabKey) {
    const { replace } = this.context;
    const { location: { query, pathName } } = this.props;
    logCommon({
      type: 'Click',
      payload: {
        name: custDetailTabMap[activeTabKey],
      },
    });
    replace({
      pathName,
      query: {
        ...query,
        activeTabKey,
      },
    });
  }

  renderTabPane(tabPane, permission) {
    return permission ? tabPane : null;
  }

  render() {
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
      state: location.state,
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

    const {
      basicInfoPermission,
      custPropertyInfoPermission,
      custPropertyPrivateInfoPermission,
      accountInfoTabPermission,
      custPropertyTabPermission,
      businessHandTabPermission,
      serviceRecordTabPermission,
      serviceRelationshipTabPermission,
      contractManagementTabPermission,
      productOrderTabPermission,
      discountCouponTabPermission,
      investAnalyzeTabPermission,
    } = getCustomerDetailPermission(customerBasicInfo || {});

    const accountInfoTabPane = (
      <TabPane tab="账户信息" key={ACCOUNT_INFO_TAB_KEY}>
        <AccountInfo location={location} />
      </TabPane>
    );

    const custPropertyTabPane = (
      <TabPane tab="客户属性" key={CUSTOMER_INFO_TAB_KEY}>
        <CustProperty
          location={location}
          custPropertyInfoPermission={custPropertyInfoPermission}
          custPropertyPrivateInfoPermission={custPropertyPrivateInfoPermission}
        />
      </TabPane>
    );

    const investAnalyzeTabPane = (
      <TabPane tab="投资能力分析" key={INVEST_ANALYZE_TAB_KEY}>
        <InvestAnalyze
          location={location}
        />
      </TabPane>
    );

    const businessHandTabPane = (
      <TabPane tab="业务办理" key={BUNESSINESS_PROCESS_TAB_KEY}>
        <BusinessHand location={location} />
      </TabPane>
    );

    const serviceRecordTabPane = (
      <TabPane tab="服务记录" key={SERVICE_RECORD_TAB_KEY}>
        <ServiceRecord location={location} />
      </TabPane>
    );

    const serviceRelationshipTabPane = (
      <TabPane tab="服务关系" key={SERVICE_RELATION_TAB_KEY}>
        <ServiceRelationship location={location} />
      </TabPane>
    );

    const contractManageTabPane = (
      <TabPane tab="合约管理" key={CONTRACT_MANAGE_TAB_KEY}>
        <ContractManage location={location} />
      </TabPane>
    );

    const productOrderTabPane = (
      <TabPane tab="产品订单" key={PRODUCT_ORDER_TAB_KEY}>
        <ProductOrder location={location} />
      </TabPane>
    );

    const discountCouponTabPane = (
      <TabPane tab="理财优惠券" key={DISCOUNT_COUPON_TAB_KEY}>
        <DiscountCoupon location={location} />
      </TabPane>
    );

    const custProfitTabPane = (
      <TabPane tab="客户画像" key={CUST_PRFIT_TAB_KEY}>
        <CustProfit location={location} />
      </TabPane>
    );

    const currentActiveTabkey = this.getActiveTabKey(accountInfoTabPermission);

    return (
      <div className={styles.container}>
        <div className={styles.breadCrumb}><BreadCrumb {...breadCrumbProps} /></div>
        <div className={styles.custInfo}>
          <div className={styles.custBasicInfo}>
            <IfWrap isRender={basicInfoPermission}>
              <CustomerBasicInfo {...CustomerBasicInfoProps} />
            </IfWrap>
          </div>
          <div className={styles.custDetailInfo}>
            <IfWrap isRender={basicInfoPermission}>
              <SummaryInfo
                location={location}
                data={summaryInfo}
                moreLabelInfo={moreLabelInfo}
                queryAllKeyLabels={queryAllKeyLabels}
                replace={this.context.replace}
              />
            </IfWrap>
          </div>
        </div>
        <div className={styles.tabContainer}>
          <Tabs
            activeKey={currentActiveTabkey}
            className={styles.tab}
            onChange={this.handleTabChange}
            animated={false}
            tabBarGutter={4}
            type="card"
          >
            {this.renderTabPane(accountInfoTabPane, accountInfoTabPermission)}
            {this.renderTabPane(custPropertyTabPane, custPropertyTabPermission)}
            {this.renderTabPane(investAnalyzeTabPane, investAnalyzeTabPermission)}
            {this.renderTabPane(businessHandTabPane, businessHandTabPermission)}
            {this.renderTabPane(serviceRecordTabPane, serviceRecordTabPermission)}
            {this.renderTabPane(serviceRelationshipTabPane, serviceRelationshipTabPermission)}
            {this.renderTabPane(contractManageTabPane, contractManagementTabPermission)}
            {this.renderTabPane(productOrderTabPane, productOrderTabPermission)}
            {this.renderTabPane(discountCouponTabPane, discountCouponTabPermission)}
            {this.renderTabPane(custProfitTabPane, true)}
          </Tabs>
        </div>
      </div>
    );
  }
}
