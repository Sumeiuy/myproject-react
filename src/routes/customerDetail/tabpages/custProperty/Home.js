/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性
 * @Date: 2018-11-06 16:17:28
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-26 16:04:58
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';
import withRouter from '../../../../decorators/withRouter';
import PersonInfo from '../../../../components/customerDetailCustProperty/personInfo';
import OrganizationInfo from '../../../../components/customerDetailCustProperty/organizationInfo';
import ProductInfo from '../../../../components/customerDetailCustProperty/productInfo';
import MemberInfo from '../../../../components/customerDetailCustProperty/memberInfo';
import { CUST_TYPE } from '../../../../components/customerDetailCustProperty/config';
import { permission } from '../../../../helper';
import logable from '../../../../decorators/logable';

import styles from './home.less';

const TabPane = Tabs.TabPane;

// const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
const {
  // 个人客户类型标识
  PERSON_CUST_TYPE,
  // 普通机构客户类型标识
  ORGANIZATION_CUST_TYPE,
  // 产品机构客户类型标识
  PRODUCT_CUST_TYPE,
} = CUST_TYPE;

// 财务信息TAB的key
const FINANCE_INFO_KEY = 'financeInfo';
// 合作业务TAB的key
const COOPERATION_KEY = 'cooperation';
// 营销与服务TAB的key
const MARKETING_KEY = 'marketing';
// 会员信息TAB的key
const MEMBER_INFO_KEY = 'memberInfo';
// 关系信息TAB的key
const RELATION_INFO_KEY = 'relationInfo';
// 表格每页显示数据
const PAGE_SIZE = 10;

@withRouter
export default class CustProperty extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 获取客户属性信息
    queryCustomerProperty: PropTypes.func.isRequired,
    custInfo: PropTypes.object.isRequired,
    // 获取涨乐财富通U会员信息
    queryZLUmemberInfo: PropTypes.func.isRequired,
    zlUMemberInfo: PropTypes.object.isRequired,
    // 获取涨乐财富通U会员等级变更记录
    queryZLUmemberLevelChangeRecords: PropTypes.func.isRequired,
    zlUMemberLevelChangeRecords: PropTypes.object.isRequired,
    // 客户基本信息 从modals/customerDetail中取得
    customerBasicInfo: PropTypes.object.isRequired,
    // 获取紫金积分会员信息
    queryZjPointMemberInfo: PropTypes.func.isRequired,
    zjPointMemberInfo: PropTypes.object.isRequired,
    // 获取紫金积分会员积分兑换流水
    queryZjPointExchangeFlow: PropTypes.func.isRequired,
    zjPointExchangeFlow: PropTypes.object.isRequired,
    // 修改个人客户、机构客户的基本信息
    updateCustBasicInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: MEMBER_INFO_KEY,
    };
  }

  componentDidMount() {
    const {
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    this.queryData(custId);
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: {
          custId: prevCustId,
        },
      },
    } = prevProps;
    const {
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    // url中custId发生变化时重新请求相关数据
    if (prevCustId !== custId) {
      this.queryData(custId);
    }
  }

  // 客户信息中有些字段需要做隐私控制，只有主，辅服务经理，拥有“HTSC 客户资料-总部管理岗”或“HTSC 隐私信息查询权限”职责的用户可查看；
  @autobind
  hasDuty() {
    const {
      customerBasicInfo: {
        isMainEmp,
        isAssistantEmp,
      },
    } = this.props;
    return (
      isMainEmp
      || isAssistantEmp
      || permission.hasHTSCPrivateInfoCheck()
      || permission.hasCIHMPPermission()
    );
  }

  // 和custId相关的接口，初次调用和custId发生变化时调用，避免多次重复写，统一放到一个方法里
  @autobind
  queryData(custId) {
    const {
      queryCustomerProperty,
    } = this.props;
    queryCustomerProperty({
      custId,
    });
  }

  @autobind
  renderPersonInfo() {
    const {
      custInfo: {
        person = EMPTY_OBJECT,
      },
      updateCustBasicInfo,
      location,
      queryCustomerProperty,
    } = this.props;
    return (
      <PersonInfo
        queryCustomerProperty={queryCustomerProperty}
        location={location}
        updateCustBasicInfo={updateCustBasicInfo}
        hasDuty={this.hasDuty()}
        data={person}
      />
    );
  }

  @autobind
  renderOrganizationInfo() {
    const {
      custInfo: {
        organization = EMPTY_OBJECT,
      }
    } = this.props;
    return (
      <OrganizationInfo
        hasDuty={this.hasDuty()}
        data={organization}
      />
    );
  }

  @autobind
  renderProductInfo() {
    const {
      custInfo: {
        product = EMPTY_OBJECT,
      }
    } = this.props;
    return (
      <ProductInfo
        hasDuty={this.hasDuty()}
        data={product}
      />
    );
  }

  // 根据不同的客户类型渲染不同的客户信息组件
  @autobind
  renderCustInfo() {
    const { custInfo: { custNature } } = this.props;
    let component = null;
    switch (custNature) {
      case PERSON_CUST_TYPE:
        // 如果客户类型是个人客户
        component = this.renderPersonInfo();
        break;
      case ORGANIZATION_CUST_TYPE:
        // 如果客户类型是普通机构客户
        component = this.renderOrganizationInfo();
        break;
      case PRODUCT_CUST_TYPE:
        // 如果客户类型是产品机构客户
        component = this.renderProductInfo();
        break;
      default:
        break;
    }
    return component;
  }

  @autobind
  @logable({ type: 'Click',
  payload: { name: '客户属性下tab切换' } })
  handleTabChange(activeKey) {
    this.setState({
      activeKey,
    });
  }

  render() {
    const {
      location,
      zlUMemberInfo,
      zlUMemberLevelChangeRecords,
      queryZLUmemberInfo,
      queryZLUmemberLevelChangeRecords,
      queryZjPointMemberInfo,
      zjPointMemberInfo,
      queryZjPointExchangeFlow,
      zjPointExchangeFlow,
    } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={styles.custPropertyBox}>
        <div className={styles.custInfoBox}>
          {
            this.renderCustInfo()
          }
        </div>
        <div className={styles.tabBox}>
          <Tabs
            className={styles.tab}
            activeKey={activeKey}
            animated={false}
            tabBarGutter={2}
            onChange={this.handleTabChange}
          >
            <TabPane tab="财务信息" key={FINANCE_INFO_KEY}>
            </TabPane>
            <TabPane tab="合作业务" key={COOPERATION_KEY}>
            </TabPane>
            <TabPane tab="营销与服务" key={MARKETING_KEY}>
            </TabPane>
            <TabPane tab="会员信息" key={MEMBER_INFO_KEY}>
              <MemberInfo
                location={location}
                queryZLUmemberInfo={queryZLUmemberInfo}
                queryZLUmemberLevelChangeRecords={queryZLUmemberLevelChangeRecords}
                zlUMemberInfo={zlUMemberInfo}
                zlUMemberLevelChangeRecords={zlUMemberLevelChangeRecords}
                queryZjPointMemberInfo={queryZjPointMemberInfo}
                zjPointMemberInfo={zjPointMemberInfo}
                queryZjPointExchangeFlow={queryZjPointExchangeFlow}
                zjPointExchangeFlow={zjPointExchangeFlow}
              />
            </TabPane>
            <TabPane tab="关系信息" key={RELATION_INFO_KEY}>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
