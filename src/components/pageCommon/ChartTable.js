/*
 * @Author: LiuJianShu
 * @Date: 2017-05-04 16:50:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-05-25 18:20:35
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Table, Pagination } from 'antd';
import _ from 'lodash';

import { optionsMap } from '../../config';
import styles from './ChartTable.less';

// 按类别排序
const sortByType = optionsMap.sortByType;
const revert = { asc: 'desc', desc: 'asc' };
// 表格标题宽度
const columnWidth = [180, 180, 180, 210, 180, 170, 170, 210, 170, 210, 180, 150];

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

  // @autobind
  // handleChange(e, pagination, sorter) {
  //   // 表格排序方式
  //   const tableOrderType = sorter.order === 'ascend' ? 'asc' : 'desc';
  //   const { replace, location: { query } } = this.props;
  //   replace({
  //     pathname: '/invest',
  //     query: {
  //       ...query,
  //       orderIndicatorId: sorter.field || '',
  //       tableOrderType,
  //     },
  //   });
  // }
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

  @autobind
  unitChange(arr, name) {
    let value;
    const newArr = arr.map((item) => {
      const itemValue = Number(item.value);
      switch (item.unit) {
        case '%':
          value = Number.parseFloat((itemValue * 100).toFixed(2));
          break;
        case '\u2030':
          value = Number.parseFloat((itemValue * 1000).toFixed(2));
          break;
        case '元':
          value = `${Number.parseFloat((itemValue / 10000).toFixed(2))}`;
          break;
        default:
          value = Number.parseFloat(itemValue).toFixed(2);
          break;
      }
      return {
        [item.key]: value,
        city: name,
      };
    });
    return newArr;
  }

  @autobind
  handleTitleClick(item) {
    const { replace, location: { query } } = this.props;
    let tableOrderType;
    if (query.orderIndicatorId === item.key) {
      tableOrderType = revert[query.tableOrderType] || 'desc';
    } else {
      tableOrderType = 'asc';
    }
    replace({
      pathname: '/invest',
      query: {
        ...query,
        orderIndicatorId: item.key || '',
        tableOrderType,
      },
    });
  }

  @autobind
  arrowHandle(e, item, type) {
    const { replace, location: { query } } = this.props;
    e.stopPropagation();
    replace({
      pathname: '/invest',
      query: {
        ...query,
        orderIndicatorId: item.key || '',
        tableOrderType: type,
      },
    });
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
      allWidth = _.sum(columnWidth);
      arr = columns.map((item, index) => (
        {
          dataIndex: item.key,
          title: (
            <span
              className={styles.columnsTitle}
              onClick={() => { this.handleTitleClick(item); }}
            >
              {`${item.name}(${item.unit === '元' ? '万元' : item.unit})`}
              <span className={'ant-table-column-sorter'}>
                <span
                  className={`
                    ant-table-column-sorter-up
                    ${(query.orderIndicatorId === item.key && query.tableOrderType !== 'desc') ? 'on' : 'off'}
                  `}
                  title="↑"
                  onClick={(e) => {
                    this.arrowHandle(e, item, 'asc');
                  }}
                >
                  <i className={'anticon anticon-caret-up'} />
                </span>
                <span
                  className={`
                    ant-table-column-sorter-up
                    ${(query.orderIndicatorId === item.key && query.tableOrderType !== 'asc') ? 'on' : 'off'}
                  `}
                  title="↓"
                  onClick={(e) => {
                    this.arrowHandle(e, item, 'desc');
                  }}
                >
                  <i className={'anticon anticon-caret-down'} />
                </span>
              </span>
            </span>
          ),
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
          pageSize={10}
          onChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}
