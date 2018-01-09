/**
 * @Date: 2017-11-10 15:13:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-09 14:55:14
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Mention, message } from 'antd';
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
    // 新增
    templateId: PropTypes.string.isRequired,
    generateTemplateId: PropTypes.func.isRequired,
    onCloseTab: PropTypes.func.isRequired,
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
      custSource: custSource || '',
      isShowErrorInfo: false,
      isShowErrorExcuteType: false,
      isShowErrorTaskType: false,
      isShowErrorTaskSubType: false,
    };
    // 创建任务权限
    this.isHasAuthorize = permission.hasCreateTaskPermission();
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
        taskFormData,
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

    let isResultTrackValidate = false;
    let isMissionInvestigationValidate = false;
    let isFormValidate = false;
    let resultTrackData = storedCreateTaskData.resultTrackData || {};
    let missionInvestigationData = storedCreateTaskData.missionInvestigationData || {};
    let taskFormData = storedCreateTaskData.taskFormData || {};
    // 客户来源
    const custSource = this.handleCustSource(source);

    if (current === 0) {
      // 当前是第一步,校验表单信息
      this.createTaskForm.getWrappedInstance().validateFields((err, values) => {
        let isFormError = false;
        if (!_.isEmpty(err)) {
          isFormError = true;
          isFormValidate = false;
        }
        const formDataValidation = this.saveFormContent({ ...values, isFormError });
        if (formDataValidation) {
          taskFormData = this.createTaskForm.getWrappedInstance().getFieldsValue();
          isFormValidate = true;
        }
      });
    } else if (current === 1) {
      // 当前是第二步，校验结果跟踪和任务调查数据
      resultTrackData = this.resultTrackRef.getWrappedInstance().getData();
      const {
        // 跟踪窗口期
        // trackWindowDate,
        // 一级指标
        indicatorLevel1,
        // 二级指标
        indicatorLevel2,
        // 产品编号
        productCode,
        // 产品名称
        // productName,
        // 操作符key,传给后台,譬如>=/<=
        // operationKey,
        // 操作符name,展示用到，譬如达到/降到
        // operationValue,
        // 当前输入的指标值
        inputIndicator,
        // 单位
        // unit,
        // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
        // isHasState,
        // 是否有产品搜索
        isHasSearchedProduct,
        // 是否选中
        isResultTrackChecked,
        // 是否有输入情况
        isNeedInput,
      } = resultTrackData;
      // if (!isResultTrackChecked) {
      //   message.error('请勾选结果跟踪');
      // } else
      if (isResultTrackChecked) {
        if (_.isEmpty(indicatorLevel1)) {
          message.error('请选择一级指标');
        } else if (_.isEmpty(indicatorLevel2)) {
          message.error('请选择二级指标');
        } else if (isHasSearchedProduct && _.isEmpty(productCode)) {
          message.error('请选择一个产品');
        } else if (isNeedInput && _.isEmpty(inputIndicator)) {
          message.error('请输入指标目标值');
        } else {
          isResultTrackValidate = true;
        }
      } else {
        isResultTrackValidate = true;
      }

      // 拥有审批人权限，才能展示任务调查
      if (this.isHasAuthorize) {
        missionInvestigationData = this.missionInvestigationRef.getWrappedInstance().getData();
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
      this.setState({
        current: current + 1,
        custSource,
      });
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
    } = this.props;

    const { login: flowAuditorId = null } = currentSelectRecord || {};
    const {
      custIdList,
      custCondition,
      custCondition: { entrance },
    } = parseQuery();

    let req = {};
    if (entrance === 'managerView') {
      req = { queryMissionCustsReq: _.omit(custCondition, 'entrance') };
    } else {
      req = { searchReq: custCondition };
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
      taskSubType,
      templetDesc,
      timelyIntervalValue,
      // 跟踪窗口期
      trackWindowDate,
      // 一级指标
      indicatorLevel1,
      // 二级指标
      indicatorLevel2,
      // 产品编号
      productCode,
      // 产品名称
      // productName,
      // 操作符key,传给后台,譬如>=/<=
      operationKey,
      // 操作符name,展示用到，譬如达到/降到
      // operationValue,
      // 当前输入的指标值
      inputIndicator,
      // 单位
      unit,
      // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
      isHasState,
      // 是否有产品搜索
      isHasSearchedProduct,
      // 是否选中
      isResultTrackChecked,
      // 是否有输入情况
      isNeedInput,

      // 是否选中
      isMissionInvestigationChecked,
      // 选择的问题List
      // questionList,
    } = finalData;

    // 初始化post入参，包括基本信息和任务子类型，和客户列表
    let postBody = {
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc: toString(templetDesc),
      timelyIntervalValue,
      // 任务子类型
      taskSubType,
      flowAuditorId,
      custIdList,
      ...req,
    };

    // 如果需要审批，则添加审批人Id
    if (this.isHasAuthorize) {
      postBody = {
        ...postBody,
        flowAuditorId,
      };
    }

    // 如果有任务调查
    if (isResultTrackChecked) {
      postBody = {
        ...postBody,
        unit: !isHasState ? unit : null,
        operationKey,
        inputIndicator: isNeedInput ? inputIndicator : null,
        trackWindowDate,
        indicatorLevel1,
        indicatorLevel2,
        productCode: isHasSearchedProduct ? productCode : null,
      };
    }

    if (this.isHasAuthorize && isMissionInvestigationChecked) {
      postBody = {
        ...postBody,
        // 模板Id
        templateId,
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

  render() {
    const {
      current,
      previousData,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorTaskSubType,
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
        isShowErrorTaskSubType={isShowErrorTaskSubType}
        custCount={Number(count)}
        missionType={missionType}
      />,
    }, {
      title: '结果跟踪&任务调查',
      content: <div>
        <ResultTrack
          ref={ref => (this.resultTrackRef = ref)}
          storedData={previousData}
        />
        {
          this.isHasAuthorize ?
            <MissionInvestigation
              ref={ref => (this.missionInvestigationRef = ref)}
              storedData={previousData}
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
        isNeedApproval={this.isHasAuthorize}
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
