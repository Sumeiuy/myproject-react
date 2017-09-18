/**
 * @file Pageheader.js
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Select from '../Select';
import DropDownSelect from '../drapdownselect';

import styles from '../../style/jiraLayout.less';

export default class Pageheader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    page: PropTypes.string,
    typeOptions: PropTypes.array.isRequired,
    stateOptions: PropTypes.array.isRequired,
  }

  static defaultProps = {
    page: '',
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

  render() {
    const { typeOptions, stateOptions } = this.props;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value}>{i.label}</Option>,
    );
    const { replace, location } = this.props;
    return (
      <div className={styles.pageCommonHeader}>
        客户:
        <div className={styles.dropDownSelectBox}>
          <DropDownSelect
            value="全部"
            placeholder="经济客户号/客户名称"
            searchList={this.state.list}
            showObjKey="custName"
            objId="custNumber"
            emitSelectItem={this.selectItem}
            emitToSearch={this.toSearchInfo}
            boxStyle={{
              border: 'none',
            }}
          />
        </div>

        子类型:
        <Select
          location={location}
          replace={replace}
          data={getSelectOption(typeOptions)}
          name={'subType'}
        />
        状态:
        <Select
          location={location}
          replace={replace}
          data={getSelectOption(stateOptions)}
          name={'status'}
        />

        拟稿人:
        <div className={styles.dropDownSelectBox}>
          <DropDownSelect
            value="全部"
            placeholder="请输入姓名或工号"
            searchList={this.state.list}
            showObjKey="custName"
            objId="custNumber"
            emitSelectItem={this.selectItem}
            emitToSearch={this.toSearchInfo}
            boxStyle={{
              border: 'none',
            }}
          />
        </div>

        部门:
        <div className={styles.dropDownSelectBox}>
          <DropDownSelect
            value="全部"
            placeholder="请输入姓名或工号"
            searchList={this.state.list}
            showObjKey="custName"
            objId="custNumber"
            emitSelectItem={this.selectItem}
            emitToSearch={this.toSearchInfo}
            boxStyle={{
              border: 'none',
            }}
          />
        </div>
      </div>
    );
  }
}
