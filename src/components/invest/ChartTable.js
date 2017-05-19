/*
 * @Author: LiuJianShu
 * @Date: 2017-05-04 16:50:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-05-04 20:02:48
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Table, Pagination } from 'antd';
import _ from 'lodash';

import { optionsMap } from '../../config';
import styles from './ChartTable.less';

// 按类别排序
const sortByType = optionsMap.sortByType;

export default class ChartTable extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string,
    chartTableInfo: PropTypes.object,
    style: PropTypes.object,
    sourceData: PropTypes.array,
    data: PropTypes.object,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
    style: {},
    level: '',
    chartTableInfo: {},
    sourceData: [],
    data: {},
    repalce: () => {},
  }
  constructor(props) {
    super(props);
    this.state = {
      bordered: true,
      loading: false,
      pagination: false,
      sortedInfo: null,
    };
  }

  @autobind
  handleChange(e, pagination, sorter) {
    // 表格排序方式
    const tableOrderType = sorter.order === 'ascend' ? 'asc' : '';
    const { replace, location: { query } } = this.props;
    replace({
      pathname: '/invest',
      query: {
        ...query,
        orderIndicatorId: sorter.field || '',
        tableOrderType,
      },
    });
  }
  // 分页事件
  @autobind
  handlePaginationChange(page, pageSize) {
    const { replace, location: { query } } = this.props;
    replace({
      pathname: '/invest',
      query: {
        ...query,
        page,
        pageSize,
      },
    });
  }
  // 对小数进行处理
  @autobind
  toFixedDecimal(value) {
    let v = 0;
    if (value === 0) {
      v = 0;
    } else {
      v = _.ceil(value, 2);
    }
    return v;
  }

  @autobind
  unitChange(arr, name) {
    let value;
    const newArr = arr.map((item) => {
      if (item.unit === '%') {
        value = Number(item.value) * 100;
      } else if (item.unit === '\u2030') {
        value = Number(item.value) * 1000;
      } else {
        value = Number(item.value);
      }
      return {
        [item.key]: this.toFixedDecimal(value),
        city: name,
      };
    });
    return newArr;
  }

  render() {
    const { chartTableInfo, location: { query }, level, style } = this.props;
    const columns = chartTableInfo.titleList;
    const data = chartTableInfo.indicatorSummuryRecordDtos;
    const temp = [];
    let allWidth = 0;
    let arr = [];
    if (data && data.length) {
      data.map((item, index) => {
        const testArr = this.unitChange(item.indicatorDataList, item.name);
        return temp.push(Object.assign({ key: index }, ...testArr));
      });
      // console.log(temp);
      const columnWidth = [140, 150, 180, 210, 180, 140, 190, 140, 140, 150, 150, 150];
      allWidth = _.sum(columnWidth);
      arr = columns.map((item, index) => (
        {
          dataIndex: item.key,
          title: `${item.name} (${item.unit})`,
          sorter: true,
          width: columnWidth[index],
        }
      ));
      const tempScope = query.scope || Number(level) + 1;
      // 匹配第一列标题文字，分公司、营业部、投顾
      let keyName = '';
      for (let i = 0; i < sortByType.length; i++) {
        if (Number(tempScope) === Number(sortByType[i].scope)) {
          keyName = sortByType[i].name;
        }
      }
      arr.unshift({
        title: keyName,
        dataIndex: 'city',
        key: 'city',
        width: 150,
        fixed: 'left',
      });
    }
    return (
      <div className={styles.tableDiv} style={style}>
        <Table
          {...this.state}
          columns={arr}
          dataSource={temp}
          onChange={this.handleChange}
          scroll={{ x: allWidth }}
        />
        <Pagination
          defaultCurrent={1}
          current={chartTableInfo.curPageNum || 1}
          total={chartTableInfo.totalCnt}
          pageSize={chartTableInfo.pageSize}
          onChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}
