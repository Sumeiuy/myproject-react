/**
 * @file customerPool/CreateTask.js
 *  客户池-自建任务
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
import CreateTaskFormFlow from '../../components/customerPool/createTask/CreateTaskFormFlow';
import withRouter from '../../decorators/withRouter';
import styles from './createTask.less';
import { closeRctTab } from '../../utils';
import { emp } from '../../helper';


const orgId = emp.getOrgId();
const EMPTY_ARRAY = [];

const effects = {
  createTask: 'customerPool/createTask',
  getApprovalList: 'customerPool/getApprovalList',
  generateTemplateId: 'customerPool/generateTemplateId',
  getApprovalBtn: 'customerPool/getApprovalBtn',
  submitApproval: 'customerPool/submitApproval',
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
  getApprovalListLoading: state.loading.effects[effects.getApprovalList],
  templateId: state.customerPool.templateId,
  approvalBtn: state.customerPool.approvalBtn,
  submitSuccess: state.customerPool.submitSuccess,
  creator: state.app.creator,
});

const mapDispatchToProps = {
  createTask: fectchDataFunction(true, effects.createTask),
  saveCreateTaskData: query => ({
    type: 'customerPool/saveCreateTaskData',
    payload: query,
  }),
  push: routerRedux.push,
  goBack: routerRedux.goBack,
  getApprovalList: fectchDataFunction(true, effects.getApprovalList),
  generateTemplateId: fectchDataFunction(true, effects.generateTemplateId),
  getApprovalBtn: fectchDataFunction(true, effects.getApprovalBtn),
  submitApproval: fectchDataFunction(true, effects.submitApproval),
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
    getApprovalListLoading: PropTypes.bool,
    // 新增
    templateId: PropTypes.number.isRequired,
    generateTemplateId: PropTypes.func.isRequired,
    creator: PropTypes.string,
    submitApproval: PropTypes.func,
    approvalBtn: PropTypes.object,
    submitSuccess: PropTypes.bool,
    getApprovalBtn: PropTypes.func,
  };

  static defaultProps = {
    data: [],
    dict: {},
    createTaskResult: {},
    getApprovalListLoading: false,
    creator: '',
    approvalBtn: {},
    submitSuccess: false,
    submitApproval: () => { },
    getApprovalBtn: () => { },
  };

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      isApprovalListLoadingEnd: false,
      isShowApprovalModal: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { createTaskResult: preCreateTaskResult,
      getApprovalListLoading,
      approvalList = EMPTY_ARRAY } = this.props;
    const { createTaskResult: nextcreateTaskResult,
      approvalList: nextList = EMPTY_ARRAY,
      getApprovalListLoading: nextApprovalListLoading } = nextProps;
    if (preCreateTaskResult !== nextcreateTaskResult) {
      this.handleCreateTaskSuccess(nextcreateTaskResult);
    }

    if (getApprovalListLoading && !nextApprovalListLoading) {
      this.setState({
        isApprovalListLoadingEnd: true,
      });
    }

    if (approvalList !== nextList) {
      this.setState({
        isShowApprovalModal: true,
      });
    }
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
    if (source === 'custGroupList') {
      // 从客户分组发起任务
      closeRctTab({ id: 'RCT_FSP_CREATE_TASK_FROM_CUSTGROUP' });
    } else if (source === 'managerView') {
      // 从管理者视图发起任务
      closeRctTab({ id: 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW' });
    } else if (source === 'returnTask') {
      closeRctTab({ id: 'FSP_TODOLIST' });
    } else {
      // 从客户列表发起任务
      closeRctTab({ id: 'RCT_FSP_CREATE_TASK_FROM_CUSTLIST' });
    }
  }

  @autobind
  resetLoading() {
    this.setState({
      isShowApprovalModal: false,
      isApprovalListLoadingEnd: true,
    });
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
      templateId,
      generateTemplateId,
      creator,
      approvalBtn,
      getApprovalBtn,
      submitSuccess,
      submitApproval,
    } = this.props;

    const { isSuccess, isApprovalListLoadingEnd, isShowApprovalModal } = this.state;
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
            isShowApprovalModal={isShowApprovalModal}
            isApprovalListLoadingEnd={isApprovalListLoadingEnd}
            onCancel={this.resetLoading}
            templateId={templateId}
            generateTemplateId={generateTemplateId}
            onCloseTab={this.handleCancleTab}
            creator={creator}
            approvalBtn={approvalBtn}
            getApprovalBtn={getApprovalBtn}
            submitSuccess={submitSuccess}
            submitApproval={submitApproval}
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
