/**
 * @file components/customerPool/list/ServiceManagerFilter.js
 *  客户列表项中按服务经理筛选
 * @author wangjunjun
 * @Last Modified by: xiaZhiQiang
 * @Last Modified time: 2018-06-04 16:19:07
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import SingleFilter from 'lego-react-filter/src';
import logable from '../../../../decorators/logable';
import styles from './saleDepartmentFilter.less';

export default class ServiceManagerFilter extends PureComponent {

  static propTypes = {
    searchServerPersonList: PropTypes.array.isRequired,
    currentPytMng: PropTypes.object.isRequired,
    dropdownSelectedItem: PropTypes.func.isRequired,
    dropdownToSearchInfo: PropTypes.func.isRequired,
    clearSearchPersonList: PropTypes.func.isRequired,
    disable: PropTypes.bool.isRequired,
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务经理',
      value: '$args[0].value.ptyMngName',
    },
  })
  handleSelect(item) {
    const { value } = item;
    this.props.dropdownSelectedItem(value);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '搜索服务经理',
      value: '$args[0]',
    },
  })
  handleSearch(value) {
    const { dropdownToSearchInfo, clearSearchPersonList } = this.props;
    if (value) {
      dropdownToSearchInfo(value);
    } else {
      clearSearchPersonList();
    }
  }

  render() {
    const {
      disable,
      searchServerPersonList,
      currentPytMng,
    } = this.props;
    const { ptyMngId } = currentPytMng;
    const finalPytMng = ptyMngId ? currentPytMng : ptyMngId;
    return (
      <div className={styles.managerContainer}>
        <SingleFilter
          className={styles.serverManageWrap}
          value={finalPytMng}
          defaultLabel="不限"
          filterName="服务经理"
          data={searchServerPersonList}
          dataMap={['ptyMngId', 'ptyMngName']}
          showSearch
          needItemObj
          useLabelInValue
          disabled={disable}
          onChange={this.handleSelect}
          onInputChange={this.handleSearch}
        />
      </div>
    );
  }
}
