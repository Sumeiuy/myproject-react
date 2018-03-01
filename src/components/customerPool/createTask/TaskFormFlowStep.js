/**
 * @Date: 2017-11-10 15:13:41
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-01 21:10:27
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, message, Steps } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import CreateTaskForm from './CreateTaskForm';
import TaskPreview from '../taskFlow/TaskPreview';
import { permission, emp, env as envHelper } from '../../../helper';
import Clickable from '../../../components/common/Clickable';
import { validateFormContent } from '../../../decorators/validateFormContent';
import ResultTrack from '../../../components/common/resultTrack/ConnectedComponent';
import MissionInvestigation from '../../../components/common/missionInvestigation/ConnectedComponent';
import styles from './taskFormFlowStep.less';

const noop = _.noop;
const Step = Steps.Step;
const systemCode = '102330';  // 系统代码（理财服务平台为102330）

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
    submitApporvalResult: PropTypes.object,
    getApprovalBtn: PropTypes.func,
    approvalBtn: PropTypes.object,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object,
  };

  static defaultProps = {
    dict: {},
    storedCreateTaskData: {},
    orgId: null,
    submitApporvalResult: {},
    submitApproval: noop,
    approvalBtn: {},
    getApprovalBtn: noop,
    taskBasicInfo: {},
  };

  constructor(props) {
    super(props);
    const {
      location: { query: { source, flowId } },
      storedCreateTaskData: {
        taskFormData,
        current,
        custSource,
        isDisabled,
        needApproval = false,
        canGoNextStep = false,
        needMissionInvestigation = false,
     },
    } = props;

    // 代表是否是来自驳回修改
    const isEntryFromReturnTask = source === 'returnTask';
    let canGoNextStepFlow = canGoNextStep;
    let newNeedMissionInvestigation = needMissionInvestigation;
    if (!_.isEmpty(flowId)) {
      canGoNextStepFlow = !!((canGoNextStep || !isDisabled));
      newNeedMissionInvestigation = true;
    }

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
      needApproval: !!((needApproval || isEntryFromReturnTask)),
      canGoNextStep: canGoNextStepFlow,
      needMissionInvestigation: newNeedMissionInvestigation,
      isDisabled,
    };
  }

  componentDidMount() {
    const {
      location: { query: { source } },
      saveCreateTaskData,
      storedCreateTaskData,
   } = this.props;
    const postBody = {
      ...this.parseParam(),
      postnId: emp.getPstnId(),
    };

    if (source !== 'returnTask') {
      this.props.isSendCustsServedByPostn({
        ...postBody,
      }).then(() => {
        const { sendCustsServedByPostnResult } = this.props;
        if (_.isEmpty(sendCustsServedByPostnResult)) {
          return;
        }
        const {
          needApproval,
          canGoNextStep,
          needMissionInvestigation,
          isIncludeNotMineCust,
        } = permission.judgeCreateTaskApproval({ ...sendCustsServedByPostnResult });
        this.setState({
          needApproval,
          canGoNextStep,
          needMissionInvestigation,
        });

        saveCreateTaskData({
          ...storedCreateTaskData,
          needApproval,
          canGoNextStep,
          needMissionInvestigation,
          isIncludeNotMineCust,
        });
        if (isIncludeNotMineCust && !canGoNextStep) {
          message.error('客户包含非本人名下客户，请重新选择');
        }
      });
    }
  }

  @autobind
  parseParam() {
    const {
      parseQuery,
      location: { query: { groupId, enterType, source } },
    } = this.props;

    const {
      custIdList,
      custCondition,
      custCondition: { entrance, queryLabelReq },
    } = parseQuery();

    let req = {};
    if (entrance === 'managerView') {
      req = { queryMissionCustsReq: _.omit(custCondition, 'entrance') };
    } else if (source === 'custGroupList') {
      req = {
        enterType,
        groupId,
      };
    } else if (source === 'sightingTelescope') {
      // 从瞄准镜过来的，需要加入queryLabelReq参数
      req = { searchReq: custCondition, custIdList, queryLabelReq };
    } else {
      req = { searchReq: custCondition, custIdList };
    }

    return req;
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
      case 'association':
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
        custSources = '已有任务下钻客户';
        break;
      case 'custGroupList':
        custSources = '客户分组';
        break;
      case 'sightingTelescope':
        custSources = '标签圈人';
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
      taskBasicInfo,
    } = this.props;

    const { tagetCustModel } = taskBasicInfo || {};
    const { custNum, custSource: taskSource } = tagetCustModel || {};

    const {
      needMissionInvestigation,
      canGoNextStep,
    } = this.state;

    let isResultTrackValidate = true;
    let isMissionInvestigationValidate = true;
    let isFormValidate = true;
    let resultTrackData = storedCreateTaskData.resultTrackData || {};
    let missionInvestigationData = storedCreateTaskData.missionInvestigationData || {};
    let taskFormData = storedCreateTaskData.taskFormData || {};
    // 客户来源
    const custSource = this.handleCustSource(source) || taskSource;

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
      if (_.isEmpty(templetDesc) || templetDesc.length < 10 || templetDesc.length > 1000) {
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
          errMsg = '请设置结果跟踪任务指标';
        } else if (_.isEmpty(indicatorLevel2Key)) {
          errMsg = '请设置结果跟踪任务二级指标';
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
      if (needMissionInvestigation) {
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
          currentSelectedQuestionIdList,
          addedQuestionSize,
        } = missionInvestigationData;
        const originQuestionSize = _.size(currentSelectedQuestionIdList);
        const uniqQuestionSize = _.size(_.uniqBy(currentSelectedQuestionIdList, 'value'));
        if (isMissionInvestigationChecked) {
          if (_.isEmpty(questionList)) {
            message.error('请至少选择一个问题');
            isMissionInvestigationValidate = false;
          } else if (originQuestionSize !== uniqQuestionSize) {
            // 查找是否有相同的question被选择
            message.error('问题选择重复');
            isMissionInvestigationValidate = false;
          } else if (addedQuestionSize !== originQuestionSize) {
            // 新增了问题，但是没选择
            message.error('请选择问题');
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
        custTotal: count || custNum,
      });
      // 只有能够下一步，再update
      if (canGoNextStep) {
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
      storedCreateTaskData: { currentSelectRecord = {} },
      templateId,
      location: { query: { flowId } },
      taskBasicInfo,
    } = this.props;
    const {
      needApproval,
      needMissionInvestigation,
    } = this.state;

    // 获取重新提交任务参数( flowId, eventId );
    const { motDetailModel = {} } = taskBasicInfo;
    const { eventId } = motDetailModel || {};
    const flowParam = { flowId, eventId };

    const { login: flowAuditorId = null } = currentSelectRecord || {};

    if (_.isEmpty(flowAuditorId) && needApproval) {
      message.error('任务需要审批，请选择审批人');
      return;
    }

    const req = this.parseParam();

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

    if (needApproval) {
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

    if (needMissionInvestigation && isMissionInvestigationChecked) {
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
      ...flowParam,
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
    const { submitApproval, approvalBtn, location: { query: { flowId } } } = this.props;
    const dataParam = _.find(approvalBtn.flowButtons, ['btnName', '终止']);
    const param = {
      SystemCode: systemCode,
      empId: emp.getId(),
      flowId,
      routeId: dataParam.operate,
      recGenUserId: emp.getId(),
      approvalIds: [dataParam.flowAuditors[0].login],
      suggestion: '',
      nextGroupId: dataParam.nextGroupName,
      btnName: dataParam.btnName,
      btnId: dataParam.flowBtnId.toString(),
      flowClass: dataParam.flowClass,
    };
    submitApproval(param).then(this.handleSubmitSuccess);
  }

  @autobind
  handleSubmitSuccess() {
    const { submitApporvalResult, saveCreateTaskData, storedCreateTaskData } = this.props;
    if (submitApporvalResult.code === '0') {
      message.success('提交成功');
      this.setState({
        isDisabled: true,
        canGoNextStep: false,
      });
      saveCreateTaskData({
        ...storedCreateTaskData,
        isDisabled: true,
      });
    }
  }

  render() {
    const {
      current,
      previousData,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorTaskSubType,
      needApproval,
      needMissionInvestigation,
      canGoNextStep,
      isShowErrorIntervalValue,
      isShowErrorStrategySuggestion,
      isShowErrorTaskName,
      isDisabled,
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
      location: { query: { missionType, source } },
      creator,
      taskBasicInfo,
    } = this.props;
    // motCustfeedBackDict改成新的字典missionType
    const { executeTypes, missionType: missionTypeDict } = dict;
    const { query: { count } } = location;
    const { tagetCustModel = {} } = taskBasicInfo;
    const { custNum } = tagetCustModel;

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
        custCount={Number(count) || custNum}
        missionType={missionType}
        taskBasicInfo={taskBasicInfo}
      />,
    }, {
      title: '结果跟踪&任务调查',
      content: <div>
        <ResultTrack
          wrappedComponentRef={ref => (this.resultTrackRef = ref)}
          needApproval={needApproval}
          storedData={storedCreateTaskData}
        />
        {
          needMissionInvestigation ?
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
        taskTypes={missionTypeDict}
        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
        onRowSelectionChange={this.handleRowSelectionChange}
        currentSelectRecord={currentSelectRecord}
        currentSelectRowKeys={currentSelectRowKeys}
        needApproval={needApproval}
        isShowApprovalModal={isShowApprovalModal}
        isApprovalListLoadingEnd={isApprovalListLoadingEnd}
        onCancel={onCancel}
        creator={creator}
      />,
    }];

    const cancleBtn = source === 'returnTask' ?
      (<Clickable
        onClick={this.handleStopFlow}
        eventName="/click/taskFormFlowStep/cancel"
      >
        <Button className={styles.cancelBtn} type="default" disabled={isDisabled}>
          终止
        </Button>
      </Clickable>) :
      (<Clickable
        onClick={this.handleCancel}
        eventName="/click/taskFormFlowStep/cancel"
      >
        <Button className={styles.cancelBtn} type="default">
          取消
        </Button>
      </Clickable>);

    // 根据来源判断按钮类型
    const stopBtn = source === 'returnTask' ?
      (<Clickable
        onClick={this.handleStopFlow}
        eventName="/click/taskFormFlowStep/cancel"
      >
        <Button className={styles.stopBtn} type="default" disabled={isDisabled}>
          终止
        </Button>
      </Clickable>) : null;

    // 灰度发布展示结果跟踪和任务调查，默认不展示
    if (!envHelper.isGrayFlag()) {
      steps.splice(1, 1);
    }

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
            <div>
              {cancleBtn}
            </div>
          }
          {
            current > 0
            &&
            <div>
              {stopBtn}
              <Clickable
                onClick={this.handlePreviousStep}
                eventName="/click/taskFormFlowStep/lastStep"
              >
                <Button className={styles.prevStepBtn} type="default" disabled={isDisabled}>
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
              <Button className={styles.handlePreviousStep} type="primary" disabled={!canGoNextStep}>
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
              <Button className={styles.confirmBtn} type="primary" disabled={isDisabled}>
                确认无误，提交
              </Button>
            </Clickable>
          }
        </div>
      </div>
    );
  }
}
