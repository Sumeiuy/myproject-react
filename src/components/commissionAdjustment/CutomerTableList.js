/**
 * @file components/commissionAdjustment/CutomerTableList.js
 * @description 批量佣金调整用户列表
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Table } from 'antd';

import styles from './customerTableList.less';

export default class CutomerTableList extends PureComponent {
  static propTypes = {
    customerList: PropTypes.array,
    onDeleteCustomer: PropTypes.func.isRequired,
  }

  static defaultProps = {
    customerList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  @autobind
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
    this.props.onDeleteCustomer(selectedRowKeys);
  }

  render() {
    const { customerList } = this.props;
    if (_.isEmpty(customerList)) {
      return null;
    }
    const { selectedRowKeys } = this.state;
    const columns = [
      {
        title: '经纪客户号',
        dataIndex: 'cusId',
      },
      {
        title: '客户名称',
        dataIndex: 'custName',
      },
      {
        title: '客户等级',
        dataIndex: 'custLevelName',
      },
      {
        title: '开户营业部',
        dataIndex: 'openOrgName',
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <Table
        className={`${styles.cutomerListTable}`}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={customerList}
        pagination={{
          pageSize: 10,
        }}
      />
    );
  }
}
