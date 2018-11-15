/**
 * @file customerPool/ToDo.js
 *  目标客户池 待办流程列表页
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Tabs } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import withRouter from '../../decorators/withRouter';
import ToDoList from '../../components/customerPool/todo/ToDoList';
import TaskList from '../../components/customerPool/todo/TaskList';
import logable from '../../decorators/logable';
import styles from './todo.less';
import { dva } from '../../helper';
import TodoFilter from '../../components/customerPool/todo/TodoFilter';
import { defaultStartTime, defaultEndTime, typeOption } from '../../components/customerPool/todo/config';

const effect = dva.generateEffect;
const curPageNum = 1;
const pageSize = 10;
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
  todolist: state.customerPool.todolist,
  data: state.customerPool.todolistRecord,
  taskBasicInfo: state.tasklist.taskBasicInfo,
  applyList: state.customerPool.applyList,
  approveList: state.customerPool.approveList,
  initiator: state.customerPool.initiator,
});

const mapDispatchToProps = {
  // 获取待办列表
  getToDoList: effect('customerPool/getToDoList', { forceFull: true }),
  // 获取申请列表
  getApplyList: effect('customerPool/getApplyList', { forceFull: true }),
  // 获取审批列表
  getApproveList: effect('customerPool/getApproveList', { forceFull: true }),
  // 获取发起人下拉框
  getInitiator: effect('customerPool/getInitiator', { forceFull: true }),
  getTaskBasicInfo: effect('tasklist/getTaskBasicInfo', { forceFull: true }),
  // 清除自建任务数据
  clearCreateTaskData: effect('customerPool/clearCreateTaskData', { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ToDo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    todolist: PropTypes.array.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object,
    clearCreateTaskData: PropTypes.func.isRequired,
    getApplyList: PropTypes.func.isRequired,
    applyList: PropTypes.object.isRequired,
    getApproveList: PropTypes.func.isRequired,
    approveList: PropTypes.object.isRequired,
    getInitiator: PropTypes.func.isRequired,
    initiator: PropTypes.array.isRequired,
  }

  static defaultProps = {
    taskBasicInfo: {},
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    empInfo: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const {
      location: {
        query: {
          taskType
        }
      }
    } = props;
    this.state = {
      // 任务开始时间
      startTime: defaultStartTime,
      // 任务结束时间
      endTime: defaultEndTime,
      // 标签类型
      activeKey: taskType,
      // 类型下拉框value
      applyType: [],
      approveType: [],
      // 发起人下拉value
      initiatorValue: [],
    };
  }

  componentDidMount() {
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1,
        },
      }
    } = this.props;
    const {
      startTime,
      endTime,
    } = this.state;
    this.getApplyData({startTime, endTime, pageSize, pageNum});
    this.getApproveData({startTime, endTime, pageSize, pageNum});
  }

  // 获取申请列表
  @autobind
  getApplyData(query) {
    const {
      location: {
        query: {
          taskType,
        }
      }
    } = this.props;
    const { replace } = this.context;
    if(!_.isEmpty(taskType)) {
      this.props.getApplyList(query);
      this.setState({ activeKey: taskType });
    } else {
      replace({
        query: {
          taskType: '1',
        },
      });
      this.props.getApplyList(query);
      this.setState({ activeKey: '1' });
    }
  }

  // 获取审批列表
  @autobind
  getApproveData(query) {
    this.props.getApproveList(query);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '关键字搜索任务',
      value: '$args[0]',
    },
  })
  onSearch(value) {
    // this.props.search(value);
    const { location: { pathname, query } } = this.props;
    const { replace } = this.context;
    replace({
      pathname,
      query: {
        ...query,
        keyword: value,
        curPageNum,
        pageSize,
      },
    });
  }

  // 申请搜索
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '关键字搜索任务',
      value: '$args[0]',
    },
  })
  handleApplySearch(value) {
    const { location: { query: { pageSize = 10, pageNum = 1 } } } = this.props;
    this.getApplyData({pageSize, pageNum, subject: value});
  }

  // 审批搜索
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '关键字搜索任务',
      value: '$args[0]',
    },
  })
  handleApproveSearch(value) {
    const { location: { query: { pageSize = 10, pageNum = 1 } } } = this.props;
    this.getApproveData({ pageSize, pageNum, subject: value });
  }

  @autobind
  pageChange(obj) {
    const { location: { pathname, query } } = this.props;
    const { replace } = this.context;
    replace({
      pathname,
      query: {
        ...query,
        ...obj,
      },
    });
  }

  @autobind
  sizeChange(obj) {
    const { location: { pathname, query } } = this.props;
    const { replace } = this.context;
    replace({
      pathname,
      query: {
        ...query,
        ...obj,
      },
    });
  }

  // 头部类型筛选回调函数
  @autobind
  handlefilterCallback(obj) {
    const {
      location: {
        query: {
          taskType,
          pageSize = 10,
          pageNum = 1
        }
      }
    } = this.props;
    const {
      key,
      value,
    } = obj;
    // taskType为2是我的申请 3是我的审批
    switch (taskType) {
      case '2':
        this.setState({
          applyType: [key, value],
        }, () => {
          this.getApplyData({pageSize, pageNum, category: key});
        });
        break;
      case '3':
        this.setState({
          approveType: [key, value],
        }, () => {
          this.getApproveData({pageSize, pageNum, category: key});
        });
        break;
      default:
        break;
    }
  }

  // 头部发起人筛选回调函数
  @autobind
  handleInitiatorCallback(obj) {
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1
        }
      }
    } = this.props;
    const {
      name,
      key,
    } = obj;
    this.setState({
      initiatorValue: [key, name]
    }, () => {
      this.getApproveData({pageSize, pageNum, originator: name});
    });
  }

  // 标签切换
  @autobind
  handleTabsChange(obj) {
    const { location: { query, query: { taskType } } } = this.props;
    const { replace } = this.context;
    if (obj === taskType) {
      return;
    }
    replace({
      query: {
        ...query,
        taskType: obj,
      },
    });
    this.setState({ activeKey: obj });
  }

  // 发起人下拉框输入
  @autobind
  handleInitiatorInputChange(value) {
    if (value.length < 4) {
      return;
    }
    this.props.getInitiator({ emp: value });
  }

  render() {
    const {
      data,
      todolist,
      location,
      taskBasicInfo,
      getTaskBasicInfo,
      clearCreateTaskData,
      applyList: {
        empWorkFlowList: applyListData,
      },
      approveList: {
        empWorkFlowList: approveListData,
      },
      initiator,
    } = this.props;
    const { push, replace } = this.context;
    const { applyType, approveType, initiatorValue } = this.state;
    const { query: { keyword } } = location;
    return (
      <div className={styles.todo}>
        <Tabs defaultActiveKey="1" activeKey={this.state.activeKey} type='card' onChange={this.handleTabsChange}>
          <TabPane key='1' tab='我的待办'>
            <div className="search-box">
              <Input.Search
                className="search-input"
                placeholder="任务名称"
                defaultValue={keyword}
                onSearch={this.onSearch}
                enterButton
              />
            </div>
            <ToDoList
              className="todoList"
              data={data}
              todolist={todolist}
              onPageChange={this.pageChange}
              onSizeChange={this.sizeChange}
              location={location}
              push={push}
              replace={replace}
              taskBasicInfo={taskBasicInfo}
              getTaskBasicInfo={getTaskBasicInfo}
              clearCreateTaskData={clearCreateTaskData}
            />
          </TabPane>
          <TabPane key='2' tab='我的申请'>
            <div>
              <TodoFilter
                filterCallback={this.handlefilterCallback}
                InputChange={this.handleTypeInputChange}
                onSearch={this.handleApplySearch}
                startTime={defaultStartTime}
                endTime={defaultEndTime}
                typeData={typeOption}
                type={applyType}
              />
              {
                !_.isEmpty(applyListData) ?
                <TaskList
                  className="todoList"
                  data={applyListData}
                  location={location}
                  listType='apply'
                  clearCreateTaskData={clearCreateTaskData}
                />
                : null
              }

            </div>
          </TabPane>
          <TabPane key='3' tab='我的审批'>
            <div>
              <TodoFilter
                filterCallback={this.handlefilterCallback}
                initiatorCallback={this.handleInitiatorCallback}
                onSearch={this.handleApproveSearch}
                InputChange={this.handleInitiatorInputChange}
                startTime={defaultStartTime}
                endTime={defaultEndTime}
                typeData={typeOption}
                type={approveType}
                initiatorData={initiator}
                initiator={initiatorValue}
                isApprove
              />
              {
                !_.isEmpty(approveListData) ?
                  <TaskList
                    className="todoList"
                    data={approveListData}
                    location={location}
                    listType='approve'
                    clearCreateTaskData={clearCreateTaskData}
                  />
                  : null
              }

            </div>
          </TabPane>
        </Tabs>

      </div>
    );
  }
}
