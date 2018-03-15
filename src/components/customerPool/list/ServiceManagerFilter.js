/**
 * @file components/customerPool/list/ServiceManagerFilter.js
 *  客户列表项中按服务经理筛选
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import DropdownSelect from '../../common/dropdownSelect';

import styles from './saleDepartmentFilter.less';

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
          name="服务经理"
          width={'220px'}
          disable={disable}
          value={serviceManagerDefaultValue}
          searchList={searchServerPersonList}
          emitSelectItem={dropdownSelectedItem}
          emitToSearch={dropdownToSearchInfo}
        />
      </div>
    );
  }
}
