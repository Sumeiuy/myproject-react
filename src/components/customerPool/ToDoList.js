/**
 * @file customerPool/ToDoList.js
 *  目标客户池 待办流程列表
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Link } from 'dva/router';
import { Table } from 'antd';

const columns = [
  {
    title: '任务名称',
    dataIndex: 'subject',
    key: 'subject',
    render: text => <Link to="#">{text}</Link>,
  },
  {
    title: '当前步骤',
    dataIndex: 'stepName',
    key: 'stepName',
  },
  {
    title: '提交人工号',
    dataIndex: 'originator',
    key: 'originator',
  },
  {
    title: '提交人姓名',
    dataIndex: 'originatorName',
    key: 'originatorName',
  },
  {
    title: '提交日期',
    dataIndex: 'applyDate',
    key: 'applyDate',
  },
];

export default class ToDoList extends PureComponent {

  static propTypes = {
    data: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
  }

  @autobind
  handlePageChange(page) {
    this.props.onChange({
      currentPage: page,
    });
  }

  render() {
    const { className, data, page } = this.props;
    const handlePageChange = this.handlePageChange;
    return (
      <Table
        className={className}
        rowKey={record => record.taskName}
        columns={columns}
        dataSource={data}
        pagination={{
          current: page.curPageNum,
          total: page.totalRecordNum,
          pageSize: page.pageSize,
          onChange: handlePageChange,
        }}
      />
    );
  }
}
