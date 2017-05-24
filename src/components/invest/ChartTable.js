/*
 * @Author: LiuJianShu
 * @Date: 2017-05-04 16:50:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-05-24 20:24:53
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
    const tableOrderType = sorter.order === 'ascend' ? 'asc' : 'desc';
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
      const itemValue = Number(item.value);
      switch (item.unit) {
        case '%':
          value = ((itemValue * 100) === 100) ? 100 : (itemValue * 100);
          break;
        case '\u2030':
          value = ((itemValue * 1000) === 1000) ? 1000 : (itemValue * 1000);
          break;
        case '元':
          value = itemValue / 10000;
          break;
        default:
          value = itemValue;
          break;
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
      const columnWidth = [180, 180, 180, 210, 180, 170, 170, 210, 170, 210, 180, 150];
      allWidth = _.sum(columnWidth);
      arr = columns.map((item, index) => (
        {
          dataIndex: item.key,
          title: `${item.name}(${item.unit === '元' ? '万元' : item.unit})`,
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
        width: 170,
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
          total={chartTableInfo.totalCnt || 1}
          pageSize={chartTableInfo.pageSize}
          onChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}
