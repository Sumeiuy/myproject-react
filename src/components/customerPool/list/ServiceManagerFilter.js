/**
 * @file components/customerPool/list/ServiceManagerFilter.js
 *  客户列表项中按服务经理筛选
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import DropdownSelect from '../../common/dropdownSelect';

import styles from './saleDepartmentFilter.less';
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: '180px',
  height: '24px',
};

export default class ServiceManagerFilter extends PureComponent {

  static propTypes = {
    searchServerPersonList: PropTypes.array.isRequired,
    serviceManagerDefaultValue: PropTypes.string.isRequired,
    dropdownSelectedItem: PropTypes.func.isRequired,
    dropdownToSearchInfo: PropTypes.func.isRequired,
    disable: PropTypes.bool.isRequired,
  }

  render() {
    const {
      searchServerPersonList,
      serviceManagerDefaultValue,
      dropdownSelectedItem,
      dropdownToSearchInfo,
      disable,
    } = this.props;
    return (
      <div>
        <span className={styles.selectLabel}>服务经理：</span>
        <DropdownSelect
          theme="theme2"
          showObjKey="ptyMngName"
          objId="ptyMngId"
          placeholder="输入姓名或工号查询"
          name="serviceManager"
          disable={disable}
          value={serviceManagerDefaultValue}
          searchList={searchServerPersonList}
          onSelect={dropdownSelectedItem}
          onSearch={dropdownToSearchInfo}
          boxStyle={dropDownSelectBoxStyle}
          isAutoWidth
        />
      </div>
    );
  }
}
