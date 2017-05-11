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
  tgrgrs: 123,
  qykhs: 456,
  qyzc: 789,
  qypjyjl: 1234,
  jyjsr: 5678,
  zcpzfgl: 9123,
  motwcl: 4567,
}, {
  key: '2',
  city: '上海',
  tgrgrs: 8912,
  qykhs: 345,
  qyzc: 678,
  qypjyjl: 912,
  jyjsr: 3456,
  zcpzfgl: 7891,
  motwcl: 234,
}, {
  key: '3',
  city: '广东',
  tgrgrs: 456,
  qykhs: 678,
  qyzc: 9123,
  qypjyjl: 456,
  jyjsr: 789,
  zcpzfgl: 123,
  motwcl: 4567,
}, {
  key: '4',
  city: '湖北',
  tgrgrs: 1421,
  qykhs: 6322,
  qyzc: 227,
  qypjyjl: 3965,
  jyjsr: 5267,
  zcpzfgl: 4721,
  motwcl: 743,
}, {
  key: '5',
  city: '湖南',
  tgrgrs: 2562,
  qykhs: 8332,
  qyzc: 3434,
  qypjyjl: 5233,
  jyjsr: 733,
  zcpzfgl: 135,
  motwcl: 673,
}, {
  key: '6',
  city: '北京',
  tgrgrs: 5623,
  qykhs: 2783,
  qyzc: 873,
  qypjyjl: 258,
  jyjsr: 2422,
  zcpzfgl: 720,
  motwcl: 108,
}, {
  key: '7',
  city: '浙江',
  tgrgrs: 252,
  qykhs: 672,
  qyzc: 934,
  qypjyjl: 1112,
  jyjsr: 7632,
  zcpzfgl: 1223,
  motwcl: 9434,
}, {
  key: '8',
  city: '苏州',
  tgrgrs: 2523,
  qykhs: 2378,
  qyzc: 190,
  qypjyjl: 3434,
  jyjsr: 896,
  zcpzfgl: 223,
  motwcl: 664,
}, {
  key: '9',
  city: '江西',
  tgrgrs: 174,
  qykhs: 906,
  qyzc: 233,
  qypjyjl: 7454,
  jyjsr: 7564,
  zcpzfgl: 8754,
  motwcl: 122,
}];

export default class ChartTable extends PureComponent {
  static propTypes = {
    sourceData: PropTypes.array,
    data: PropTypes.object,
  }

  static defaultProps = {
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
    const columns = [{
      title: '分公司',
      dataIndex: 'city',
      key: 'city',
    }, {
      title: '投顾入岗人数',
      dataIndex: 'tgrgrs',
      key: 'tgrgrs',
      sorter: (a, b) => a.tgrgrs - b.tgrgrs,
    }, {
      title: '签约客户数',
      dataIndex: 'qykhs',
      key: 'qykhs',
      sorter: (a, b) => a.qykhs - b.qykhs,
    }, {
      title: '签约资产',
      dataIndex: 'qyzc',
      key: 'qyzc',
      sorter: (a, b) => a.qyzc - b.qyzc,
    }, {
      title: '签约平均佣金率',
      dataIndex: 'qypjyjl',
      key: 'qypjyjl',
      sorter: (a, b) => a.qypjyjl - b.qypjyjl,
    }, {
      title: '净佣金收入',
      dataIndex: 'jyjsr',
      key: 'jyjsr',
      sorter: (a, b) => a.jyjsr - b.jyjsr,
    }, {
      title: '资产配置覆盖率',
      dataIndex: 'zcpzfgl',
      key: 'zcpzfgl',
      sorter: (a, b) => a.zcpzfgl - b.zcpzfgl,
    }, {
      title: 'MOT 完成率',
      dataIndex: 'motwcl',
      key: 'motwcl',
      sorter: (a, b) => a.motwcl - b.motwcl,
    }];
    return (
      <div className={styles.tableDiv}>
        <Table {...this.state} columns={columns} dataSource={data} onChange={this.handleChange} />
      </div>
    );
  }
}
