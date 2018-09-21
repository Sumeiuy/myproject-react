/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: zhufeiyang
 * @Last Modified time: 2018-09-14 13:46:09
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import logable from '../../decorators/logable';
import CustRange from '../customerPool/list/manageFilter/CustFilter';
import { SingleFilter } from 'lego-react-filter/src';
import { MAIN_MAGEGER_ID } from '../../routes/customerPool/config';
import styles from './tabController.less';

export default class TabController extends PureComponent {
  static propTypes = {
    loginOrgId: PropTypes.string.isRequired,
    custRange: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    authority: PropTypes.bool.isRequired,
    cycle: PropTypes.array.isRequired,
  }

  custRange = this.getCustRange()

  // 获取可以选择的营业部数据
  getCustRange() {
    const { custRange, loginOrgId, authority } = this.props;
    const myCustomer = {
      id: MAIN_MAGEGER_ID,
      name: '我的客户',
    };

    // 如果有权限，可以选择当前登陆用户相应的营业部
    if (authority) {
      if (loginOrgId === (custRange[0] || {}).id) {
        return [
          ...custRange,
          myCustomer,
        ];
      }
      const currentOrgIdInfo = _.find(custRange, item => item.id === loginOrgId);
      if (currentOrgIdInfo) {
        return [
          currentOrgIdInfo,
          myCustomer,
        ];
      }

      let currentDepartment;
      _.forEach(custRange, item => {
        if (item.children && !_.isEmpty(item.children)) {
          const targetValue = _.find(item.children, object => object.id === loginOrgId);
          if (targetValue) {
            currentDepartment = targetValue;
            return false;
          }
          return true;
        }
      });

      if (currentDepartment) {
        return [
          currentDepartment,
          myCustomer,
        ];
      }
    }

    // 没权限只能选择自己
    return [
      myCustomer,
    ];
  }

  getCurrentOrgId() {
    const {
      loginOrgId,
      location,
      authority,
    } = this.props;

    const {
      query: { orgId },
    } = location;

    // 如果从query上能取到，直接使用
    if(orgId) {
      return orgId;
    }

    // 有权限时使用当前登陆的营业部，作为默认值
    if(authority) {
      return loginOrgId;
    }

    // 无权限时，自己作为默认值
    return MAIN_MAGEGER_ID;

  }

  // 获取当前的选择时间范围
  getCurrentTime() {
    const {
      cycle,
      location,
    } = this.props;

    const {
      query: {
      cycleSelect,
      },
    } = location;

    return cycleSelect || (_.isArray(cycle) ? (cycle[0] || {}) : {}).key;
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '机构树',
      value: '$args[0].orgId',
    },
  })
  handleCustRangeChange(value) {
    const { replace, location: { pathname, query } } = this.props;
    const { orgId } = value;
    replace({
      pathname,
      query: {
        ...query,
        orgId,
      },
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '时间周期',
      value: '$args[0].value',
    },
  })
  handleTimeSelectChange(item) {
    const { replace, location: { pathname, query } } = this.props;
    const selectValue = item.value;
    replace({
      pathname,
      query: {
        ...query,
        cycleSelect: selectValue,
      },
    });
  }

  render() {
    const custRangeProps = {
      defaultFirst: true,
      custRange: this.custRange,
      orgId: this.getCurrentOrgId(),
      expandAll: true,
      updateQueryState: this.handleCustRangeChange,
      isHideFilterName: true,
    };
    const timeSelectProps = {
      useCustomerFilter: true,
      data: this.props.cycle,
      value: this.getCurrentTime(),
      onChange: this.handleTimeSelectChange,
    };
    return (
      <div className={styles.tabControllerContainer}>
        <div className={styles.custRangeContainer}>
          <CustRange {...custRangeProps} />
        </div>
        <div className={styles.divider} />
        <div className={styles.timeSelectContainer}>
          <SingleFilter {...timeSelectProps} />
        </div>
      </div>
    );
  }
}
