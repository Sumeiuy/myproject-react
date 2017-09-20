/**
 * @file Pageheader.js
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Select from '../Select';
import CustRange from '../../pageCommon/CustRange2';
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
    custList: PropTypes.array,
    // 部门
    custRange: PropTypes.array,
  }

  static defaultProps = {
    page: '',
    drafterList: [],
    custList: [],
    custRange: [],
  }
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
    };
  }


  @autobind
  searchInfoList(value) {
    // 选中下拉对象中对应的某个对象
    console.log(value);
  }

  @autobind
  selectItem(item) {
    // 选中下拉对象中对应的某个对象
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        keyword: item.empId,
        isResetPageNum: 'Y',
      },
    });
  }

  @autobind
  toSearchInfo(value) {
    // 下拉菜单中的查询
    console.log('暴露的查询方法，向上传递value', value);
  }

  @autobind
  handleSelectChange(value, key) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [value]: key,
        isResetPageNum: 'Y',
      },
    });
  }

  render() {
    const {
      replace,
      location,
      location: { query },
      subtypeOptions,
      stateOptions,
      creatSeibelModal,
      toSearchDrafter,
      toSearchCust,
      drafterList,
      custList,
      custRange,
    } = this.props;
    console.warn('custRange', custRange);
    return (
      <div className={styles.pageCommonHeader}>
        <div className={styles.dropDownSelectBox}>
          <DropDownSelect
            value="全部"
            placeholder="经纪客户号/客户名称"
            searchList={custList}
            showObjKey="tcustName"
            objId="tcusId"
            emitSelectItem={this.selectItem}
            emitToSearch={toSearchCust}
          />
        </div>

        子类型:
        <Select
          style={{ width: '20%' }}
          value={query.subType}
          location={location}
          replace={replace}
          data={subtypeOptions}
          name="subType"
          onChange={this.handleSelectChange}
        />
        状态:
        <Select
          value={query.status}
          location={location}
          replace={replace}
          data={stateOptions}
          name="status"
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
            emitSelectItem={this.selectItem}
            emitToSearch={toSearchDrafter}
          />
        </div>

        部门:
        <CustRange
          style={{ width: '20%' }}
          custRange={custRange}
          location={location}
          replace={replace}
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
