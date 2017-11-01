import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'dva/router';
import { Button, Mention, message } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import CreateTaskForm from './CreateTaskForm';
import TaskPreview from '../taskFlow/TaskPreview';
import { helper, permission } from '../../../utils';
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
    goBack: PropTypes.func.isRequired,
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
    const { current } = this.state;
    const { saveTaskFlowData, location: { query } } = this.props;
    let isShowErrorInfo = false;
    this.createTaskForm.validateFields((err, values) => {
      const { templetDesc } = values;
      if (toString(templetDesc).length < 10) {
        isShowErrorInfo = true;
        this.setState({
          isShowErrorInfo: true,
        });
      }
      if (!err && !isShowErrorInfo) {
        saveTaskFlowData({
          taskFormData: values,
          totalCust: query.count,
        });
        this.setState({
          current: current + 1,
          custSource: this.handleCustSource(query.source),
        });
      } else {
        console.warn('templetDesc-----', values.templetDesc);
        message.error('请填写任务基本信息');
      }
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
      timelyIntervalue: params.timelyIntervalValue,
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

  render() {
    const {
      current,
      previousData,
      currentSelectRecord,
      currentSelectRowKeys,
      currentTab,
      custSource,
      isShowErrorInfo,
    } = this.state;

    const {
      dict,
      location,
      approvalList,
      getApprovalList,
      storedTaskFlowData,
      goBack,
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
              onClick={goBack}
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
