/**
 * @file DistributeHeader.js
 * 业务手机分配页面头部筛选
 * @author honggaunqging
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Select from '../common/Select';
import CustRange from '../pageCommon/SeibelCustRange';
import AutoComplete from '../common/similarAutoComplete';
import config from './config';
import styles from './distributeHeader.less';

const { telephoneNumDistribute: { pageType, statusOptions } } = config;
// 状态默认值为已分配
const DISTRIBUT_EDEFAULT_VALUE = 'Y';
export default class DistributeHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 部门列表信息
    custRange: PropTypes.array.isRequired,
    getCustRange: PropTypes.func.isRequired,
    // 服务经理信息
    empList: PropTypes.array.isRequired,
    queryEmpList: PropTypes.func.isRequired,
    // 筛选后调用的Function
    filterCallback: PropTypes.func,
  }

  static defaultProps = {
    filterCallback: _.noop,
  }

  // 查询服务经理接口
  @autobind
  handleManagerSearch(value) {
    this.props.queryEmpList({
      keyword: value,
      type: pageType,
    });
  }

  // 选中服务经理下拉对象中对应的某个对象
  @autobind
  handleManagerSelect(item) {
    const { filterCallback } = this.props;
    filterCallback({
      queryEmpId: item.ptyMngId,
    });
  }

  // 选中部门下拉对象中对应的某个对象
  @autobind
  selectCustRange(obj) {
    this.props.filterCallback({
      orgId: obj.orgId,
    });
  }

  // 状态select改变
  @autobind
  handleStatusChange(key, value) {
    this.props.filterCallback({
      isBinding: value,
    });
  }

  render() {
    const {
      empList,
      custRange,
      replace,
      location,
      location: { query: { orgId, isBinding } },
    } = this.props;
    const ptyMngAll = { ptyMngName: '全部', ptyMngId: '' };
    // 增加已申请服务经理的全部
    const ptyMngAllList = !_.isEmpty(empList) ? [ptyMngAll, ...empList] : empList;
    // 若初始没选状态，默认状态为已分配状态
    const newIsBinding = _.isEmpty(isBinding) ? DISTRIBUT_EDEFAULT_VALUE : isBinding;
    return (
      <div className={styles.distributeHeader}>
        <div className={styles.filterBox}>
          <div className={styles.filterFl}>
            <AutoComplete
              placeholder="姓名/工号"
              showNameKey="ptyMngName"
              showIdKey="ptyMngId"
              optionList={ptyMngAllList}
              onSelect={this.handleManagerSelect}
              onSearch={this.handleManagerSearch}
              style={{ width: '180px', marginRight: '10px' }}
            />
          </div>

          <div className={styles.filterFl}>
            <span className={styles.filterTitle}>状态:</span>
            <Select
              name="isBinding"
              value={newIsBinding}
              data={statusOptions}
              onChange={this.handleStatusChange}
            />
          </div>

          <div className={styles.filterFl}>
            <span className={styles.filterTitle}>部门:</span>
            <CustRange
              style={{ width: '20%' }}
              custRange={custRange}
              location={location}
              replace={replace}
              updateQueryState={this.selectCustRange}
              orgId={orgId}
            />
          </div>
        </div>
      </div>
    );
  }
}
