/**
 * @Author: XuWenKang
 * @Description: 客户属性-财务信息
 * @Date: 2018-11-20 15:17:42
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-20 16:37:15
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Person from './Person';
import Organization from './Organization';
import { CUST_TYPE } from '../config';
import styles from './financeInfo.less';

const {
  // 个人客户类型标识
  PERSON_CUST_TYPE,
  // 普通机构客户类型标识
  ORGANIZATION_CUST_TYPE,
} = CUST_TYPE;
const EMPTY_OBJECT = {};

export default class FinanceInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    // 客户基本信息 从modals/customerDetail中取得
    customerBasicInfo: PropTypes.object.isRequired,
    // 查询个人客户、机构客户的财务信息
    queryFinanceDetail: PropTypes.func.isRequired,
    // 编辑个人客户的财务信息
    updatePerFinaceData: PropTypes.func.isRequired,
    // 编辑机构客户的财务信息
    updateOrgFinaceData: PropTypes.func.isRequired,
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

  @autobind
  queryData(custId) {
    const {
      queryFinanceDetail
    } = this.props;
    queryFinanceDetail({
      custId,
    });
  }

  renderPersonInfo() {
    const {
      location,
      customerBasicInfo,
      updatePerFinaceData,
      data: {
        person,
      },
      customerBasicInfo: {
        isMainEmp,
      },
      queryFinanceDetail,
    } = this.props;
    return (
      <Person
        queryFinanceDetail={queryFinanceDetail}
        updatePerFinaceData={updatePerFinaceData}
        data={person || EMPTY_OBJECT}
        isMainEmp={isMainEmp}
        location={location}
        customerBasicInfo={customerBasicInfo}
      />
    );
  }

  renderOrganizationInfo() {
    const {
      updateOrgFinaceData,
      location,
      customerBasicInfo,
      data: {
        organization,
      },
      customerBasicInfo: {
        isMainEmp,
      },
      queryFinanceDetail,
    } = this.props;
    return (
      <Organization
        queryFinanceDetail={queryFinanceDetail}
        updateOrgFinaceData={updateOrgFinaceData}
        customerBasicInfo={customerBasicInfo}
        data={organization || EMPTY_OBJECT}
        isMainEmp={isMainEmp}
        location={location}
      />
    );
  }

  renderFinanceInfo() {
    const { customerBasicInfo: { custNature } } = this.props;
    let component = null;
    switch (custNature) {
      // 如果客户类型是个人客户
      case PERSON_CUST_TYPE:
        component = this.renderPersonInfo();
        break;
      // 如果客户类型是普通机构客户
      case ORGANIZATION_CUST_TYPE:
        component = this.renderOrganizationInfo();
        break;
      default:
        component = this.renderOrganizationInfo();
        break;
    }
    return component;
  }

  render() {
    return (
      <div className={styles.financeInfoBox}>
        {this.renderFinanceInfo()}
      </div>
    );
  }
}
