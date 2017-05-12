/*
 * @Author: LiuJianShu
 * @Date: 2017-05-04 16:50:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-05-04 20:02:48
 */
import React, { PropTypes, PureComponent } from 'react';
import { Table } from 'antd';

import styles from './ChartTable.less';

const data = [{
  key: '1',
  city: '南京',
  gjPurRake: 123,
  platformCustNumM: 456,
  tgNum: 789,
}, {
  key: '2',
  city: '上海',
  gjPurRake: 1234,
  platformCustNumM: 4567,
  tgNum: 7890,
}, {
  key: '3',
  city: '广东',
  gjPurRake: 12,
  platformCustNumM: 45,
  tgNum: 78,
}];

export default class ChartTable extends PureComponent {
  static propTypes = {
    chartTableInfo: PropTypes.object,
    sourceData: PropTypes.array,
    data: PropTypes.object,
  }

  static defaultProps = {
    chartTableInfo: {},
    sourceData: [],
    data: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      bordered: true,
      loading: false,
      pagination: true,
      sortedInfo: null,
    };
  }

  handleChange = (pagination, sorter) => {
    console.log('Various parameters', pagination, sorter);
    this.setState({
      sortedInfo: sorter,
    });
  }
  clearAll = () => {
    this.setState({
      sortedInfo: null,
    });
  }
  render() {
    const { chartTableInfo } = this.props;
    console.log('chartTableInfo', chartTableInfo);
    const columns = chartTableInfo.titleList;
    // const key = 'dataIndex';
    // const name = 'title';
    // const alrColumns = columns.map((item) => {
    //   const test = item.key;
    //   item[key] = item.key;
    //   item[name] = item.name;
    //   item.sorter = (a, b) => a[test] - b[test];
    //   delete item.name;
    //   return item;
    // });
    columns.unshift({
      title: '分公司',
      dataIndex: 'city',
      key: 'city',
    });
    // const columns = [{
    //   title: '分公司',
    //   dataIndex: 'city',
    //   key: 'city',
    // }, {
    //   title: '投顾入岗人数',
    //   dataIndex: 'tgrgrs',
    //   key: 'tgrgrs',
    //   sorter: (a, b) => a.tgrgrs - b.tgrgrs,
    // }, {
    //   title: '签约客户数',
    //   dataIndex: 'qykhs',
    //   key: 'qykhs',
    //   sorter: (a, b) => a.qykhs - b.qykhs,
    // }, {
    //   title: '签约资产',
    //   dataIndex: 'qyzc',
    //   key: 'qyzc',
    //   sorter: (a, b) => a.qyzc - b.qyzc,
    // }, {
    //   title: '签约平均佣金率',
    //   dataIndex: 'qypjyjl',
    //   key: 'qypjyjl',
    //   sorter: (a, b) => a.qypjyjl - b.qypjyjl,
    // }, {
    //   title: '净佣金收入',
    //   dataIndex: 'jyjsr',
    //   key: 'jyjsr',
    //   sorter: (a, b) => a.jyjsr - b.jyjsr,
    // }, {
    //   title: '资产配置覆盖率',
    //   dataIndex: 'zcpzfgl',
    //   key: 'zcpzfgl',
    //   sorter: (a, b) => a.zcpzfgl - b.zcpzfgl,
    // }, {
    //   title: 'MOT 完成率',
    //   dataIndex: 'motwcl',
    //   key: 'motwcl',
    //   sorter: (a, b) => a.motwcl - b.motwcl,
    // }];
    return (
      <div className={styles.tableDiv}>
        <Table {...this.state} columns={columns} dataSource={data} onChange={this.handleChange} />
      </div>
    );
  }
}
