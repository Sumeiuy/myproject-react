/**
 * @file customerPool/ToDoList.js
 *  目标客户池 待办流程列表
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, message } from 'antd';
import _ from 'lodash';
import {
  RETURN_TASK_FROM_TODOLIST,
} from '../../../config/createTaskEntry';
import { openRctTab } from '../../../utils';
import styles from './toDoList.less';
import logable from '../../../decorators/logable';
import emptyImg from './img/empty.png';

const systemCode = '102330';  // 系统代码（理财服务平台为102330）
const USER_INFO_APPROVE = '投顾信息维护审核流程'; // 用户基本信息审核标识;

export default class ToDoList extends PureComponent {

  static propTypes = {
    data: PropTypes.array.isRequired,
    todolist: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object,
    clearCreateTaskData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    taskBasicInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      flowId: null,
    };
    this.columns = [
      {
        title: '任务名称',
        dataIndex: 'subject',
        key: 'subject',
        render: (item, recode) =>
          (<a
            target="_blank"
            rel="noopener noreferrer"
            title={item.id}
            data={recode.id}
            onClick={this.handleOpenNewPage}
          >
            {item.text}
          </a>),
      },
      {
        title: '类型',
        dataIndex: 'workFlowName',
        key: 'workFlowName',
        render: (item, recode) => (<span>{recode.originator}</span>),
      },
      {
        title: '提交时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (item, recode) => (<span>{recode.originatorName}</span>),
      },
    ];
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
    const { className, data, todolist } = this.props;
    // 没有待办流程
    if (todolist.length === 0) {
      return (<div className={styles.empty}>
        <Table
          className={`${className} ${styles.todoListEmpty}`}
          rowKey={record => record.id}
          columns={this.columns}
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
          columns={this.columns}
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
        columns={this.columns}
        dataSource={data}
      />
    );
  }
}
