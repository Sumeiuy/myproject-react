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
    // 哪个页面
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
    drafterList: PropTypes.array.isRequired,
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
    const {
      typeOptions,
      stateOptions,
      creatSeibelModal,
      toSearchDrafter,
      drafterList,
    } = this.props;
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
            placeholder="经纪客户号/客户名称"
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
            searchList={drafterList}
            showObjKey="custName2"
            objId="custNumber2"
            emitSelectItem={this.selectItem}
            emitToSearch={toSearchDrafter}
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
            showObjKey="custName3"
            objId="custNumber3"
            emitSelectItem={this.selectItem}
            emitToSearch={this.toSearchInfo}
            boxStyle={{
              border: 'none',
            }}
          />
        </div>
        <Button
          type="primary"
          icon="plus"
          size="small"
          onCick={creatSeibelModal}
        >
          新建
        </Button>
      </div>
    );
  }
}
