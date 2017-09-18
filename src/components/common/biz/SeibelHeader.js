/**
 * @file Pageheader.js
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Select from '../Select';
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
    typeOptions: PropTypes.array.isRequired,
    // 状态
    stateOptions: PropTypes.array.isRequired,
    // 新建
    creatSeibelModal: PropTypes.func.isRequired,
    // 搜索拟稿人方法
    toSearchDrafter: PropTypes.func.isRequired,
    // 拟稿人数据
    drafterList: PropTypes.array,
  }

  static defaultProps = {
    page: '',
    drafterList: [],
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
    console.log('向上传递选中的对象', item);
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
      typeOptions,
      stateOptions,
      creatSeibelModal,
      toSearchDrafter,
      drafterList,
    } = this.props;

    return (
      <div className={styles.pageCommonHeader}>
        <div className={styles.dropDownSelectBox}>
          <DropDownSelect
            value="全部"
            placeholder="经济客户号/客户名称"
            searchList={this.state.list}
            showObjKey="empName"
            objId="empId"
            emitSelectItem={this.selectItem}
            emitToSearch={this.toSearchInfo}
          />
        </div>

        子类型:
        <Select
          style={{ width: '20%' }}
          value={query.subType}
          location={location}
          replace={replace}
          data={typeOptions}
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
            showObjKey="custName2"
            objId="custNumber2"
            emitSelectItem={this.selectItem}
            emitToSearch={toSearchDrafter}
          />
        </div>

        部门:
        <div className={styles.dropDownSelectBox}>
          <DropDownSelect
            value="全部"
            placeholder="部门"
            searchList={this.state.list}
            showObjKey="custName3"
            objId="custNumber3"
            emitSelectItem={this.selectItem}
            emitToSearch={this.toSearchInfo}
          />
        </div>
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
