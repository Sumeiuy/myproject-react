/**
 * @file components/common/serviceManagerFilter/index.js
 * 按服务经理筛选
 * @author wangjunjun
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-17 14:29:39
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import SingleFilter from 'lego-react-filter/src';
import logable from '../../../decorators/logable';
import styles from './serviceManagerFilter.less';

export default class ServiceManagerFilter extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    currentPtyMng: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    clearServiceManagerList: PropTypes.func.isRequired,
    disable: PropTypes.bool,
  }

  static defaultProps = {
    disable: false,
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务经理',
      value: '$args[0].ptyMngName',
    },
  })
  handleSelect(item) {
    const { value } = item;
    this.props.onChange(value);
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
    const { onInputChange, clearServiceManagerList } = this.props;
    if (value) {
      onInputChange(value);
    } else {
      clearServiceManagerList();
    }
  }

  render() {
    const {
      disable,
      list,
      currentPtyMng,
    } = this.props;
    const { ptyMngId } = currentPtyMng;
    const finalPytMng = ptyMngId ? currentPtyMng : ptyMngId;
    return (
      <div className={styles.managerContainer}>
        <SingleFilter
          className={styles.serverManageWrap}
          value={finalPytMng}
          placeholder="员工号或姓名"
          defaultLabel="不限"
          filterName="服务经理"
          data={list}
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
