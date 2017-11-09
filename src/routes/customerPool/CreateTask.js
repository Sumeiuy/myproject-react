/**
 * @file customerPool/CreateTask.js
 *  客户池-自建任务
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
import CreateTaskFormFlow from '../../components/customerPool/createTask/CreateTaskFormFlow';
import styles from './createTask.less';
import { fspGlobal, helper } from '../../utils';


const orgId = helper.getOrgId();

const effects = {
  createTask: 'customerPool/createTask',
  getApprovalList: 'customerPool/getApprovalList',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  dict: state.app.dict,
  createTaskResult: state.customerPool.createTaskResult,
  storedCreateTaskData: state.customerPool.storedCreateTaskData,
  approvalList: state.customerPool.approvalList,
});

const mapDispatchToProps = {
  createTask: fectchDataFunction(true, effects.createTask),
  saveCreateTaskData: query => ({
    type: 'customerPool/saveCreateTaskData',
    payload: query,
  }),
  clearCreateTaskData: query => ({
    type: 'customerPool/clearCreateTaskData',
    payload: query || {},
  }),
  push: routerRedux.push,
  goBack: routerRedux.goBack,
  getApprovalList: fectchDataFunction(true, effects.getApprovalList),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CreateTask extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array,
    dict: PropTypes.object,
    goBack: PropTypes.func.isRequired,
    createTask: PropTypes.func.isRequired,
    createTaskResult: PropTypes.object,
    push: PropTypes.func.isRequired,
    storedCreateTaskData: PropTypes.object.isRequired,
    saveCreateTaskData: PropTypes.func.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: [],
    dict: {},
    createTaskResult: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { createTaskResult: preCreateTaskResult } = this.props;
    const { createTaskResult: nextcreateTaskResult } = nextProps;
    if (preCreateTaskResult !== nextcreateTaskResult) {
      this.handleCreateTaskSuccess(nextcreateTaskResult);
    }
    // console.log(nextcreateTaskResult);
  }

  componentWillUnmount() {
    const { clearCreateTaskData } = this.props;
    // 清除数据
    clearCreateTaskData();
  }


  @autobind
  handleCreateTaskSuccess(result) {
    const { createTaskResult } = result;
    if (!_.isEmpty(createTaskResult.code) && createTaskResult.code === '0') {
      this.setState({
        isSuccess: true,
      });
    }
  }

  @autobind
  handleCreateTask(value) {
    const {
      createTask,
    } = this.props;
    // console.log(value);
    createTask(value);
  }

  /* 关闭当前页 */
  @autobind
  handleCancleTab() {
    const { location: { query: { source = '' } } } = this.props;
    const param = {
      id: 'tab-home',
      title: '首页',
    };
    if (source === 'custGroupList') {
      // 从客户分组管理过来的，是另外开的tab，需要关闭当前新开的tab
      // 并且用closeTabMenu关闭
      fspGlobal.closeTabMenu('RCT_FSP_CREATE_TASK');
    } else {
      fspGlobal.closeRctTabById('RCT_FSP_CUSTOMER_LIST');
    }
    fspGlobal.openRctTab({ url: '/customerPool', param });
  }

  render() {
    const {
      dict,
      location,
      push,
      storedCreateTaskData,
      saveCreateTaskData,
      approvalList,
      getApprovalList,
    } = this.props;
    const { isSuccess } = this.state;
    return (
      <div className={styles.taskBox}>
        {!isSuccess ?
          <CreateTaskFormFlow
            location={location}
            dict={dict}
            createTask={this.handleCreateTask}
            storedCreateTaskData={storedCreateTaskData}
            saveCreateTaskData={saveCreateTaskData}
            approvalList={approvalList}
            getApprovalList={getApprovalList}
            push={push}
            orgId={orgId}
            onCloseTab={this.handleCancleTab}
          /> :
          <CreateTaskSuccess
            successType={isSuccess}
            push={push}
            location={location}
            onCloseTab={this.handleCancleTab}
          />
        }
      </div>
    );
  }
}
