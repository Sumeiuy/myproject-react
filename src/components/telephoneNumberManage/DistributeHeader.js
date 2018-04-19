/**
 * @file Pageheader.js
 * 权限申请，合约管理，佣金调整头部筛选
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

const { statusOptions, type } = config;
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

  componentWillMount() {
    this.props.getCustRange({
      type,
    });
  }


  // 查询服务经理接口
  @autobind
  handleManagerSearch(value) {
    this.props.queryEmpList({
      keyword: value,
      type,
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
      status: value,
    });
  }

  render() {
    const {
      empList,
      custRange,
      replace,
      location: { query: { orgId, status } },
    } = this.props;
    const ptyMngAll = { ptyMngName: '全部', ptyMngId: '' };
    // 增加已申请服务经理的全部
    const ptyMngAllList = !_.isEmpty(empList) ? [ptyMngAll, ...empList] : empList;
    // 若初始没选状态，默认状态为已分配状态
    const newStatus = _.isEmpty(status) ? DISTRIBUT_EDEFAULT_VALUE : status;
    return (
      <div className={styles.distributeHeader}>
        <div className={styles.filterBox}>
          <div className={styles.filterFl}>
            <AutoComplete
              placeholder="姓名/工号"
              showObjKey="ptyMngName"
              objId="ptyMngId"
              searchList={ptyMngAllList}
              onSelect={this.handleManagerSelect}
              onSearch={this.handleManagerSearch}
              ref={ref => this.queryEmpListComponent = ref}
            />
          </div>

          <div className={styles.filterFl}>
            <span className={styles.filterTitle}>状态:</span>
            <Select
              name="status"
              value={newStatus}
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
