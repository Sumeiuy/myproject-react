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
import moment from 'moment';

import withRouter from '../../decorators/withRouter';
import ToDoList from '../../components/customerPool/todo/ToDoList';
import TaskList from '../../components/customerPool/todo/TaskList';
import logable from '../../decorators/logable';
import styles from './todo.less';
import { dva } from '../../helper';
import TodoFilter from '../../components/customerPool/todo/TodoFilter';
import { defaultStartTime, defaultEndTime, typeOption } from '../../components/customerPool/todo/config';

const effect = dva.generateEffect;
const DEFAULT_PAGENUM = 1;
const DEFAULT_PAGESIZE = 10;
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
    this.state = {
      // 任务开始时间
      startTime: defaultStartTime,
      // 任务结束时间
      endTime: defaultEndTime,
      // 类型下拉框value
      applyType: [],
      approveType: [],
      // 发起人下拉value
      initiatorValue: '',
      // 类型 ''为不限
      category: '',
      // 发起人 ''为不限
      originator: '',
    };
  }

  componentDidMount() {
    const {
      location: {
        pathname,
        query: {
          taskType,
        },
      }
    } = this.props;
    const {
      startTime,
      endTime,
      category,
      originator,
    } = this.state;
    if (_.isEmpty(taskType)) {
      this.context.replace({
        pathname,
        query: {
          taskType: 'MY_TODO',
        },
      });
    }
    // taskType为MY_APPLY是我的申请 MY_APPROVE是我的审批
    switch (taskType) {
      case 'MY_APPLY':
        this.getApplyData({
          startTime,
          endTime,
          pageSize: DEFAULT_PAGESIZE,
          pageNum: DEFAULT_PAGENUM,
          category,
        });
        break;
      case 'MY_APPROVE':
        this.getApproveData({
          startTime,
          endTime,
          pageSize: DEFAULT_PAGESIZE,
          pageNum: DEFAULT_PAGENUM,
          category,
          originator,
        });
        break;
      default:
        break;
    }
  }

  // 获取申请列表
  @autobind
  getApplyData(item) {
    this.props.getApplyList(item);
  }

  // 获取审批列表
  @autobind
  getApproveData(item) {
    this.props.getApproveList(item);
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
    this.context.replace({
      pathname,
      query: {
        ...query,
        keyword: value,
        pageNum: DEFAULT_PAGENUM,
        pageSize: DEFAULT_PAGESIZE,
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
    this.getApplyData({
      pageSize: DEFAULT_PAGESIZE,
      pageNum: DEFAULT_PAGENUM,
      subject: value
    });
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
    this.getApproveData({
      pageSize: DEFAULT_PAGESIZE,
      pageNum: DEFAULT_PAGENUM,
      subject: value
    });
  }

  @autobind
  pageChange(obj) {
    const { location: { pathname, query } } = this.props;
    this.context.replace({
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
    this.context.replace({
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
        }
      }
    } = this.props;
    const {
      key,
      value,
    } = obj;
    const {
      startTime,
      endTime,
      originator,
    } = this.state;
    // taskType为MY_APPLY是我的申请 MY_APPROVE是我的审批
    switch (taskType) {
      case 'MY_APPLY':
        this.setState({
          applyType: [key, value],
          category: key,
        }, () => {
          this.getApplyData({
            pageSize: DEFAULT_PAGESIZE,
            pageNum: DEFAULT_PAGENUM,
            category: key,
            startTime,
            endTime,
          });
        });
        break;
      case 'MY_APPROVE':
        this.setState({
          approveType: [key, value],
          category: key,
        }, () => {
          this.getApproveData({
            pageSize: DEFAULT_PAGESIZE,
            pageNum: DEFAULT_PAGENUM,
            category: key,
            startTime,
            endTime,
            originator,
          });
        });
        break;
      default:
        break;
    }
  }

  // 头部时间筛选回调函数
  @autobind
  handleTimeChange(obj) {
    const {
      location: {
        query: {
          taskType,
        }
      }
    } = this.props;
    const {
      startTime,
      endTime,
    } = obj;
    const {
      category,
      originator,
    } = this.state;
    // taskType为MY_APPLY是我的申请 MY_APPROVE是我的审批
    switch (taskType) {
      case 'MY_APPLY':
        this.setState({
          startTime: moment(startTime).valueOf(),
          endTime: moment(endTime).valueOf(),
        }, () => {
          const {
            startTime,
            endTime,
          } = this.state;
          this.getApplyData({
            pageSize: DEFAULT_PAGESIZE,
            pageNum: DEFAULT_PAGENUM,
            startTime,
            endTime,
            category,
          });
        });
        break;
      case 'MY_APPROVE':
        this.setState({
          startTime: moment(startTime).valueOf(),
          endTime: moment(endTime).valueOf(),
        }, () => {
          const {
            startTime,
            endTime,
          } = this.state;
          this.getApproveData({
            pageSize: DEFAULT_PAGESIZE,
            pageNum: DEFAULT_PAGENUM,
            startTime,
            endTime,
            category,
            originator,
          });
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
      name,
      id,
    } = obj;
    const {
      startTime,
      endTime,
      category,
    } = this.state;
    this.setState({
      initiatorValue: [id, name]
    }, () => {
      this.getApproveData({
        pageSize: DEFAULT_PAGESIZE,
        pageNum: DEFAULT_PAGENUM,
        originator: id,
        startTime,
        endTime,
        category,
      });
    });
  }

  // 标签切换
  @autobind
  handleTabsChange(obj) {
    const {
      location: {
        pathname,
        query,
        query: {
          taskType,
        }
      }
    } = this.props;
    const {
      originator,
    } = this.state;
    if (obj === taskType) {
      return;
    }
    this.context.replace({
      pathname,
      query: {
        ...query,
        taskType: obj,
      },
    });
    switch (obj) {
      case 'MY_APPLY':
        this.setState({
          startTime: defaultStartTime,
          endTime: defaultEndTime,
          applyType: [],
          category: '',
        }, () => {
          const { category } = this.state;
          this.getApplyData({
            startTime: defaultStartTime,
            endTime: defaultEndTime,
            pageSize: DEFAULT_PAGESIZE,
            pageNum: DEFAULT_PAGENUM,
            category,
          });
        });
        break;
      case 'MY_APPROVE':
        this.setState({
          startTime: defaultStartTime,
          endTime: defaultEndTime,
          approveType: [],
          category: '',
        }, () => {
          const { category } = this.state;
          this.getApproveData({
            startTime: defaultStartTime,
            endTime: defaultEndTime,
            pageSize: DEFAULT_PAGESIZE,
            pageNum: DEFAULT_PAGENUM,
            category,
            originator,
          });
        });
        break;
      default:
        break;
    }
  }

  // 分页
  @autobind
  onPageChange(page) {
    const {
      location: {
        query: {
          taskType,
        }
      }
    } = this.props;
    const {
      startTime,
      endTime,
      category,
      originator,
    } = this.state;
    // taskType为MY_APPLY是我的申请 MY_APPROVE是我的审批
    switch (taskType) {
      case 'MY_APPLY':
        this.getApplyData({
          pageSize: DEFAULT_PAGESIZE,
          pageNum: page,
          startTime,
          endTime,
          category,
        });
        break;
      case 'MY_APPROVE':
        this.getApproveData({
          pageSize: DEFAULT_PAGESIZE,
          pageNum: page,
          startTime,
          endTime,
          category,
          originator,
        });
        break;
      default:
        break;
    }
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
        page: applyPage,
      },
      approveList: {
        empWorkFlowList: approveListData,
        page: approvePage,
      },
      initiator,
    } = this.props;
    const { push, replace } = this.context;
    const { applyType, approveType, initiatorValue, startTime, endTime } = this.state;
    const {
      query: {
        keyword,
        taskType = 'MY_TODO',
      }
    } = location;
    return (
      <div className={styles.todo}>
        <Tabs defaultActiveKey="MY_TODO" activeKey={taskType} type="card" onChange={this.handleTabsChange}>
          <TabPane key="MY_TODO" tab="我的待办">
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
          <TabPane key="MY_APPLY" tab="我的申请">
            <div>
              <TodoFilter
                filterCallback={this.handlefilterCallback}
                InputChange={this.handleTypeInputChange}
                onSearch={this.handleApplySearch}
                startTime={startTime}
                endTime={endTime}
                typeData={typeOption}
                type={applyType}
                onTimeChange={this.handleTimeChange}
              />
              <TaskList
                className="todoList"
                data={applyListData}
                location={location}
                listType="apply"
                clearCreateTaskData={clearCreateTaskData}
                emptyText="您名下没有符合条件的申请"
                page={applyPage}
                onPageChange={this.onPageChange}
              />
            </div>
          </TabPane>
          <TabPane key="MY_APPROVE" tab="我的审批">
            <div>
              <TodoFilter
                filterCallback={this.handlefilterCallback}
                initiatorCallback={this.handleInitiatorCallback}
                onSearch={this.handleApproveSearch}
                InputChange={this.handleInitiatorInputChange}
                startTime={startTime}
                endTime={endTime}
                typeData={typeOption}
                type={approveType}
                initiatorData={initiator}
                initiator={initiatorValue}
                isApprove
                onTimeChange={this.handleTimeChange}
              />
              <TaskList
                className="todoList"
                data={approveListData}
                location={location}
                listType="approve"
                clearCreateTaskData={clearCreateTaskData}
                emptyText="您名下没有符合条件的审批"
                page={approvePage}
                onPageChange={this.onPageChange}
              />
            </div>
          </TabPane>
        </Tabs>

      </div>
    );
  }
}
