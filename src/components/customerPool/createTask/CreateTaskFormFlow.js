/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Mention } from 'antd';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import Button from '../../common/Button';
import CreateTaskForm from './CreateTaskForm';
import TaskFormFlowStep from './TaskFormFlowStep';
import styles from './createTaskFormFlow.less';
import { dispatchTabPane } from '../../../utils';
import Clickable from '../../../components/common/Clickable';
import { validateFormContent } from '../../../decorators/validateFormContent';


const { toString } = Mention;


export default class CreateTaskFormFlow extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object,
    createTask: PropTypes.func,
    createTaskResult: PropTypes.object,
    storedCreateTaskData: PropTypes.object.isRequired,
    saveCreateTaskData: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    push: PropTypes.func.isRequired,
    isShowApprovalModal: PropTypes.bool.isRequired,
    isApprovalListLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    enterType: PropTypes.string,
  }

  static defaultProps = {
    dict: {},
    createTaskResult: {},
    createTask: () => { },
    orgId: null,
    enterType: null,
  }

  constructor(props) {
    super(props);
    const { location: { query: { source } } } = props;
    this.state = {
      showBtn: _.includes(['custGroupList'], source),
      isShowErrorInfo: false,
      isShowErrorTaskType: false,
      isShowErrorExcuteType: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: { source } } } = nextProps;
    this.setState({
      showBtn: _.includes(['custGroupList'], source),
    });
  }

  // 从业务目标池客户：businessCustPool
  // 标签、搜索目标客户：searchCustPool
  // 绩效目标客户 - 净新增客户： performanceCustPool
  // 绩效目标客户 - 业务开通：performanceBusinessOpenCustPool


  @autobind
  parseQuery() {
    const { location: { query: { ids, condition } } } = this.props;
    let custCondition = {};
    let custIdList = null;
    if (!_.isEmpty(ids)) {
      custIdList = decodeURIComponent(ids).split(',');
      custCondition = JSON.parse(decodeURIComponent(condition));
    } else {
      custCondition = JSON.parse(decodeURIComponent(condition));
    }
    return {
      custIdList,
      custCondition,
    };
  }

  // 自建任务提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { createTask, location: { query } } = this.props;
    const { groupId, enterType } = query;
    this.createTaskForm.getWrappedInstance().validateFields((err, values) => {
      let isFormError = false;
      console.log(err);
      if (!_.isEmpty(err)) {
        isFormError = true;
      }
      const formDataValidation = this.checkFormField({ ...values, isFormError });
      if (formDataValidation) {
        const templetDesc = toString(values.templetDesc);
        const value = { ...values, groupId, enterType, templetDesc };
        createTask(value);
      }
    });
  }

  @autobind
  @validateFormContent
  checkFormField(values) {
    console.log(values);
  }

  @autobind
  handleCancleTab() {
    const { push } = this.props;
    dispatchTabPane({
      fspAction: 'closeRctTabById',
      id: 'RCT_FSP_CREATE_TASK',
      url: '/customerPool/customerGroupManage',
      routerAction: push,
      removePanes: ['createTask'],
    });
  }

  render() {
    const {
      dict,
      location,
      storedCreateTaskData,
      saveCreateTaskData,
      createTask,
      getApprovalList,
      approvalList,
      orgId,
      push,
      isShowApprovalModal,
      isApprovalListLoadingEnd,
      onCancel,
    } = this.props;
    const { showBtn,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
    } = this.state;
    console.log('location-->', location);
    return (
      <div className={styles.taskInner}>
        {showBtn ?
          <div className={styles.taskcontent}>
            <CreateTaskForm
              location={location}
              dict={dict}
              ref={ref => this.createTaskForm = ref}
              isShowErrorInfo={isShowErrorInfo}
              isShowErrorExcuteType={isShowErrorExcuteType}
              isShowErrorTaskType={isShowErrorTaskType}
            />
            <div
              className={
                classnames({
                  [styles.hideTextArea]: !showBtn,
                  [styles.showTextArea]: showBtn,
                })
              }
            >
              <div className={styles.task_btn}>
                <Clickable
                  onClick={this.handleCancleTab}
                  eventName="/click/createTaskForm/cancel"
                >
                  <Button>取消</Button>
                </Clickable>
                <Clickable
                  onClick={this.handleSubmit}
                  eventName="/click/createTaskForm/submit"
                >
                  <Button type="primary">提交</Button>
                </Clickable>
              </div>
            </div>
          </div>
          :
          <TaskFormFlowStep
            location={location}
            dict={dict}
            saveCreateTaskData={saveCreateTaskData}
            storedCreateTaskData={storedCreateTaskData}
            createTask={createTask}
            approvalList={approvalList}
            getApprovalList={getApprovalList}
            parseQuery={this.parseQuery}
            push={push}
            orgId={orgId}
            isShowApprovalModal={isShowApprovalModal}
            isApprovalListLoadingEnd={isApprovalListLoadingEnd}
            onCancel={onCancel}
          />
        }
      </div>
    );
  }
}
