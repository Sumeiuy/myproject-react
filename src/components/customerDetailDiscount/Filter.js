/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券tab-筛选组件
 * @Date: 2018-11-21 15:56:11
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-23 14:59:31
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Input  } from 'antd';
import { SingleFilter } from 'lego-react-filter/src';
import logable from '../../decorators/logable';
import styles from './filter.less';

const { Search } = Input;

export default class Filter extends PureComponent {
  static propTypes = {
    statusList: PropTypes.array.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    // ticketId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }

  @autobind
  getStatusDataList() {
    const { statusList } = this.props;
    return [
      {
        statusCode: '',
        statusText: '不限',
      },
      ...statusList,
    ];
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '优惠券编号搜索',
      value: '$args[0]',
    },
  })
  handleSearch(value) {
    const { onFilterChange } = this.props;
    onFilterChange({
      name: 'ticketId',
      value: _.trim(value),
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '使用状态',
      value: '$args[0]',
    },
  })
  handleSelectChange(value) {
    const { onFilterChange } = this.props;
    onFilterChange({
      name: 'status',
      value: value.value,
    });
  }

  render() {
    const {
      status,
    } = this.props;
    return (
      <div className={styles.filterBox}>
        <div className={styles.searchBox}>
          <Search
            placeholder="优惠券编号"
            onSearch={this.handleSearch}
            style={{ width: 200 }}
          />
        </div>
        <div className={styles.selectBox}>
          <SingleFilter
            className={styles.searchFilter}
            filterName="使用状态"
            value={status}
            data={this.getStatusDataList()}
            dataMap={['statusCode', 'statusText']}
            onChange={this.handleSelectChange}
          />
        </div>
      </div>
    );
  }
}
