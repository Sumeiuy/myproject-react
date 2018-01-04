/**
 * @Date: 2017-11-10 15:13:41
 * @Last Modified by: zhushengnan
 * @Last Modified time: 2018-01-04 16:01:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Mention } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import CreateTaskForm from './CreateTaskForm';
import TaskPreview from '../taskFlow/TaskPreview';
import { permission } from '../../../utils';
import Clickable from '../../../components/common/Clickable';
import { validateFormContent } from '../../../decorators/validateFormContent';
// import withRouter from '../../../decorators/withRouter';
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
      case 'managerView':
        custSources = '任务实施细分客户';
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
      storedCreateTaskData: { currentSelectRecord = {} },
    } = this.props;
    const { login: flowAuditorId = null } = currentSelectRecord || {};
    const {
      custIdList,
      custCondition,
      custCondition: { entrance },
    } = parseQuery();
    const params = storedCreateTaskData.taskFormData || {};
    const data = {
      executionType: params.executionType,
      serviceStrategySuggestion: params.serviceStrategySuggestion,
      taskName: params.taskName,
      taskType: params.taskType,
      templetDesc: toString(params.templetDesc),
      timelyIntervalValue: params.timelyIntervalValue,
    };

    let req = {};
    if (entrance === 'managerView') {
      req = { queryMissionCustsReq: _.omit(custCondition, 'entrance') };
    } else {
      req = { searchReq: custCondition };
    }

    createTask({
      ...data,
      flowAuditorId,
      custIdList,
      ...req,
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
      location: { query: { missionType } },
    } = this.props;
    const { executeTypes, motCustfeedBackDict } = dict;
    const { query: { count } } = location;
    console.warn('count--->', count);
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
        missionType={missionType}
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
        taskTypes={motCustfeedBackDict}
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
            <Clickable
              onClick={this.handleCancel}
              eventName="/click/taskFormFlowStep/cancel"
            >
              <Button className={styles.cancelBtn} type="default">
                取消
              </Button>
            </Clickable>
          }
          {
            current > 0
            &&
            <Clickable
              onClick={this.handlePreviousStep}
              eventName="/click/taskFormFlowStep/lastStep"
            >
              <Button className={styles.prevStepBtn} type="default">
                上一步
              </Button>
            </Clickable>
          }
          {
            current < stepsCount - 1
            &&
            <Clickable
              onClick={this.handleNextStep}
              eventName="/click/taskFormFlowStep/nextStep"
            >
              <Button className={styles.handlePreviousStep} type="primary">
                下一步
              </Button>
            </Clickable>
          }
          {
            current === stepsCount - 1
            &&
            <Clickable
              onClick={this.handleSubmit}
              eventName="/click/taskFormFlowStep/submit"
            >
              <Button className={styles.confirmBtn} type="primary">
                确认无误，提交
              </Button>
            </Clickable>
          }
        </div>
      </div>
    );
  }
}
