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
import ToDoNav from '../../components/customerPool/todo/ToDoNav';
import { dva } from '../../helper';
import ReportFilter from '../../components/customerPool/todo/ReportFilter';

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
  approveList: state.customerPool.applyList,
  typeValue: state.customerPool.typeValue,
});

const mapDispatchToProps = {
  // 获取待办列表
  getToDoList: effect('customerPool/getToDoList', { forceFull: true }),
  // 获取申请列表
  getApplyList: effect('customerPool/getApplyList', { forceFull: true }),
  // 获取审批列表
  getApprove: effect('customerPool/getApprove', { forceFull: true }),
  // 获取类型下拉框
  getTypeValue: effect('customerPool/getTypeValue', { forceFull: true }),
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
  }

  static defaultProps = {
    taskBasicInfo: {},
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
      getApplyList,
    } = this.props;
    getApplyList(pageNum, pageSize);
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
    // this.props.pageChange(obj);
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
        empWorkFlowList,
      },
    } = this.props;
    const { query: { keyword } } = location;
    const applyListData = _.map(empWorkFlowList, item =>  _.omit(item, ['id', 'dispatchUri']));
    return (
      <div className={styles.todo}>
        <Tabs defaultActiveKey="1" type='card'>
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
              />
              <TaskList
                className="todoList"
                data={applyListData}
                onPageChange={this.pageChange}
                onSizeChange={this.sizeChange}
                location={location}
                push={push}
                replace={replace}
                taskBasicInfo={taskBasicInfo}
                getTaskBasicInfo={getTaskBasicInfo}
                clearCreateTaskData={clearCreateTaskData}
              />
            </div>
          </TabPane>
          <TabPane key='3' tab='我的审批'>

          </TabPane>
        </Tabs>

      </div>
    );
  }
}
