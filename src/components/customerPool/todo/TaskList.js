/**
 * @file customerPool/ToDoList.js
 *  目标客户池 待办流程列表
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';
import styles from './taskList.less';

export default class TaskList extends PureComponent {

  static propTypes = {
    data: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    // 数据类型
    listType: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      flowId: null,
    };
    this.columns = this.columnsType();
  }

  componentDidMount() {
    this.updateEmptyHeight();
    window.addEventListener('resize', () => this.updateEmptyHeight());
  }

  componentDidUpdate() {
    this.updateEmptyHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.updateEmptyHeight());
  }

  // 空列表时空数据样式的盒子的高度
  updateEmptyHeight() {
    let topBarHeight = 0;
    const winHeight = document.body.clientHeight || document.documentElement.clientHeight;
    const topBar = document.getElementById('workspace-taskbar');
    if (topBar) {
      topBarHeight = topBar.offsetHeight;
    }
    const emptyTip = document.querySelector('.ant-table-placeholder');
    if (emptyTip) {
      emptyTip.style.height = `${winHeight - topBarHeight - 127}px`;
    }
  }

  @autobind
  handleChange(page) {
    this.props.onPageChange({
      curPageNum: page,
    });
  }

  @autobind
  handleSizeChange(current, size) {
    this.props.onSizeChange({
      pageSize: size,
      curPageNum: 1,
    });
  }

  // 根据type获取列表数据
  @autobind
  columnsType() {
    let taskColumns = [];
    switch (this.props.listType) {
      case 'apply':
        taskColumns =  [
          {
            title: '任务名称',
            dataIndex: 'subject',
            key: 'subject',
            render: (item, record) =>
              (<a
                target="_blank"
                title={item.id}
                className={styles.applySubject}
              >
                {record.subject}
              </a>),
          },
          {
            title: '类型',
            dataIndex: 'workFlowName',
            key: 'workFlowName',
            render: (item, record) => (<span className={styles.applyWorkFlowName}>{record.workFlowName}</span>),
          },
          {
            title: '提交时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (item, record) => (<span className={styles.applyStartTime}>{record.startTime}</span>),
          },
        ];
        break;
      case 'approve':
        taskColumns =  [
          {
            title: '任务名称',
            dataIndex: 'subject',
            key: 'subject',
            render: (item, record) =>
              (<a
                target="_blank"
                title={item.id}
              >
                {record.subject}
              </a>),
          },
          {
            title: '类型',
            dataIndex: 'workFlowName',
            key: 'workFlowName',
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
            title: '提交时间',
            dataIndex: 'startTime',
            key: 'startTime',
          },
          {
            title: '审批时间',
            dataIndex: 'endTime',
            key: 'endTime',
          },
        ];
        break;
        default:
          break;
    }
    return taskColumns;
  }
  render() {
    const { className, data } = this.props;
    return (
      <Table
        className={className}
        rowKey={record => record.id}
        columns={this.columns}
        dataSource={data}
      />
    );
  }
}
