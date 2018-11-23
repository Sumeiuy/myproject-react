/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券tab-筛选组件
 * @Date: 2018-11-21 15:56:11
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-23 14:59:31
 */

import React, { PureComponent } from 'react';
import proptypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input  } from 'antd';
import { SingleFilter } from 'lego-react-filter/src';
import styles from './filter.less';

const { Search } = Input;

export default class Filter extends PureComponent {
  static propTypes = {
    statusList: proptypes.array.isRequired,
    onFilterChange: proptypes.func.isRequired,
    // ticketId: proptypes.string.isRequired,
    status: proptypes.string.isRequired,
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

  render() {
    const {
      onFilterChange,
      status,
    } = this.props;
    return (
      <div className={styles.filterBox}>
        <div className={styles.searchBox}>
          <Search
            placeholder="优惠券编号"
            onSearch={value => onFilterChange({
              name: 'ticketId',
              value
            })}
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
            onChange={data => onFilterChange({
              name: 'status',
              value: data.value
            })}
          />
        </div>
      </div>
    );
  }
}
