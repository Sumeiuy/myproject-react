/**
 * @file Pageheader.js
 * 权限申请，合约管理，佣金调整头部筛选
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Select from '../Select';
import CustRange from '../../pageCommon/SeibelCustRange';
import DropDownSelect from '../dropdownSelect';
import Button from '../Button';
import styles from '../../style/jiraLayout.less';

const allowPermission = 'HTSC 综合服务-营业部执行岗';

export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 页面
    page: PropTypes.string,
    // 子类型
    subtypeOptions: PropTypes.array.isRequired,
    // 状态
    stateOptions: PropTypes.array.isRequired,
    // 新建
    creatSeibelModal: PropTypes.func.isRequired,
    // 搜索拟稿人方法
    toSearchDrafter: PropTypes.func.isRequired,
    // 搜索审批人方法
    toSearchApprove: PropTypes.func.isRequired,
    // 搜索客户方法
    toSearchCust: PropTypes.func.isRequired,
    // 拟稿人数据
    drafterList: PropTypes.array,
    // 审批人数据
    approveList: PropTypes.array,
    // 客户数据
    customerList: PropTypes.array,
    // 部门
    custRange: PropTypes.array,
    // 操作类型
    needOperate: PropTypes.bool,
    operateOptions: PropTypes.array,
    // 新建权限
    empInfo: PropTypes.object,
  }

  static defaultProps = {
    page: '',
    drafterList: [],
    customerList: [],
    approveList: [],
    custRange: [],
    needOperate: false,
    operateOptions: [],
    empInfo: {},
  }

  // 选中客户下拉对象中对应的某个对象
  @autobind
  selectCustItem(item) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        custNumber: item.custNumber,
        isResetPageNum: 'Y',
      },
    });
  }

  // 选中拟稿人下拉对象中对应的某个对象
  @autobind
  selectDrafterItem(item) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        drafterId: item.ptyMngId,
        isResetPageNum: 'Y',
      },
    });
  }

  // 选中审批人下拉对象中对应的某个对象
  @autobind
  selectApproveItem(item) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        approvalId: item.ptyMngId,
        isResetPageNum: 'Y',
      },
    });
  }

  // 选中部门下拉对象中对应的某个对象
  @autobind
  selectCustRange(obj) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        orgId: obj.orgId,
        isResetPageNum: 'Y',
      },
    });
  }

  // select改变
  @autobind
  handleSelectChange(key, v) {
    this.setState({
      [key]: v,
    });
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [key]: v,
        isResetPageNum: 'Y',
      },
    });
  }

  render() {
    const {
      subtypeOptions,
      stateOptions,
      creatSeibelModal,
      toSearchDrafter,
      toSearchApprove,
      toSearchCust,
      drafterList,
      approveList,
      customerList,
      custRange,
      replace,
      page,
      operateOptions,
      needOperate,
      location: { pathname, query: { subType, status, business2 } },
      empInfo,
    } = this.props;

    const ptyMngAll = { ptyMngName: '全部', ptyMngId: '' };

    const customerAllList = !_.isEmpty(customerList) ?
    [{ custName: '全部', custNumber: '' }, ...customerList] : customerList;

    const drafterAllList = !_.isEmpty(drafterList) ?
    [ptyMngAll, ...drafterList] : drafterList;

    const approveAllList = !_.isEmpty(approveList) ?
    [ptyMngAll, ...approveList] : approveList;
    // 新建按钮权限
    let hasPermission = true;
    if (pathname === '/contract') {
      // 合约合约时判断权限
      const permissionList = empInfo.empRespList;
      const filterResult = _.filter(permissionList, o => o.respName === allowPermission);
      hasPermission = Boolean(filterResult.length);
    }

    const operateElement = needOperate ?
      (
        <div className={styles.dropDownSelectBox}>
          <span>操作类型:</span>
          <Select
            name="business2"
            value={business2}
            data={operateOptions}
            onChange={this.handleSelectChange}
            style={{ width: '20%' }}
          />
        </div>
      )
    :
      null;
    return (
      <div className={styles.pageCommonHeader}>
        <div className={styles.filterBox}>
          <div className={styles.filterFl}>
            <div className={styles.dropDownSelectBox}>
              <DropDownSelect
                value="全部"
                placeholder="经纪客户号/客户名称"
                searchList={customerAllList}
                showObjKey="custName"
                objId="custNumber"
                emitSelectItem={this.selectCustItem}
                emitToSearch={toSearchCust}
                name={`${page}-custName`}
              />
            </div>
          </div>

          <div className={styles.filterFl}>
            { /* 操作类型 */ }
            { operateElement }
          </div>
          <div className={styles.filterFl}>
            子类型:
            <Select
              name="subType"
              value={subType}
              data={subtypeOptions}
              onChange={this.handleSelectChange}
              style={{ width: '20%' }}
            />
          </div>

          <div className={styles.filterFl}>
            状态:
            <Select
              name="status"
              value={status}
              data={stateOptions}
              onChange={this.handleSelectChange}
            />
          </div>

          <div className={styles.filterFl}>
            拟稿人:
            <div className={styles.dropDownSelectBox}>
              <DropDownSelect
                value="全部"
                placeholder="工号/名称"
                searchList={drafterAllList}
                showObjKey="ptyMngName"
                objId="ptyMngId"
                emitSelectItem={this.selectDrafterItem}
                emitToSearch={toSearchDrafter}
                name={`${page}-ptyMngName`}
              />
            </div>
          </div>

          <div className={styles.filterFl}>
            部门:
            <CustRange
              style={{ width: '20%' }}
              custRange={custRange}
              location={location}
              replace={replace}
              updateQueryState={this.selectCustRange}
            />
          </div>

          <div className={styles.filterFl}>
            审批人:
            <div className={styles.dropDownSelectBox}>
              <DropDownSelect
                value="全部"
                placeholder="工号/名称"
                searchList={approveAllList}
                showObjKey="ptyMngName"
                objId="ptyMngId"
                emitSelectItem={this.selectApproveItem}
                emitToSearch={toSearchApprove}
                name={`${page}-ptyMngName`}
              />
            </div>
          </div>
        </div>
        {
          hasPermission ?
            <Button
              type="primary"
              icon="plus"
              size="small"
              onClick={creatSeibelModal}
            >
              新建
            </Button>
          :
            null
        }
      </div>
    );
  }
}
