/*
 * @Author: LiuJianShu
 * @Date: 2017-05-04 16:50:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-05-04 20:02:48
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Table, Pagination } from 'antd';

import { optionsMap } from '../../config';
import styles from './ChartTable.less';

// 按类别排序
const sortByType = optionsMap.sortByType;

export default class ChartTable extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string,
    chartTableInfo: PropTypes.object,
    sourceData: PropTypes.array,
    data: PropTypes.object,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
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
    if (value > 10000) {
      return value.toFixed(0);
    }
    if (value > 1000) {
      return value.toFixed(1);
    }
    if (value > 100) {
      return value.toFixed(2);
    }
    if (value > 10) {
      return value.toFixed(3);
    }
    return value.toFixed(4);
  }

  // 对金额进行特殊处理的函数
  @autobind
  toFixedMoney(series) {
    let newUnit = '元';
    let newSeries = series;
    const MaxMoney = Math.max(...series);
    // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (MaxMoney > 100000000) {
      newUnit = '亿元';
      newSeries = series.map(item => Number(this.toFixedDecimal(item / 100000000)));
    } else if (MaxMoney > 10000) {
      newUnit = '万元';
      newSeries = series.map(item => Number(this.toFixedDecimal(item / 10000)));
    }

    return {
      newUnit,
      newSeries,
    };
  }

  render() {
    const { chartTableInfo, location: { query }, level } = this.props;
    const columns = chartTableInfo.titleList;
    const data = chartTableInfo.indicatorSummuryRecordDtos;

    let itemData;
    let obj = {};
    const test = [];
    let arr = [];
    const newArr = [];
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        itemData = data[i].indicatorDataList;
        const tempArr = itemData.map(item => (
          {
            [item.key]: (item.unit === '%')
            ? (Number(item.value) * 100).toFixed(3)
            : item.value,
            city: data[i].name,
          }
        ));
        test.push(tempArr);
        for (let j = 0; j < test.length; j++) {
          obj = Object.assign({ key: j }, ...test[j]);
        }
        newArr.push(obj);
      }
      arr = columns.map(item => (
        {
          dataIndex: item.key,
          title: `${item.name} (${item.unit})`,
          sorter: true,
          width: 150,
          // sorter: (a, b) => a[item.key] - b[item.key],
        }
      ));
      console.log('newArr', newArr);
      const tempScope = query.scope || Number(level) + 1;
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
        width: 100,
        fixed: 'left',
      });
    }
    return (
      <div className={styles.tableDiv}>
        <Table
          {...this.state}
          columns={arr}
          dataSource={newArr}
          onChange={this.handleChange}
          scroll={{ x: 1700, y: 400 }}
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
