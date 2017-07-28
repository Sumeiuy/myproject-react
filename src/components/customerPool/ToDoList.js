/**
 * @file customerPool/ToDoList.js
 *  目标客户池 待办流程列表
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import { fspGlobal } from '../../utils';

const columns = [
  {
    title: '任务名称',
    dataIndex: 'task',
    key: 'task',
    render: item => <a
      onClick={() => fspGlobal.openAuditPage(item.dispatchUri)}
    >
      {item.text}
    </a>,
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
    className: PropTypes.string.isRequired,
    todoPage: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  @autobind
  handleChange(page) {
    this.props.onChange({
      curPageNum: page,
    });
  }

  render() {
    const { className, data, todoPage } = this.props;
    return (
      <Table
        className={className}
        rowKey={record => record.applyId}
        columns={columns}
        dataSource={data}
        pagination={{
          size: 'small',
          current: +todoPage.curPageNum,
          onChange: this.handleChange,
          showTotal: total => (`共${total}项`),
          showSizeChanger: true,
        }}
      />
    );
  }
}
