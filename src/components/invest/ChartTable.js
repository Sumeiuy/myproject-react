/*
 * @Author: LiuJianShu
 * @Date: 2017-05-04 16:50:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-05-04 20:02:48
 */
import React, { PropTypes, PureComponent } from 'react';
import { Table } from 'antd';

import styles from './ChartTable.less';

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
    // const b = columns.map((item) => {
    //   return {
    //     dataIndex: item.key,
    //     title: item.name,
    //     sorter: (a, b)=> a - b
    //   },
    // });
    const arr = columns.map(item => (
      {
        dataIndex: item.key,
        title: item.name,
        sorter: (a, b) => a[item.key] - b[item.key],
      }
    ));
    console.log('arr', arr);
    arr.unshift({
      title: '分公司',
      dataIndex: 'city',
      key: 'city',
    });

    const data = [{
      key: '1',
      city: '南京',
      gjPurRake: 3223,
      platformCustNumM: 124,
      tgNum: 7434,
    }, {
      key: '2',
      city: '上海',
      gjPurRake: 1244,
      platformCustNumM: 43,
      tgNum: 2241,
    }, {
      key: '3',
      city: '广东',
      gjPurRake: 454,
      platformCustNumM: 4121,
      tgNum: 8324,
    }];
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
        <Table {...this.state} columns={arr} dataSource={data} onChange={this.handleChange} />
      </div>
    );
  }
}
