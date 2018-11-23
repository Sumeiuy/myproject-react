/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券tab-筛选组件
 * @Date: 2018-11-21 15:56:11
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-23 09:18:38
 */

import React, { PureComponent } from 'react';
import proptypes from 'prop-types';
import { Input  } from 'antd';
import { SingleFilter } from 'lego-react-filter/src';
import styles from './filter.less';

const { Search } = Input;

export default class Filter extends PureComponent {
  static propTypes = {
    statusList: proptypes.array.isRequired,
    onFilterChange: proptypes.func.isRequired,
    // ticketId: proptypes.string.isRequired,
    // status: proptypes.string.isRequired,
  }

  render() {
    const {
      onFilterChange,
      statusList,
    } = this.props;
    return (
      <div className={styles.filterBox}>
        <div className={styles.searchBox}>
          <Search
            placeholder="优惠券编号"
            onSearch={value => onFilterChange({ name: 'ticketId', value })}
            style={{ width: 200 }}
          />
        </div>
        <div className={styles.selectBox}>
          <SingleFilter
            className={styles.searchFilter}
            filterName="使用状态"
            data={statusList}
            dataMap={['statusCode', 'statusText']}
            onChange={data => onFilterChange({ name: 'status', value: data.value })}
          />
        </div>
      </div>
    );
  }
}
