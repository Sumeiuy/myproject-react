/**
 * @file Pageheader.js
 * 权限申请，合约管理，佣金调整头部筛选
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Select from '../Select';
import CustRange from '../../pageCommon/SeibelCustRange';
import DropDownSelect from '../dropdownSelect';
import Button from '../Button';

import styles from '../../style/jiraLayout.less';

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
    // 搜索客户方法
    toSearchCust: PropTypes.func.isRequired,
    // 拟稿人数据
    drafterList: PropTypes.array,
    // 客户数据
    customerList: PropTypes.array,
    // 部门
    custRange: PropTypes.array,
  }

  static defaultProps = {
    page: '',
    drafterList: [],
    customerList: [],
    custRange: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      subType: '',
      status: '',
    };
  }

  // 选中客户下拉对象中对应的某个对象
  @autobind
  selectCustItem(item) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        keyword: item.cusId || item.custName,
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
        empId: item.empId,
        isResetPageNum: 'Y',
      },
    });
  }

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
      toSearchCust,
      drafterList,
      customerList,
      custRange,
      replace,
    } = this.props;

    const { subType, status } = this.state;

    return (
      <div className={styles.pageCommonHeader}>
        <div className={styles.dropDownSelectBox}>
          <DropDownSelect
            value="全部"
            placeholder="经纪客户号/客户名称"
            searchList={customerList}
            showObjKey="custName"
            objId="cusId"
            emitSelectItem={this.selectCustItem}
            emitToSearch={toSearchCust}
          />
        </div>

        子类型:
        <Select
          name="subType"
          value={subType}
          data={subtypeOptions}
          onChange={this.handleSelectChange}
          style={{ width: '20%' }}
        />
        状态:
        <Select
          name="status"
          value={status}
          data={stateOptions}
          onChange={this.handleSelectChange}
        />

        拟稿人:
        <div className={styles.dropDownSelectBox}>
          <DropDownSelect
            value="全部"
            placeholder="工号/名称"
            searchList={drafterList}
            showObjKey="empName"
            objId="empId"
            emitSelectItem={this.selectDrafterItem}
            emitToSearch={toSearchDrafter}
          />
        </div>

        部门:
        <CustRange
          style={{ width: '20%' }}
          custRange={custRange}
          location={location}
          replace={replace}
          updateQueryState={this.selectCustRange}

        />


        <Button
          type="primary"
          icon="plus"
          size="small"
          onClick={creatSeibelModal}
        >
          新建
        </Button>
      </div>
    );
  }
}
