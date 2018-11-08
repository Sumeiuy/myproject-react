/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性
 * @Date: 2018-11-06 16:17:28
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-08 19:20:49
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
import config from '../../../../components/customerDetailCustProperty/config';

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
} = config;

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

  // 和custId相关的接口，初次调用和custId发生变化时调用，接口比较多，避免多次重复写，统一放到一个方法里
  @autobind
  queryData(custId) {
    const {
      queryCustomerProperty,
      queryZLUmemberInfo,
      queryZLUmemberLevelChangeRecords,
    } = this.props;
    queryCustomerProperty({
      custId,
    });
    queryZLUmemberInfo({
      custId,
    });
    queryZLUmemberLevelChangeRecords({
      custId,
      pageSize: PAGE_SIZE,
      pageNum: 1,
    });
  }

  // 根据不同的客户类型渲染不同的客户信息组件
  @autobind
  renderCustInfo() {
    const {
      customerBasicInfo: {
        custNature,
      },
      custInfo: {
        person = EMPTY_OBJECT,
        organization = EMPTY_OBJECT,
        product = EMPTY_OBJECT,
      }
    } = this.props;
    let component = null;
    switch (custNature) {
      // 如果客户类型是个人客户
      case personCustType:
        component = (
          <PersonInfo
            data={person}
          />
        );
        break;
      // 如果客户类型是普通机构客户
      case organizationCustType:
        component = (
          <OrganizationInfo
            data={organization}
          />
        );
        break;
      // 如果客户类型是产品机构客户
      case productCustType:
        component = (
          <ProductInfo
            data={product}
          />
        );
        break;
      default:
        component = (
          <ProductInfo
            data={product}
          />
        );
        break;
    }
    return component;
  }

  render() {
    const {
      zlUMemberInfo,
      zlUMemberLevelChangeRecords,
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
            defaultActiveKey={'memberInfo'}
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
                zlUMemberInfo={zlUMemberInfo}
                zlUMemberLevelChangeRecords={zlUMemberLevelChangeRecords}
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
