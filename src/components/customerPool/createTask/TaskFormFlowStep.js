/**
 * @Date: 2017-11-10 15:13:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-22 14:06:15
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, message, Steps } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import CreateTaskForm from './CreateTaskForm';
import TaskPreview from '../taskFlow/TaskPreview';
import { permission } from '../../../utils';
import Clickable from '../../../components/common/Clickable';
import { validateFormContent } from '../../../decorators/validateFormContent';
import ResultTrack from '../../../components/common/resultTrack/ConnectedComponent';
import MissionInvestigation from '../../../components/common/missionInvestigation/ConnectedComponent';
import styles from './taskFormFlowStep.less';

const noop = _.noop;
const Step = Steps.Step;

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
    // 新增
    templateId: PropTypes.number.isRequired,
    generateTemplateId: PropTypes.func.isRequired,
    onCloseTab: PropTypes.func.isRequired,
    creator: PropTypes.string.isRequired,
    submitApproval: PropTypes.func,
    submitSuccess: PropTypes.bool,
    getApprovalBtn: PropTypes.func,
    approvalBtn: PropTypes.object,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
  };

  static defaultProps = {
    dict: {},
    storedCreateTaskData: {},
    orgId: null,
    submitSuccess: false,
    submitApproval: noop,
    approvalBtn: {},
    getApprovalBtn: noop,
  };

  constructor(props) {
    super(props);
    const {
      storedCreateTaskData: { taskFormData, current, custSource },
    } = props;

    this.state = {
      current: current || 0,
      previousData: taskFormData || {},
      custSource: custSource || '',
      isShowErrorInfo: false,
      isShowErrorExcuteType: false,
      isShowErrorTaskType: false,
      isShowErrorTaskSubType: false,
      isShowErrorIntervalValue: false,
      isShowErrorStrategySuggestion: false,
      isShowErrorTaskName: false,
      // 测试用
      isNeedApproval: permission.hasTkMampPermission(),
      // 测试用
      isCanGoNextStep: true,
      // 测试用
      isNeedMissionInvestigation: permission.hasTkMampPermission(),
    };
  }

  componentDidMount() {
    this.props.isSendCustsServedByPostn().then(() => {
      const { sendCustsServedByPostnResult } = this.props;
      const {
        isNeedApproval,
        isCanGoNextStep,
        isNeedMissionInvestigation,
        isIncludeNotMineCust,
      } = permission.judgeCreateTaskApproval({ ...sendCustsServedByPostnResult });
      if (isIncludeNotMineCust && !isCanGoNextStep) {
        message.error('客户包含非本人名下客户，请重新选择');
        return;
      }

      this.setState({
        isNeedApproval,
        isCanGoNextStep,
        isNeedMissionInvestigation,
      });
    });
  }

  @autobind
  handlePreviousStep() {
    const { storedCreateTaskData,
      storedCreateTaskData: { taskFormData, resultTrackData, missionInvestigationData },
      saveCreateTaskData } = this.props;
    const { current } = this.state;
    saveCreateTaskData({
      ...storedCreateTaskData,
      current: current - 1,
    });

    let previousData = {};
    if (current === 2) {
      previousData = {
        missionInvestigationData,
        resultTrackData,
      };
    } else if (current === 1) {
      previousData = {
        ...taskFormData,
      };
    }

    this.setState({
      current: current - 1,
      previousData,
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
      case 'custGroupList':
        custSources = '客户分组';
        break;
      default:
        break;
    }
    return custSources;
  }


  @autobind
  handleNextStep() {
    const { current } = this.state;
    // 下一步
    const {
      saveCreateTaskData,
      storedCreateTaskData = {},
      generateTemplateId,
      // source是来源
      // count是客户数量
      location: { query: { source, count } },
    } = this.props;

    const {
      isNeedMissionInvestigation,
      isCanGoNextStep,
    } = this.state;

    let isResultTrackValidate = true;
    let isMissionInvestigationValidate = true;
    let isFormValidate = true;
    let resultTrackData = storedCreateTaskData.resultTrackData || {};
    let missionInvestigationData = storedCreateTaskData.missionInvestigationData || {};
    let taskFormData = storedCreateTaskData.taskFormData || {};
    // 客户来源
    const custSource = this.handleCustSource(source);

    if (current === 0) {
      // 拿到form表单component
      const formComponent = this.createTaskForm;
      // 拿到被HOC包裹的组件
      const wrappedComponent = formComponent.taskFormInfoRef;
      // 表单form
      const { form: taskForm } = wrappedComponent.props;

      // 当前是第一步,校验表单信息
      taskForm.validateFields((err, values) => {
        let isFormError = false;
        if (!_.isEmpty(err)) {
          isFormError = true;
          isFormValidate = false;
        }
        const formDataValidation = this.saveFormContent({ ...values, isFormError });
        if (formDataValidation) {
          taskFormData = {
            ...taskFormData,
            ...taskForm.getFieldsValue(),
          };
          isFormValidate = true;
        } else {
          isFormValidate = false;
        }
      });
      // 校验任务提示
      const templetDesc = formComponent.getData();
      taskFormData = { ...taskFormData, templetDesc };
      if (_.isEmpty(templetDesc) || templetDesc.length < 10 || templetDesc.length > 314) {
        isFormValidate = false;
        this.setState({
          isShowErrorInfo: true,
        });
      } else {
        this.setState({
          isShowErrorInfo: false,
        });
      }
    } else if (current === 1) {
      const resultTrackComponent = this.resultTrackRef;
      // 当前是第二步，校验结果跟踪和任务调查数据
      resultTrackData = {
        ...resultTrackData,
        ...resultTrackComponent.getData(),
      };
      const {
        // 跟踪窗口期
        // trackWindowDate,
        // 一级指标
        indicatorLevel1Key,
        // 二级指标
        indicatorLevel2Key,
        // 操作符key,传给后台,譬如>=/<=
        // operationKey,
        // 操作符name,展示用到，譬如达到/降到
        // operationValue,
        // 当前输入的指标值
        inputIndicator,
        // 单位
        // unit,
        // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
        // hasState,
        // 是否有产品搜索
        hasSearchedProduct,
        // 是否选中
        isResultTrackChecked,
        // 是否有输入情况
        hasState,
        currentSelectedProduct,
      } = resultTrackData;
      // if (!isResultTrackChecked) {
      //   message.error('请勾选结果跟踪');
      // } else
      if (isResultTrackChecked) {
        let errMsg = '';
        if (_.isEmpty(indicatorLevel1Key)) {
          errMsg = '请选择一级指标';
        } else if (_.isEmpty(indicatorLevel2Key)) {
          errMsg = '请选择二级指标';
        } else if (hasSearchedProduct && _.isEmpty(currentSelectedProduct)) {
          errMsg = '请选择一个产品';
        } else if (!hasState && !inputIndicator) {
          errMsg = '请输入指标目标值';
        }

        if (_.isEmpty(errMsg)) {
          isResultTrackValidate = true;
        } else {
          message.error(errMsg);
          isResultTrackValidate = false;
        }
      } else {
        isResultTrackValidate = true;
      }

      // 拥有任务调查权限，才能展示任务调查
      if (isNeedMissionInvestigation) {
        const missionInvestigationComponent = this.missionInvestigationRef;
        missionInvestigationData = {
          ...missionInvestigationData,
          ...missionInvestigationComponent.getData(),
        };
        const {
          // 是否选中
          isMissionInvestigationChecked,
          // 选择的问题idList
          questionList = [],
        } = missionInvestigationData;
        if (isMissionInvestigationChecked) {
          if (_.isEmpty(questionList)) {
            message.error('请至少选择一个问题');
            isMissionInvestigationValidate = false;
          } else {
            isMissionInvestigationValidate = true;
            const quesIds = _.map(questionList, item => item.quesId);
            // 生成问题模板Id
            generateTemplateId({
              quesIds,
            });
          }
        } else {
          isMissionInvestigationValidate = true;
        }
      }
    }

    if (isFormValidate && isMissionInvestigationValidate && isResultTrackValidate) {
      saveCreateTaskData({
        ...storedCreateTaskData,
        taskFormData,
        resultTrackData,
        missionInvestigationData,
        current: current + 1,
        custSource,
        custTotal: count,
      });
      // 只有能够下一步，再update
      if (isCanGoNextStep) {
        this.setState({
          current: current + 1,
          custSource,
        });
      }
    }
  }

  @autobind
  @validateFormContent
  saveFormContent(values) {
    console.log(values);
  }

  // 自建任务提交
  @autobind
  handleSubmit() {
    const {
      storedCreateTaskData,
      createTask,
      parseQuery,
      storedCreateTaskData: { currentSelectRecord = {} },
      templateId,
      location: { query: { groupId, enterType, source } },
    } = this.props;

    const {
      isNeedApproval,
      isNeedMissionInvestigation,
    } = this.state;

    const { login: flowAuditorId = null } = currentSelectRecord || {};
    const {
      custIdList,
      custCondition,
      custCondition: { entrance },
    } = parseQuery();

    let req = {};
    if (entrance === 'managerView') {
      req = { queryMissionCustsReq: _.omit(custCondition, 'entrance') };
    } else if (source === 'custGroupList') {
      req = {
        enterType,
        groupId,
      };
    } else {
      req = { searchReq: custCondition, custIdList };
    }

    const {
      taskFormData = {},
      resultTrackData,
      missionInvestigationData,
    } = storedCreateTaskData;

    let finalData = {};
    finalData = {
      ...taskFormData,
      ...resultTrackData,
      ...missionInvestigationData,
    };

    const {
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      // taskSubType,
      templetDesc,
      timelyIntervalValue,
      // 跟踪窗口期
      trackWindowDate,
      // 一级指标
      indicatorLevel1Key,
      // 二级指标
      indicatorLevel2Key,
      // 产品编号
      currentSelectedProduct,
      // 操作符key,传给后台,譬如>=/<=
      operationKey,
      // 操作符name,展示用到，譬如达到/降到
      // operationValue,
      // 当前输入的指标值
      inputIndicator,
      // 单位
      unit,
      // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
      hasState,
      // 是否有产品搜索
      hasSearchedProduct,
      // 是否选中
      isResultTrackChecked,
      // 是否选中
      isMissionInvestigationChecked,
      // 选择的问题List
      // questionList,
    } = finalData;

    let postBody = {
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc,
      timelyIntervalValue,
      // // 任务子类型
      // taskSubType,
      ...req,
    };

    if (isNeedApproval) {
      postBody = {
        ...postBody,
        flowAuditorId,
      };
    }

    if (isResultTrackChecked) {
      postBody = {
        ...postBody,
        resultTraceReq: {
          traceOp: operationKey || '',
          traceTime: trackWindowDate,
          indexId: indicatorLevel1Key,
          indexCateId: indicatorLevel2Key,
        },
      };
      if (hasSearchedProduct) {
        postBody = _.merge(postBody, {
          resultTraceReq: {
            financialProductId: currentSelectedProduct.name,
          },
        });
      }
      if (!hasState) {
        postBody = _.merge(postBody, {
          resultTraceReq: {
            indexUnit: unit,
            value: inputIndicator,
          },
        });
      }
    }

    if (isNeedMissionInvestigation && isMissionInvestigationChecked) {
      postBody = {
        ...postBody,
        // 模板Id
        missionSurveyReq: {
          templateId,
        },
      };
    }

    // 调用接口，创建任务
    createTask({
      ...postBody,
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
    // 关闭当前tab
    this.props.onCloseTab();
  }

  // 获取审批流程按钮
  @autobind
  handleStopFlow() {
    const { getApprovalBtn, location: { query: { flowId } } } = this.props;
    getApprovalBtn({
      flowId,
    }).then(this.handleApporval);
  }

  // 根据审批流程按钮返回的信息提交新的审批动作
  @autobind
  handleApporval() {
    // const { submitApproval, approvalBtn } = this.props;
    // const param = {
    //   SystemCode: systemCode,
    //   empId: empId,
    //   flowId: flowId,
    //   routeId: routeId,
    //   recGenUserId: empId, //当前登录人
    //   approvalIds: loginId,
    //   suggestion: approverIdea,
    //   nextGroupId: nextGroupId,
    //   btnName: btnName,
    //   btnId: flowBtnId.toString(),
    //   flowClass: flowClass,
    // }
  }


  render() {
    const {
      current,
      previousData,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorTaskSubType,
      isNeedApproval,
      isNeedMissionInvestigation,
      isCanGoNextStep,
      isShowErrorIntervalValue,
      isShowErrorStrategySuggestion,
      isShowErrorTaskName,
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
      location: { query: { missionType, source, flowData } },
      creator,
    } = this.props;
    const baseInfo = JSON.parse(decodeURIComponent(flowData));
    const { executeTypes, motCustfeedBackDict } = dict;
    const { query: { count } } = location;

    const steps = [{
      title: '基本信息',
      content: <CreateTaskForm
        location={location}
        dict={dict}
        wrappedComponentRef={inst => (this.createTaskForm = inst)}
        previousData={previousData}
        isShowErrorInfo={isShowErrorInfo}
        isShowErrorExcuteType={isShowErrorExcuteType}
        isShowErrorTaskType={isShowErrorTaskType}
        isShowErrorTaskSubType={isShowErrorTaskSubType}
        isShowErrorIntervalValue={isShowErrorIntervalValue}
        isShowErrorStrategySuggestion={isShowErrorStrategySuggestion}
        isShowErrorTaskName={isShowErrorTaskName}
        custCount={Number(count)}
        missionType={missionType}
        baseInfo={baseInfo}
      />,
    }, {
      title: '结果跟踪&任务调查',
      content: <div>
        <ResultTrack
          wrappedComponentRef={ref => (this.resultTrackRef = ref)}
          storedData={storedCreateTaskData}
        />
        {
          isNeedMissionInvestigation ?
            <MissionInvestigation
              wrappedComponentRef={ref => (this.missionInvestigationRef = ref)}
              storedData={storedCreateTaskData}
            /> :
            null
        }
      </div>,
    }, {
      title: '确认&提交',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
        storedData={storedCreateTaskData}
        approvalList={approvalList}
        getApprovalList={getApprovalList}
        executeTypes={executeTypes}
        taskTypes={motCustfeedBackDict}
        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
        onRowSelectionChange={this.handleRowSelectionChange}
        currentSelectRecord={currentSelectRecord}
        currentSelectRowKeys={currentSelectRowKeys}
        isNeedApproval={isNeedApproval}
        isShowApprovalModal={isShowApprovalModal}
        isApprovalListLoadingEnd={isApprovalListLoadingEnd}
        onCancel={onCancel}
        creator={creator}
      />,
    }];

    const cancleBtn = source === 'returnTask' ?
      (<Button className={styles.cancelBtn} type="default">
        终止
      </Button>) :
      (<Button className={styles.cancelBtn} type="default">
        取消
      </Button>);
    // 根据来源判断按钮类型
    const stopBtn = source === 'returnTask' ?
      (<Button className={styles.cancelBtn} type="default" onClick={this.handleStopFlow}>
        终止
      </Button>) : null;
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
            <Clickable
              onClick={this.handleCancel}
              eventName="/click/taskFormFlowStep/cancel"
            >
              {cancleBtn}
            </Clickable>
          }
          {
            current > 0
            &&
            <div>
              <Clickable
                onClick={this.handlePreviousStep}
                eventName="/click/taskFormFlowStep/lastStep"
              >
                {stopBtn}
              </Clickable>
              <Clickable
                onClick={this.handlePreviousStep}
                eventName="/click/taskFormFlowStep/lastStep"
              >
                {stopBtn}
                <Button className={styles.prevStepBtn} type="default">
                  上一步
              </Button>
              </Clickable>
            </div>
          }
          {
            current < stepsCount - 1
            &&
            <Clickable
              onClick={this.handleNextStep}
              eventName="/click/taskFormFlowStep/nextStep"
            >
              <Button className={styles.handlePreviousStep} type="primary" disabled={!isCanGoNextStep}>
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
