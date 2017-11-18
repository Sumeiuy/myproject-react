/**
 * @Date: 2017-11-10 15:13:41
 * @Last Modified by:   sunweibin
 * @Last Modified time: 2017-11-10 15:13:41
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Mention } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import CreateTaskForm from './CreateTaskForm';
import TaskPreview from '../taskFlow/TaskPreview';
import { helper, permission } from '../../../utils';
import { validateFormContent } from '../../../decorators/validateFormContent';
import styles from './taskFormFlowStep.less';

const { toString } = Mention;

export default class TaskFormFlowStep extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    dict: PropTypes.object,
    saveCreateTaskData: PropTypes.func.isRequired,
    storedCreateTaskData: PropTypes.object,
    createTask: PropTypes.func.isRequired,
    parseQuery: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    isShowApprovalModal: PropTypes.bool.isRequired,
    isApprovalListLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    dict: {},
    storedCreateTaskData: {},
    orgId: null,
  };

  constructor(props) {
    super(props);
    const { storedCreateTaskData: {
      taskFormData,
      current,
      custSource,
     } } = props;
    this.state = {
      current: current || 0,
      previousData: taskFormData || {},
      currentTab: '1',
      custSource: custSource || '',
      isShowErrorInfo: false,
      isShowErrorExcuteType: false,
      isShowErrorTaskType: false,
    };
    // 创建任务权限
    this.isHasAuthorize = permission.hasCreateTaskPermission();
  }

  @autobind
  handlePreviousStep() {
    const { storedCreateTaskData,
      storedCreateTaskData: { taskFormData },
      saveCreateTaskData } = this.props;
    const { current } = this.state;
    saveCreateTaskData({
      ...storedCreateTaskData,
      current: current - 1,
    });
    this.setState({
      current: current - 1,
      previousData: taskFormData,
    });
  }

  @autobind
  handleCustSource(value) {
    let custSources = '';
    switch (value) {
      case 'business':
        custSources = '业务目标客户';
        break;
      case 'search':
        custSources = '搜索目标客户';
        break;
      case 'tag':
        custSources = '标签目标客户池';
        break;
      case 'custIndicator':
        custSources = '绩效目标客户';
        break;
      case 'numOfCustOpened':
        custSources = '绩效目标客户';
        break;
      default:
        break;
    }
    return custSources;
  }


  @autobind
  handleNextStep() {
    this.createTaskForm.getWrappedInstance().validateFields((err, values) => {
      let isFormError = false;
      if (!_.isEmpty(err)) {
        isFormError = true;
      }
      this.saveFormContent({ ...values, isFormError });
    });
  }

  @autobind
  @validateFormContent
  saveFormContent(values) {
    const { current } = this.state;
    const { saveCreateTaskData, location: { query: { source, count } },
     storedCreateTaskData } = this.props;
    const custSource = this.handleCustSource(source);

    saveCreateTaskData({
      ...storedCreateTaskData,
      taskFormData: values,
      totalCust: count,
      // 记住当前在第二步
      current: current + 1,
      custSource,
    });
    this.setState({
      current: current + 1,
      custSource,
    });
  }

  // 自建任务提交
  @autobind
  handleSubmit() {
    const {
      storedCreateTaskData,
      createTask,
      parseQuery,
      orgId,
      storedCreateTaskData: { currentSelectRecord: { login: flowAuditorId = null } },
    } = this.props;
    const {
      custIdList,
      custCondition,
    } = parseQuery();
    const params = storedCreateTaskData.taskFormData;
    const data = {
      executionType: params.executionType,
      serviceStrategySuggestion: params.serviceStrategySuggestion,
      taskName: params.taskName,
      taskType: params.taskType,
      templetDesc: toString(params.templetDesc),
      timelyIntervalValue: params.timelyIntervalValue,
    };
    createTask({
      ...data,
      flowAuditorId,
      custIdList,
      searchReq: {
        ptyMngId: helper.getEmpId(),
        orgId,
        ...custCondition,
      },
    });
  }

  @autobind
  handleRowSelectionChange(selectedRowKeys) {
    const { saveCreateTaskData, storedCreateTaskData } = this.props;
    saveCreateTaskData({
      ...storedCreateTaskData,
      currentSelectRowKeys: selectedRowKeys,
    });
  }

  @autobind
  handleSingleRowSelectionChange(record) {
    const { login } = record;
    const { saveCreateTaskData, storedCreateTaskData } = this.props;
    saveCreateTaskData({
      ...storedCreateTaskData,
      currentSelectRecord: record,
      currentSelectRowKeys: [login],
    });
  }

  @autobind
  handleCancel() {
    const {
      push,
      location: {
        query: { fr },
      },
    } = this.props;
    push(decodeURIComponent(fr));
  }

  render() {
    const {
      current,
      previousData,
      currentTab,
      custSource,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
    } = this.state;

    const {
      dict,
      location,
      approvalList,
      getApprovalList,
      storedCreateTaskData,
      storedCreateTaskData: {
        currentSelectRecord = {},
        currentSelectRowKeys = [],
      },
      isApprovalListLoadingEnd,
      isShowApprovalModal,
      onCancel,
    } = this.props;
    const { executeTypes, custServerTypeFeedBackDict } = dict;
    const { query: { count } } = location;
    const steps = [{
      title: '基本信息',
      content: <CreateTaskForm
        location={location}
        dict={dict}
        ref={ref => this.createTaskForm = ref}
        previousData={previousData}
        isShowErrorInfo={isShowErrorInfo}
        isShowErrorExcuteType={isShowErrorExcuteType}
        isShowErrorTaskType={isShowErrorTaskType}
        custCount={Number(count)}
      />,
    }, {
      title: '目标客户',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
        storedData={storedCreateTaskData}
        approvalList={approvalList}
        currentTab={currentTab}
        getApprovalList={getApprovalList}
        executeTypes={executeTypes}
        taskTypes={custServerTypeFeedBackDict}
        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
        onRowSelectionChange={this.handleRowSelectionChange}
        currentSelectRecord={currentSelectRecord}
        currentSelectRowKeys={currentSelectRowKeys}
        isNeedApproval={this.isHasAuthorize}
        custSource={custSource}
        custTotal={count}
        isShowApprovalModal={isShowApprovalModal}
        isApprovalListLoadingEnd={isApprovalListLoadingEnd}
        onCancel={onCancel}
      />,
    }];

    const stepsCount = _.size(steps);
    return (
      <div className={styles.taskFlowContainer}>

        <div className={styles.stepsContent}>
          {steps[current].content}
        </div>
        <div className={styles.stepsAction}>
          {
            current === 0
            &&
            <Button
              className={styles.cancelBtn}
              type="default"
              onClick={this.handleCancel}
            >
              取消
            </Button>
          }
          {
            current > 0
            &&
            <Button
              className={styles.prevStepBtn}
              type="default"
              onClick={this.handlePreviousStep}
            >
              上一步
            </Button>
          }
          {
            current < stepsCount - 1
            &&
            <Button
              className={styles.handlePreviousStep}
              type="primary"
              onClick={this.handleNextStep}
            >下一步</Button>
          }
          {
            current === stepsCount - 1
            &&
            <Button
              className={styles.confirmBtn}
              type="primary"
              onClick={this.handleSubmit}
            >确认无误，提交</Button>
          }
        </div>
      </div>
    );
  }
}
