/**
 * @file customerPool/ToDoList.js
 *  目标客户池 待办流程列表
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';

import styles from './toDoList.less';

import emptyImg from './img/empty.png';

const columns = [
  {
    title: '任务名称',
    dataIndex: 'task',
    key: 'task',
    render: item => <a
      className={styles.title}
      href={`${item.dispatchUri}&workFlowName=${encodeURI(item.flowClass)}`}
      target="_blank"
      rel="noopener noreferrer"
      title={item.text}
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
    todolist: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
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

  render() {
    const { className, data, todolist, location } = this.props;
    const { query: { curPageNum = 1, pageSize = 10 } } = location;
    // 没有待办流程
    if (todolist.length === 0) {
      return (<div className={styles.empty}>
        <Table
          className={`${className} ${styles.todoListEmpty}`}
          rowKey={record => record.id}
          columns={columns}
          dataSource={todolist}
          locale={{ emptyText: '' }}
        />
        <div className={styles.emptyWrapper}>
          <div className="empty-container">
            <img src={emptyImg} alt="" />
            <p>暂无待办流程</p>
          </div>
        </div>
      </div>);
    }
    // 搜索结果为空
    if (data.length === 0) {
      return (<div className={styles.empty}>
        <Table
          className={`${className} ${styles.todoListEmpty}`}
          rowKey={record => record.id}
          columns={columns}
          dataSource={data}
          locale={{ emptyText: '' }}
        />
        <div className={styles.emptyWrapper}>
          <div className="empty-container">
            <img src={emptyImg} alt="" />
            <p>抱歉！没有找到相关结果</p>
          </div>
        </div>
      </div>);
    }
    return (
      <Table
        className={className}
        rowKey={record => record.id}
        columns={columns}
        dataSource={data}
        pagination={{
          size: 'small',
          current: +curPageNum,
          onChange: this.handleChange,
          showTotal: total => (`共${total}项`),
          showSizeChanger: true,
          onShowSizeChange: this.handleSizeChange,
          pageSize: +pageSize,
        }}
      />
    );
  }
}
