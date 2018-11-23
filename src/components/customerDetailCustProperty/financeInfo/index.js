/**
 * @Author: XuWenKang
 * @Description: 客户属性-财务信息
 * @Date: 2018-11-20 15:17:42
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-20 16:37:15
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

export default class FinanceInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    // 客户基本信息 从modals/customerDetail中取得
    customerBasicInfo: PropTypes.object.isRequired,
  }

  renderPersonInfo() {
    const {
      data: {
        person,
      },
      customerBasicInfo: {
        isMainEmp,
      }
    } = this.props;
    return (
      <Person data={person} isMainEmp={isMainEmp} />
    );
  }

  renderOrganizationInfo() {
    const {
      data: {
        organization,
      },
      customerBasicInfo: {
        isMainEmp,
      }
    } = this.props;
    return (
      <Organization data={organization} isMainEmp={isMainEmp} />
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
