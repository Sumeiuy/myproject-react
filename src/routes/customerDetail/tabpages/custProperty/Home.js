/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性
 * @Date: 2018-11-06 16:17:28
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 20:14:37
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';
import PersonInfo from '../../../../components/customerDetailCustProperty/personInfo';
import OrganizationInfo from '../../../../components/customerDetailCustProperty/organizationInfo';
import ProductInfo from '../../../../components/customerDetailCustProperty/productInfo';
import MemberInfo from '../../../../components/customerDetailCustProperty/memberInfo';
import FinanceInfo from '../../../../components/customerDetailCustProperty/financeInfo';
import {
  CUST_TYPE,
  custPropertyTabMapData,
  FINANCE_INFO_KEY,
  COOPERATION_KEY,
  MARKETING_KEY,
  MEMBER_INFO_KEY,
  RELATION_INFO_KEY,
} from '../../../../components/customerDetailCustProperty/config';
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
    // 个人客户联系方式数据
    personalContactWay: PropTypes.object.isRequired,
    // 查询个人客户联系方式数据
    queryPersonalContactWay: PropTypes.func.isRequired,
    // 改变个人客户联系方式中的请勿发短信、请勿打电话
    changePhoneInfo: PropTypes.func.isRequired,
    // 查询机构客户联系方式
    queryOrgContactWay: PropTypes.func.isRequired,
    // 机构客户联系方式数据
    orgContactWay: PropTypes.object.isRequired,
    // 查询个人客户、机构客户的财务信息
    queryFinanceDetail: PropTypes.func.isRequired,
    // 财务信息数据
    financeData: PropTypes.object.isRequired,
    // 编辑个人客户的财务信息
    updatePerFinaceData: PropTypes.func.isRequired,
    // 编辑机构客户的财务信息
    updateOrgFinaceData: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
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
    if (custId && prevCustId !== custId) {
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
    this.props.queryCustomerProperty({
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
      personalContactWay,
      queryPersonalContactWay,
      changePhoneInfo,
    } = this.props;
    return (
      <PersonInfo
        location={location}
        hasDuty={this.hasDuty()}
        data={person}
        personalContactWay={personalContactWay}
        queryPersonalContactWay={queryPersonalContactWay}
        queryCustomerProperty={queryCustomerProperty}
        updateCustBasicInfo={updateCustBasicInfo}
        changePhoneInfo={changePhoneInfo}
      />
    );
  }

  @autobind
  renderOrganizationInfo() {
    const {
      custInfo: {
        organization = EMPTY_OBJECT,
      },
      orgContactWay,
      queryOrgContactWay,
      location,
    } = this.props;
    return (
      <OrganizationInfo
        location={location}
        hasDuty={this.hasDuty()}
        data={organization}
        orgContactWay={orgContactWay}
        queryOrgContactWay={queryOrgContactWay}
      />
    );
  }

  @autobind
  renderProductInfo() {
    const {
      custInfo: {
        product = EMPTY_OBJECT,
      },
      location,
      orgContactWay,
      queryOrgContactWay,
    } = this.props;
    return (
      <ProductInfo
        location={location}
        hasDuty={this.hasDuty()}
        data={product}
        orgContactWay={orgContactWay}
        queryOrgContactWay={queryOrgContactWay}
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
  @logable({
    type: 'Click',
    payload: {
      name: '$args[1]',
    },
  })
  handleTabChange(activeKey) {
    const { replace } = this.context;
    const { location: { query, pathName } } = this.props;
    replace({
      pathName,
      query: {
        ...query,
        custPropertyTabKey: activeKey,
      }
    });
  }

  render() {
    const {
      location: {
        query: {
          custPropertyTabKey = FINANCE_INFO_KEY,
        },
      },
      location,
      zlUMemberInfo,
      zlUMemberLevelChangeRecords,
      queryZLUmemberInfo,
      queryZLUmemberLevelChangeRecords,
      queryZjPointMemberInfo,
      zjPointMemberInfo,
      queryZjPointExchangeFlow,
      zjPointExchangeFlow,
      customerBasicInfo,
      queryFinanceDetail,
      financeData,
      updatePerFinaceData,
      updateOrgFinaceData,
    } = this.props;
    return (
      <div className={styles.custPropertyBox}>
        <div className={styles.custInfoBox}>
          {this.renderCustInfo()}
        </div>
        <div className={styles.tabBox}>
          <Tabs
            className={styles.tab}
            activeKey={custPropertyTabKey}
            animated={false}
            tabBarGutter={2}
            onChange={
              activeKey => this.handleTabChange(activeKey, custPropertyTabMapData[activeKey])
            }
          >
            <TabPane tab="财务信息" key={FINANCE_INFO_KEY}>
              <FinanceInfo
                location={location}
                customerBasicInfo={customerBasicInfo}
                data={financeData}
                queryFinanceDetail={queryFinanceDetail}
                updatePerFinaceData={updatePerFinaceData}
                updateOrgFinaceData={updateOrgFinaceData}
              />
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
