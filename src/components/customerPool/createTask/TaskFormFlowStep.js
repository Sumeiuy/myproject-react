import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'dva/router';
import { Button, Mention } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import CreateTaskForm from './CreateTaskForm';
import TaskPreview from '../taskFlow/TaskPreview';
import { helper, permission } from '../../../utils';
import { validateFormContent } from '../../../decorators/validateFormContent';
import styles from './taskFormFlowStep.less';

const { toString } = Mention;

@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    storedTaskFlowData: PropTypes.object,
    dict: PropTypes.object,
    saveTaskFlowData: PropTypes.func.isRequired,
    createTask: PropTypes.func.isRequired,
    parseQuery: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    orgId: PropTypes.string,
  };

  static defaultProps = {
    dict: {},
    storedTaskFlowData: {},
    orgId: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      currentStep: 0,
      previousData: {},
      currentSelectRecord: {},
      currentSelectRowKeys: [],
      currentTab: '1',
      custSource: '',
      isShowErrorInfo: false,
      isShowErrorExcuteType: false,
      isShowErrorTaskType: false,
    };
    this.isHasAuthorize = permission.hasIndexViewPermission();
    // this.isHasAuthorize = true;
  }

  @autobind
  handlePreviousStep() {
    const { storedTaskFlowData } = this.props;
    const { current } = this.state;
    this.setState({
      current: current - 1,
      previousData: storedTaskFlowData.taskFormData,
    });
    console.log(storedTaskFlowData.taskFormData);
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
      this.submitFormContent({ ...values, isFormError });
    });
  }

  @autobind
  @validateFormContent
  submitFormContent(values) {
    const { current } = this.state;
    const { saveTaskFlowData, location: { query } } = this.props;
    saveTaskFlowData({
      taskFormData: values,
      totalCust: query.count,
    });
    this.setState({
      current: current + 1,
      custSource: this.handleCustSource(query.source),
    });
  }

  // 自建任务提交
  @autobind
  handleSubmit() {
    const { storedTaskFlowData, createTask, parseQuery, orgId } = this.props;
    const { currentSelectRecord: { login: flowAuditorId = null } } = this.state;
    const {
      custIdList,
      custCondition,
    } = parseQuery();
    const {
      curPageNum,
      enterType,
      pageSize,
      sortsReqList,
    } = custCondition;
    const params = storedTaskFlowData.taskFormData;
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
        curPageNum,
        enterType,
        pageSize,
        sortsReqList,
        ptyMngId: helper.getEmpId(),
        orgId,
      },
    });
  }

  @autobind
  handleRowSelectionChange(selectedRowKeys, selectedRows) {
    console.log(selectedRowKeys, selectedRows);
    this.setState({
      currentSelectRowKeys: selectedRowKeys,
    });
  }

  @autobind
  handleSingleRowSelectionChange(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
    const { login } = record;
    this.setState({
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
      currentSelectRecord,
      currentSelectRowKeys,
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
      storedTaskFlowData,
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
      />,
    }, {
      title: '目标客户',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
        storedTaskFlowData={storedTaskFlowData}
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
