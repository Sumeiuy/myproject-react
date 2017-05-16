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
  handleChange(pagination, sorter) {
    this.setState({
      sortedInfo: sorter,
    });
  }
  // 分页事件
  @autobind
  handlePaginationChange(page, pageSize) {
    console.log(page);
    console.log(pageSize);
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
  clearAll() {
    this.setState({
      sortedInfo: null,
    });
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
            [item.key]: item.value,
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
          title: item.name,
          sorter: (a, b) => a[item.key] - b[item.key],
        }
      ));
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
      });
    }

    return (
      <div className={styles.tableDiv}>
        <Table {...this.state} columns={arr} dataSource={newArr} onChange={this.handleChange} />
        <Pagination
          defaultCurrent={1}
          current={Number(query.page) || 1}
          total={50}
          pageSize={5}
          onChange={this.handlePaginationChange}
        />
      </div>
    );
  }
}
