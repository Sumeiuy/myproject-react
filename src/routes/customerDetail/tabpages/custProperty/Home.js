/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性
 * @Date: 2018-11-06 16:17:28
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-12 14:43:55
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

import styles from './home.less';

const TabPane = Tabs.TabPane;

// const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
const PAGE_SIZE = 10;
const {
  // 个人客户类型标识
  personCustType,
  // 普通机构客户类型标识
  organizationCustType,
  // 产品机构客户类型标识
  productCustType,
} = CUST_TYPE;

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

  // 和custId相关的接口，初次调用和custId发生变化时调用，接口比较多，避免多次重复写，统一放到一个方法里
  @autobind
  queryData(custId) {
    const {
      queryCustomerProperty,
      queryZLUmemberInfo,
      queryZLUmemberLevelChangeRecords,
      queryZjPointMemberInfo,
      queryZjPointExchangeFlow,
    } = this.props;
    queryCustomerProperty({
      custId,
    });
    queryZLUmemberInfo({
      custId,
    });
    queryZjPointMemberInfo({
      custId,
    });
    queryZLUmemberLevelChangeRecords({
      custId,
      pageSize: PAGE_SIZE,
      pageNum: 1,
    });
    queryZjPointExchangeFlow({
      custId,
      pageSize: PAGE_SIZE,
      pageNum: 1,
    });
  }

  @autobind
  renderPersonInfo() {
    const {
      custInfo: {
        person = EMPTY_OBJECT,
      }
    } = this.props;
    return (
      <PersonInfo
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
    const {
      custInfo: {
        custNature,
      },
    } = this.props;
    let component = null;
    switch (custNature) {
      // 如果客户类型是个人客户
      case personCustType:
        component = this.renderPersonInfo();
        break;
      // 如果客户类型是普通机构客户
      case organizationCustType:
        component = this.renderOrganizationInfo();
        break;
      // 如果客户类型是产品机构客户
      case productCustType:
        component = this.renderProductInfo();
        break;
      default:
        component = this.renderPersonInfo();
        break;
    }
    return component;
  }

  render() {
    const {
      location,
      zlUMemberInfo,
      zlUMemberLevelChangeRecords,
      zjPointMemberInfo,
      zjPointExchangeFlow,
      queryZLUmemberLevelChangeRecords,
      queryZjPointExchangeFlow
    } = this.props;
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
            defaultActiveKey="memberInfo"
            animated={false}
            tabBarGutter={2}
          >
            <TabPane tab="财务信息" key="financeInfo">
            </TabPane>
            <TabPane tab="合作业务" key="cooperation">
            </TabPane>
            <TabPane tab="营销与服务" key="marketing">
            </TabPane>
            <TabPane tab="会员信息" key="memberInfo">
              <MemberInfo
                location={location}
                zlUMemberInfo={zlUMemberInfo}
                zlUMemberLevelChangeRecords={zlUMemberLevelChangeRecords}
                zjPointExchangeFlow={zjPointExchangeFlow}
                zjPointMemberInfo={zjPointMemberInfo}
                queryZLUmemberLevelChangeRecords={queryZLUmemberLevelChangeRecords}
                queryZjPointExchangeFlow={queryZjPointExchangeFlow}
              />
            </TabPane>
            <TabPane tab="关系信息" key="relationInfo">
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
