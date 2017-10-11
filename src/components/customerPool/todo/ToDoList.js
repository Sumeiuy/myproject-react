/**
 * @file customerPool/ToDoList.js
 *  目标客户池 待办流程列表
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Table } from 'antd';
import { fspGlobal } from '../../../utils';

import styles from './toDoList.less';

import emptyImg from '../../../../static/images/empty.png';

const columns = [
  {
    title: '任务名称',
    dataIndex: 'task',
    key: 'task',
    render: item => <a
      onClick={() => {
        const url = `${item.dispatchUri}&workFlowName=${encodeURI(item.flowClass)}`;
        const param = {
          closable: true,
          forceRefresh: true,
          id: 'FSP_TODOLIST_DETAIL',
          title: '待办流程详情',
        };
        fspGlobal.openFspIframeTab({ url, param });
      }}
      title={item.text}
    >
      {_.truncate(item.text, { length: 18, omission: '...' })}
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
    todoPage: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
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
    this.props.onChange({
      curPageNum: page,
    });
  }
  render() {
    const { className, data, todoPage, todolist } = this.props;
    // 没有待办流程
    if (todolist.length === 0) {
      return (<div className={styles.empty}>
        <Table
          className={`${className} ${styles.todoListEmpty}`}
          rowKey={record => record.applyId}
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
          rowKey={record => record.applyId}
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
        // rowKey={record => record.applyId}
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
