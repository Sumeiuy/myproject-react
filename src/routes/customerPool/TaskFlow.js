import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { Steps, message, Button, Mention } from 'antd';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import { permission, fspGlobal } from '../../utils';
import PickTargetCustomer from '../../components/customerPool/taskFlow/PickTargetCustomer';
import TaskPreview from '../../components/customerPool/taskFlow/TaskPreview';
import CreateTaskForm from '../../components/customerPool/createTask/CreateTaskForm';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
// import Button from '../../components/common/Button';
import styles from './taskFlow.less';

const Step = Steps.Step;
const { toString } = Mention;

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const effects = {
  // 预览客户细分数据
  priviewCustFile: 'customerPool/priviewCustFile',
  getLabelInfo: 'customerPool/getLabelInfo',
  getLabelPeople: 'customerPool/getLabelPeople',
  submitTaskFlow: 'customerPool/submitTaskFlow',
  getApprovalList: 'customerPool/getApprovalList',
};

const fetchData = (type, loading) => query => ({
  type,
  payload: query || EMPTY_OBJECT,
  loading,
});

const mapStateToProps = state => ({
  // 字典信息
  dict: state.app.dict,
  // 客户细分导入数据
  priviewCustFileData: state.customerPool.priviewCustFileData,
  // 储存的数据
  storedTaskFlowData: state.customerPool.storedTaskFlowData,
  circlePeopleData: state.customerPool.circlePeopleData,
  peopleOfLabelData: state.customerPool.peopleOfLabelData,
  currentTab: state.customerPool.currentTab,
  approvalList: state.customerPool.approvalList,
  submitTaskFlowResult: state.customerPool.submitTaskFlowResult,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 存储任务流程数据
  saveTaskFlowData: query => ({
    type: 'customerPool/saveTaskFlowData',
    payload: query,
  }),
  // 保存选中的tab
  saveCurrentTab: query => ({
    type: 'customerPool/saveCurrentTab',
    payload: query,
  }),
  priviewCustFile: fetchData(effects.priviewCustFile, true),
  getLabelInfo: fetchData(effects.getLabelInfo, true),
  getLabelPeople: fetchData(effects.getLabelPeople, true),
  submitTaskFlow: fetchData(effects.submitTaskFlow, true),
  getApprovalList: fetchData(effects.getApprovalList, true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    priviewCustFile: PropTypes.func.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    dict: PropTypes.object,
    saveCurrentTab: PropTypes.func.isRequired,
    currentTab: PropTypes.string.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    saveTaskFlowData: PropTypes.func.isRequired,
    submitTaskFlow: PropTypes.func.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    submitTaskFlowResult: PropTypes.string.isRequired,
  };

  static defaultProps = {
    dict: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      currentSelectRecord: {},
      currentSelectRowKeys: [],
      isSuccess: false,
    };
    // 首页指标查询权限
    this.isHasAuthorize = permission.hasIndexViewPermission();
  }

  componentWillReceiveProps(nextProps) {
    const { submitTaskFlowResult } = this.props;
    const { submitTaskFlowResult: nextResult } = nextProps;
    if (nextResult !== submitTaskFlowResult) {
      this.setState({
        isSuccess: true,
      });
    }
  }

  @autobind
  handleNextStep() {
    // 下一步
    const { saveTaskFlowData, storedTaskFlowData = EMPTY_OBJECT } = this.props;
    const { current } = this.state;

    let taskFormData = storedTaskFlowData.taskFormData;
    let pickTargetCustomerData = {};
    let isFormValidate = !_.isEmpty(taskFormData);
    let isSelectCust = true;
    if (current === 0) {
      this.createTaskFormRef.validateFields((err, values) => {
        if (!err) {
          isFormValidate = true;
          console.log('Received values of form: ', values);
          taskFormData = this.createTaskFormRef.getFieldsValue();
        } else {
          message.error('请填写任务基本信息');
        }
      });
    } else if (current === 1) {
      pickTargetCustomerData = this.pickTargetCustomerRef.getData();
      const { labelCust: { labelId }, custSegment: { uploadedFileKey } } = pickTargetCustomerData;
      if (_.isEmpty(labelId) && _.isEmpty(uploadedFileKey)) {
        isSelectCust = false;
        message.error('请选择导入客户或者标签圈人');
      }
    }

    if (isFormValidate && isSelectCust) {
      saveTaskFlowData({
        ...storedTaskFlowData,
        taskFormData,
        ...pickTargetCustomerData,
      });
      this.setState({
        current: current + 1,
      });
    }
  }


  @autobind
  handlePreviousStep() {
    const { current } = this.state;
    // 上一步
    this.setState({
      current: current - 1,
    });
  }


  @autobind
  handlePreview({ uploadKey, pageNum, pageSize }) {
    console.log(uploadKey);
    if (!uploadKey) {
      message.error('请先上传文件');
      return;
    }
    const { priviewCustFile } = this.props;
    // 预览数据
    priviewCustFile({
      filename: uploadKey,
      pageNum,
      pageSize,
    });
  }

  @autobind
  handleSubmitTaskFlow() {
    const { submitTaskFlow, storedTaskFlowData, currentTab = '1' } = this.props;

    const { currentSelectRecord: { login: flowAuditorId = null } } = this.state;

    const {
      taskFormData = EMPTY_OBJECT,
      labelCust = EMPTY_OBJECT,
      custSegment = EMPTY_OBJECT,
    } = storedTaskFlowData;

    let finalData = {};
    finalData = {
      ...taskFormData,
      ...labelCust,
      ...custSegment,
    };

    const {
      labelId,
      customNum: labelCustNums,
      uploadedFileKey: fileId,
      closingDate,
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc,
      triggerDate,
    } = finalData;

    let postBody = {
      closingDate: moment(closingDate).format('YYYY-MM-DD'),
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc: toString(templetDesc),
      triggerDate: moment(triggerDate).format('YYYY-MM-DD'),
    };

    if (this.isHasAuthorize) {
      postBody = {
        ...postBody,
        flowAuditorId,
      };
    }

    if (currentTab === '1') {
      submitTaskFlow({
        fileId,
        ...postBody,
      });
    } else {
      submitTaskFlow({
        labelId,
        labelCustNums,
        ...postBody,
      });
    }

    // 成功之后再clear
    // clearTaskFlowData();
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
  /**
   * 关闭当前tab页
   */
  handleCloseTab() {
    fspGlobal.closeRctTabById('RCT_FSP_TASK_FLOW');
  }

  render() {
    const {
      current,
      currentSelectRecord,
      currentSelectRowKeys,
      isSuccess,
    } = this.state;

    const {
      dict,
      dict: { executeTypes, taskTypes },
      priviewCustFileData,
      currentTab,
      saveCurrentTab,
      storedTaskFlowData,
      getLabelInfo,
      getLabelPeople,
      peopleOfLabelData,
      circlePeopleData,
      approvalList,
      getApprovalList,
      push,
    } = this.props;

    const { taskFormData = EMPTY_OBJECT } = storedTaskFlowData;

    const steps = [{
      title: '基本信息',
      content: <div className={styles.taskInner}>
        <CreateTaskForm
          ref={ref => (this.createTaskFormRef = ref)}
          dict={dict}
          location={location}
          previousData={{ ...taskFormData }}
        />
      </div>,
    }, {
      title: '目标客户',
      content: <PickTargetCustomer
        ref={ref => (this.pickTargetCustomerRef = ref)}
        currentTab={currentTab}
        saveCurrentTab={saveCurrentTab}
        onPreview={this.handlePreview}
        priviewCustFileData={priviewCustFileData}
        storedTaskFlowData={storedTaskFlowData}
        getLabelInfo={getLabelInfo}
        circlePeopleData={circlePeopleData}
        getLabelPeople={getLabelPeople}
        peopleOfLabelData={peopleOfLabelData}
      />,
    }, {
      title: '提交',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
        storedTaskFlowData={storedTaskFlowData}
        approvalList={approvalList}
        currentTab={currentTab}
        getApprovalList={getApprovalList}
        executeTypes={executeTypes}
        taskTypes={taskTypes}
        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
        onRowSelectionChange={this.handleRowSelectionChange}
        currentSelectRecord={currentSelectRecord}
        currentSelectRowKeys={currentSelectRowKeys}
        isNeedApproval={this.isHasAuthorize}
      />,
    }];

    const stepsCount = _.size(steps);
    return (
      <div className={styles.taskFlowContainer}>
        <Steps current={current} className={styles.stepsSection}>
          {_.map(steps, item => <Step key={item.title} title={item.title} />)}
        </Steps>
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
              onClick={this.handleCloseTab}
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
              className={styles.nextStepBtn}
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
              onClick={this.handleSubmitTaskFlow}
            >确认无误，提交</Button>
          }
        </div>
        {
          isSuccess ?
            <CreateTaskSuccess
              successType={isSuccess}
              push={push}
              onCloseTab={this.handleCloseTab}
            /> : null
        }
      </div>
    );
  }
}
