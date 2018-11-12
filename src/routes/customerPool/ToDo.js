/**
 * @file customerPool/ToDo.js
 *  目标客户池 待办流程列表页
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Input, Row, Col, Tabs } from 'antd';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import ToDoList from '../../components/customerPool/todo/ToDoList';
import TaskList from '../../components/customerPool/todo/TaskList';
import logable from '../../decorators/logable';
import styles from './todo.less';
import { dva } from '../../helper';
import ReportFilter from '../../components/customerPool/todo/ReportFilter';
import { defaultStartTime, defaultEndTime } from '../../components/customerPool/todo/config';

const effect = dva.generateEffect;
const curPageNum = 1;
const pageSize = 10;
const TabPane = Tabs.TabPane;

// const fetchDataFunction = (globalLoading, type) => query => ({
//   type,
//   payload: query || {},
//   loading: globalLoading,
// });
// const effects = {
//   getTaskBasicInfo: 'tasklist/getTaskBasicInfo',
// };
const mapStateToProps = state => ({
  todolist: state.customerPool.todolist,
  data: state.customerPool.todolistRecord,
  taskBasicInfo: state.tasklist.taskBasicInfo,
  applyList: state.customerPool.applyList,
  approveList: state.customerPool.approveList,
  typeValue: state.customerPool.typeValue,
  initiator: state.customerPool.initiator,
});

const mapDispatchToProps = {
  // 获取待办列表
  getToDoList: effect('customerPool/getToDoList', { forceFull: true }),
  // 获取申请列表
  getApplyList: effect('customerPool/getApplyList', { forceFull: true }),
  // 获取审批列表
  getApproveList: effect('customerPool/getApproveList', { forceFull: true }),
  // 获取类型下拉框
  getTypeValue: effect('customerPool/getTypeValue', { forceFull: true }),
  // 获取类型下拉框
  getInitiator: effect('customerPool/getInitiator', { forceFull: true }),
  getTaskBasicInfo: effect('tasklist/getTaskBasicInfo', { forceFull: true }),
  // 清除自建任务数据
  clearCreateTaskData: effect('customerPool/clearCreateTaskData', { forceFull: true }),
};

// const mapDispatchToProps = {
//   push: routerRedux.push,
//   replace: routerRedux.replace,
//   getTaskBasicInfo: fetchDataFunction(true, effects.getTaskBasicInfo),
//   // 清除自建任务数据
//   clearCreateTaskData: query => ({
//     type: 'customerPool/clearCreateTaskData',
//     payload: query || {},
//   }),
// };

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ToDo extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
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
    getTypeValue: PropTypes.func.isRequired,
    typeValue: PropTypes.array.isRequired,
    getInitiator: PropTypes.func.isRequired,
    initiator: PropTypes.array.isRequired,
  }

  static defaultProps = {
    taskBasicInfo: {},
  }

  static contextTypes = {
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
      category: '',
      // 发起人下拉value
      originator: '',
    };
  }

  componentDidMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
      getTypeValue,
      getInitiator,
    } = this.props;
    this.getApplyList(query, pageNum, pageSize);
    this.getApproveList(query, pageNum, pageSize);
    getTypeValue();
    getInitiator();
  }

  // 调用列表接口
  @autobind
  getTaskList(query, pageNum, pageSize) {
  }

  // 获取申请列表
  @autobind
  getApplyList(query, pageNum, pageSize) {
    const {
      location: {
        query: {
          taskType
        }
      }
    } = this.props;
    const { replace } = this.context;
    if(!_.isEmpty(taskType)) {
      this.props.getApplyList(query, pageNum = 1, pageSize = 10);
      this.setState({ activeKey: taskType });
    } else {
      replace({
        query: {
          ...query,
          taskType: '1',
        },
      });
      this.props.getApplyList(query, pageNum = 1, pageSize = 10);
      this.setState({ activeKey: '1' });
    }
  }

  // 获取审批列表
  @autobind
  getApproveList(query, pageNum, pageSize) {
    this.props.getApproveList(query, pageNum = 1, pageSize = 10);
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
    const { replace, location: { pathname, query } } = this.props;
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

  @autobind
  pageChange(obj) {
    const { replace, location: { pathname, query } } = this.props;
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
    const { replace, location: { pathname, query } } = this.props;
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
    this.setState({
      ...obj,
    }, () => {
      this.getApplyList(this.state);
    });
  }

  // 头部发起人筛选回调函数
  @autobind
  handleInitiatorCallback(obj) {
    this.setState({
      ...obj,
    }, () => {
      this.getApproveList(this.state);
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

  render() {
    const {
      data,
      todolist,
      location,
      push,
      replace,
      taskBasicInfo,
      getTaskBasicInfo,
      clearCreateTaskData,
      applyList: {
        empWorkFlowList: applyListData,
      },
      approveList: {
        empWorkFlowList: approveListData,
      },
      typeValue,
      initiator,
    } = this.props;
    const { category, originator } = this.state;
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
              <ReportFilter
                filterCallback={this.handlefilterCallback}
                onSearch={this.onSearch}
                startTime={defaultStartTime}
                endTime={defaultEndTime}
                typeData={typeValue}
                type={['', category]}
              />
              {
                !_.isEmpty(data) ?
                <TaskList
                  className="todoList"
                  data={applyListData}
                  location={location}
                  push={push}
                  replace={replace}
                  listType='apply'
                />
                : null
              }

            </div>
          </TabPane>
          <TabPane key='3' tab='我的审批'>
            <div>
              <ReportFilter
                filterCallback={this.handlefilterCallback}
                onSearch={this.onSearch}
                startTime={defaultStartTime}
                endTime={defaultEndTime}
                typeData={typeValue}
                type={['', category]}
                initiatorData={initiator}
                initiator={['', originator]}
                isApprove
              />
              {
                !_.isEmpty(data) ?
                <TaskList
                  className="todoList"
                  data={approveListData}
                  location={location}
                  push={push}
                  replace={replace}
                  listType='approve'
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
