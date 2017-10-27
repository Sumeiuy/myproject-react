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
import { getOrgId } from '../../config';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
import CreateTaskFormFlow from '../../components/customerPool/createTask/CreateTaskFormFlow';
import styles from './createTask.less';
import { fspGlobal } from '../../utils';


const orgId = getOrgId;

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
  storedTaskFlowData: state.customerPool.storedTaskFlowData,
  approvalList: state.customerPool.approvalList,
});

const mapDispatchToProps = {
  createTask: fectchDataFunction(true, effects.createTask),
  saveTaskFlowData: query => ({
    type: 'customerPool/saveTaskFlowData',
    payload: query,
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
    storedTaskFlowData: PropTypes.object.isRequired,
    saveTaskFlowData: PropTypes.func.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
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

  @autobind
  /* 关闭当前页 */
  handleCloseTab() {
    const { goBack } = this.props;
    goBack();
  }

  @autobind
  handleCancleTab() {
    fspGlobal.closeRctTabById('RCT_FSP_CUSTOMER_LIST');
  }

  render() {
    const {
      dict,
      location,
      push,
      storedTaskFlowData,
      saveTaskFlowData,
      approvalList,
      getApprovalList,
    } = this.props;
    const { isSuccess } = this.state;
    // console.log(isSuccess);
    return (
      <div className={styles.taskBox}>
        {!isSuccess ?
          <CreateTaskFormFlow
            location={location}
            dict={dict}
            createTask={this.handleCreateTask}
            storedTaskFlowData={storedTaskFlowData}
            saveTaskFlowData={saveTaskFlowData}
            approvalList={approvalList}
            getApprovalList={getApprovalList}
            goBack={this.handleCloseTab}
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
