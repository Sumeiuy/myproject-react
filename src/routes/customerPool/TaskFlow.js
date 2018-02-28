/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-06 10:36:15
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-02-22 10:34:06
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Steps, message, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { removeTab, closeRctTab } from '../../utils';
import { emp, permission, env as envHelper } from '../../helper';
import Clickable from '../../components/common/Clickable';
import { validateFormContent } from '../../decorators/validateFormContent';
import ResultTrack from '../../components/common/resultTrack/ConnectedComponent';
import MissionInvestigation from '../../components/common/missionInvestigation/ConnectedComponent';
import TaskPreview from '../../components/customerPool/taskFlow/TaskPreview';
import CreateTaskForm from '../../components/customerPool/createTask/CreateTaskForm';
import SelectTargetCustomer from '../../components/customerPool/taskFlow/step1/SelectTargetCustomer';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
import withRouter from '../../decorators/withRouter';
import styles from './taskFlow.less';

const Step = Steps.Step;

const orgId = emp.getOrgId();
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

const effects = {
  // 预览客户细分数据
  previewCustFile: 'customerPool/previewCustFile',
  getLabelInfo: 'customerPool/getLabelInfo',
  getLabelPeople: 'customerPool/getLabelPeople',
  submitTaskFlow: 'customerPool/submitTaskFlow',
  getApprovalList: 'customerPool/getApprovalList',
  generateTemplateId: 'customerPool/generateTemplateId',
  isSendCustsServedByPostn: 'customerPool/isSendCustsServedByPostn',
  getFiltersOfSightingTelescope: 'customerPool/getFiltersOfSightingTelescope',
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
  getLabelPeopleLoading: state.loading.effects[effects.getLabelPeople],
  getApprovalListLoading: state.loading.effects[effects.getApprovalList],
  // 获取瞄准镜标签的loading
  getFiltersOfSightingTelescopeLoading: state.loading
    .effects[effects.getFiltersOfSightingTelescope],
  templateId: state.customerPool.templateId,
  creator: state.app.creator,
  sendCustsServedByPostnResult: state.customerPool.sendCustsServedByPostnResult,
  sightingTelescopeFilters: state.customerPool.sightingTelescopeFilters,
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
  // 保存选中的入口
  saveCurrentEntry: query => ({
    type: 'customerPool/saveCurrentEntry',
    payload: query,
  }),
  // 清除数据
  clearTaskFlowData: query => ({
    type: 'customerPool/clearTaskFlowData',
    payload: query || {},
  }),
  // 重置tab
  resetActiveTab: query => ({
    type: 'customerPool/resetActiveTab',
    payload: query || {},
  }),
  // 清除提交结果
  clearSubmitTaskFlowResult: query => ({
    type: 'customerPool/clearSubmitTaskFlowResult',
    payload: query || '',
  }),
  previewCustFile: fetchData(effects.previewCustFile, true),
  getLabelInfo: fetchData(effects.getLabelInfo, true),
  getLabelPeople: fetchData(effects.getLabelPeople, true),
  submitTaskFlow: fetchData(effects.submitTaskFlow, true),
  getApprovalList: fetchData(effects.getApprovalList, true),
  generateTemplateId: fetchData(effects.generateTemplateId, true),
  isSendCustsServedByPostn: fetchData(effects.isSendCustsServedByPostn, true),
  getFiltersOfSightingTelescope: fetchData(effects.getFiltersOfSightingTelescope, true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    previewCustFile: PropTypes.func.isRequired,
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
    getLabelPeopleLoading: PropTypes.bool,
    clearTaskFlowData: PropTypes.func.isRequired,
    resetActiveTab: PropTypes.func.isRequired,
    clearSubmitTaskFlowResult: PropTypes.func.isRequired,
    getApprovalListLoading: PropTypes.bool,
    templateId: PropTypes.number,
    generateTemplateId: PropTypes.func.isRequired,
    creator: PropTypes.string,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    getFiltersOfSightingTelescopeLoading: PropTypes.bool,
  };

  static defaultProps = {
    dict: {},
    getLabelPeopleLoading: false,
    getApprovalListLoading: false,
    getFiltersOfSightingTelescopeLoading: false,
    templateId: 0,
    creator: '',
  };

  constructor(props) {
    super(props);
    const { current, currentSelectRowKeys, currentSelectRecord } = props.storedTaskFlowData || {};

    this.state = {
      current: current || 0,
      currentSelectRecord: currentSelectRecord || {},
      currentSelectRowKeys: currentSelectRowKeys || [],
      isSuccess: false,
      isLoadingEnd: true,
      isShowErrorInfo: false,
      isShowErrorTaskType: false,
      isShowErrorTaskSubType: false,
      isShowErrorExcuteType: false,
      isShowErrorIntervalValue: false,
      isShowErrorStrategySuggestion: false,
      isShowErrorTaskName: false,
      visible: false,
      isApprovalListLoadingEnd: false,
      isShowApprovalModal: false,
      needApproval: false,
      canGoNextStep: false,
      needMissionInvestigation: false,
      isSightTelescopeLoadingEnd: true,
    };

    this.hasTkMampPermission = permission.hasTkMampPermission();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getLabelPeopleLoading,
      peopleOfLabelData = EMPTY_ARRAY,
      getApprovalListLoading,
      approvalList = EMPTY_ARRAY,
      getFiltersOfSightingTelescopeLoading,
     } = this.props;
    const {
      submitTaskFlowResult: nextResult,
      getLabelPeopleLoading: nextLoading,
      getApprovalListLoading: nextApprovalListLoading,
      peopleOfLabelData: nextData = EMPTY_ARRAY,
      approvalList: nextList = EMPTY_ARRAY,
      getFiltersOfSightingTelescopeLoading: nextSightingTelescopeLoading,
    } = nextProps;

    if (nextResult === 'success') {
      this.setState({
        isSuccess: true,
      });
    }

    // loading状态
    // 只有全部loading完毕才触发isLoadingEnd
    if (getLabelPeopleLoading) {
      let getLabelPeopleLoadingStatus = true;
      if (!nextLoading) {
        getLabelPeopleLoadingStatus = false;
      }
      this.setState({
        isLoadingEnd: !getLabelPeopleLoadingStatus,
      });
    }

    // loading状态
    // 只有全部loading完毕才触发isSightTelescopeLoadingEnd
    if (getFiltersOfSightingTelescopeLoading) {
      let getFiltersOfSightingTelescopeLoadingStatus = true;
      if (!nextSightingTelescopeLoading) {
        getFiltersOfSightingTelescopeLoadingStatus = false;
      }
      this.setState({
        isSightTelescopeLoadingEnd: !getFiltersOfSightingTelescopeLoadingStatus,
      });
    }

    if (peopleOfLabelData !== nextData) {
      this.setState({
        visible: true,
      });
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

  /**
   * 根据职责来判断，是加入orgId还是ptyMngId
   * @param {*object} postBody post参数
   */
  @autobind
  addOrgIdOrPtyMngId(postBody, argsOfQueryCustomer = {}, labelId) {
    let newPostBody = postBody;
    if (this.hasTkMampPermission) {
      // 有权限传orgId
      newPostBody = {
        ...newPostBody,
        searchReq: {
          orgId: emp.getOrgId(),
        },
      };
    } else {
      newPostBody = {
        ...newPostBody,
        searchReq: {
          ptyMngId: emp.getId(),
        },
      };
    }

    const currentLabelQueryCustomerParam = argsOfQueryCustomer[`${labelId}`] || {};
    // 当前瞄准镜筛选条件为空，或者labels只有一个并且没有过滤条件
    if (_.isEmpty(currentLabelQueryCustomerParam)
      || (_.isEmpty(currentLabelQueryCustomerParam.filtersReq)
        && _.size(currentLabelQueryCustomerParam.labels) === 1)) {
      // 代表当前选中的标签没有进行筛查客户
      newPostBody = _.merge(newPostBody, {
        searchReq: {
          enterType: 'labelSearchCustPool',
          labels: [labelId],
        },
      });
    } else {
      newPostBody = _.merge(newPostBody, {
        searchReq: _.omit(currentLabelQueryCustomerParam, ['curPageNum', 'pageSize']),
      });
    }

    return newPostBody;
  }

  @autobind
  saveTaskFlowFinalData(data) {
    this.props.saveTaskFlowData({ ...data });
  }

  /**
   * 点击下一步，校验所有信息，然后下一步界面
   */
  @autobind
  handleNextStep() {
    // 下一步
    const {
      storedTaskFlowData = EMPTY_OBJECT,
      generateTemplateId,
      isSendCustsServedByPostn,
    } = this.props;
    const { current } = this.state;

    let {
      taskFormData = {},
      pickTargetCustomerData = {},
      resultTrackData = {},
      missionInvestigationData = {},
      currentEntry = 0,
    } = storedTaskFlowData;
    let isFormValidate = true;
    let isSelectCust = true;
    let isResultTrackValidate = true;
    let isMissionInvestigationValidate = true;
    let isAllowGoNextStep = false;
    // 第一步是选择客户界面
    if (current === 0) {
      const {
        currentEntry: entry,
        importCustomers,
        sightingTelescope,
      } = this.SelectTargetCustomerRef.getData();
      currentEntry = entry;
      const { custSegment, custSegment: { uploadedFileKey } } = importCustomers;
      const {
        labelCust,
        labelCust: {
          labelId,
          argsOfQueryCustomer = {},
          custNum,
        },
      } = sightingTelescope;
      // currentEntry为0 时 表示当前是导入客户
      // 为1 时 表示当前是瞄准镜
      if (currentEntry === 0) {
        if (!uploadedFileKey) {
          isSelectCust = false;
          message.error('请导入Excel文件');
          return;
        }
      } else if (currentEntry === 1) {
        if (!labelId) {
          isSelectCust = false;
          message.error('请利用标签圈出目标客户');
          return;
        }
      }

      let postBody = {
        postnId: emp.getPstnId(),
      };

      // 当前tab是第一个，则代表导入客户
      if (currentEntry === 0) {
        postBody = {
          ...postBody,
          fileId: uploadedFileKey,
        };
      } else {
        if (custNum === 0) {
          message.error('此标签下无客户，不可发起任务，请选择其他标签');
          return;
        }

        postBody = this.addOrgIdOrPtyMngId(postBody, argsOfQueryCustomer, labelId);
      }

      pickTargetCustomerData = { ...pickTargetCustomerData, labelCust, custSegment };

      isSendCustsServedByPostn({
        ...postBody,
      }).then(() => {
        const { sendCustsServedByPostnResult = {} } = this.props;
        if (_.isEmpty(sendCustsServedByPostnResult)) {
          isSelectCust = false;
        } else {
          const {
            needApproval,
            canGoNextStep,
            needMissionInvestigation,
            isIncludeNotMineCust,
          } = permission.judgeCreateTaskApproval({ ...sendCustsServedByPostnResult });
          if (isIncludeNotMineCust && !canGoNextStep) {
            isSelectCust = false;
            message.error('客户包含非本人名下客户，请重新选择');
          } else {
            this.saveTaskFlowFinalData({
              ...storedTaskFlowData,
              taskFormData,
              ...pickTargetCustomerData,
              resultTrackData,
              missionInvestigationData,
              current: current + 1,
              // 选择客户当前入口
              currentEntry,
            });
            this.setState({
              needApproval,
              canGoNextStep,
              needMissionInvestigation,
              currentEntry,
              current: current + 1,
            });
          }
        }
      });
    } else if (current === 1) {
      isAllowGoNextStep = true;
      // 拿到form表单component
      const formComponent = this.formRef;
      // 拿到被HOC包裹的组件
      const wrappedComponent = formComponent.taskFormInfoRef;
      // 表单form
      const { form: taskForm } = wrappedComponent.props;
      // 第二步基本信息界面
      taskForm.validateFields((err, values) => {
        let isFormError = false;
        if (!_.isEmpty(err)) {
          isFormError = true;
          isFormValidate = false;
        }

        const formDataValidation = this.checkFormField({ ...values, isFormError });

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
    } else if (current === 2) {
      isAllowGoNextStep = true;
      const resultTrackComponent = this.resultTrackRef;
      // 第三步是结果跟踪和任务调查页面
      resultTrackData = {
        ...resultTrackData,
        ...resultTrackComponent.getData(),
      };
      const {
        // 一级指标
        indicatorLevel1Key,
        // 二级指标
        indicatorLevel2Key,
        // 产品
        currentSelectedProduct,
        // 当前输入的指标值
        inputIndicator,
        // 是否没有判断标准，只是有一个状态，譬如手机号码，状态，完善
        hasState,
        // 是否有产品搜索
        hasSearchedProduct,
        // 是否选中
        isResultTrackChecked,
      } = resultTrackData;

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
      if (this.state.needMissionInvestigation) {
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

    if (isFormValidate
      && isSelectCust
      && isMissionInvestigationValidate
      && isResultTrackValidate
      && isAllowGoNextStep
    ) {
      this.saveTaskFlowFinalData({
        ...storedTaskFlowData,
        taskFormData,
        ...pickTargetCustomerData,
        resultTrackData,
        missionInvestigationData,
        current: current + 1,
        // 选择客户当前入口
        currentEntry,
      });
      this.setState({
        current: current + 1,
      });
    }
  }

  @autobind
  @validateFormContent
  checkFormField(values) {
    console.log(values);
  }

  @autobind
  handlePreviousStep() {
    const { saveTaskFlowData, storedTaskFlowData } = this.props;
    const { current } = this.state;
    // 上一步
    this.setState({
      current: current - 1,
    });
    saveTaskFlowData({
      ...storedTaskFlowData,
      current: current - 1,
    });
  }

  @autobind
  handleSubmitTaskFlow() {
    const { submitTaskFlow, storedTaskFlowData, templateId } = this.props;

    const {
      currentSelectRecord: { login: flowAuditorId = null },
      currentEntry,
      needApproval,
      needMissionInvestigation,
    } = this.state;

    if (_.isEmpty(flowAuditorId) && needApproval) {
      message.error('任务需要审批，请选择审批人');
      return;
    }

    const {
      taskFormData = EMPTY_OBJECT,
      labelCust = EMPTY_OBJECT,
      custSegment = EMPTY_OBJECT,
      resultTrackData,
      missionInvestigationData,
    } = storedTaskFlowData;

    let finalData = {};
    finalData = {
      ...taskFormData,
      ...labelCust,
      ...custSegment,
      ...resultTrackData,
      ...missionInvestigationData,
    };

    const {
      labelName,
      labelDesc,
      uploadedFileKey: fileId,
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      labelId,
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
      argsOfQueryCustomer = {},
    } = finalData;

    let postBody = {
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc,
      timelyIntervalValue,
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

    // 当前tab是第一个，则代表导入客户
    if (currentEntry === 0) {
      postBody = {
        fileId,
        ...postBody,
      };
    } else {
      postBody = this.addOrgIdOrPtyMngId(postBody, argsOfQueryCustomer, labelId);
      postBody = {
        ...postBody,
        queryLabelReq: {
          labelDesc,
          labelName,
        },
      };
    }

    submitTaskFlow({ ...postBody });
  }

  @autobind
  handleRowSelectionChange(selectedRowKeys, selectedRows) {
    console.log(selectedRowKeys, selectedRows);
    const { saveTaskFlowData, storedTaskFlowData } = this.props;
    this.setState({
      currentSelectRowKeys: selectedRowKeys,
    });
    saveTaskFlowData({
      ...storedTaskFlowData,
      currentSelectRowKeys: selectedRowKeys,
    });
  }

  @autobind
  handleSingleRowSelectionChange(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
    const { saveTaskFlowData, storedTaskFlowData } = this.props;
    const { login } = record;
    this.setState({
      currentSelectRecord: record,
      currentSelectRowKeys: [login],
    });
    saveTaskFlowData({
      ...storedTaskFlowData,
      currentSelectRecord: record,
      currentSelectRowKeys: [login],
    });
  }

  /**
   * 关闭当前tab页
   */
  @autobind
  handleCloseTab() {
    removeTab({
      id: 'FSP_ST_TAB_MOT_SELFBUILD_ADD',
    });
    this.setState({
      isSuccess: false,
    });
  }

  @autobind
  handleRemoveTab() {
    closeRctTab({
      id: 'FSP_ST_TAB_MOT_SELFBUILD_ADD',
    });
  }

  @autobind
  resetLoading() {
    this.setState({
      isLoadingEnd: true,
      visible: false,
      isShowApprovalModal: false,
      isApprovalListLoadingEnd: true,
      isSightTelescopeLoadingEnd: true,
    });
  }

  render() {
    const {
      current,
      currentSelectRecord,
      currentSelectRowKeys,
      isSuccess,
      isLoadingEnd,
      isSightTelescopeLoadingEnd,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorTaskSubType,
      visible,
      isApprovalListLoadingEnd,
      isShowApprovalModal,
      needApproval,
      needMissionInvestigation,
      isShowErrorIntervalValue,
      isShowErrorStrategySuggestion,
      isShowErrorTaskName,
    } = this.state;

    const {
      dict,
      dict: { executeTypes, missionType },
      priviewCustFileData,
      storedTaskFlowData,
      getLabelInfo,
      getLabelPeople,
      peopleOfLabelData,
      circlePeopleData,
      approvalList,
      getApprovalList,
      push,
      clearSubmitTaskFlowResult,
      creator,
      getFiltersOfSightingTelescope,
      sightingTelescopeFilters,
      previewCustFile,
    } = this.props;

    // 拿到自建任务需要的missionType
    // descText为1
    const motMissionType = _.filter(missionType, item => item.descText === '1') || [];

    const { taskFormData = EMPTY_OBJECT, currentEntry } = storedTaskFlowData;
    const isShowTitle = true;
    const steps = [{
      title: '选择目标客户',
      content: <div className={styles.taskInner}>
        <SelectTargetCustomer
          currentEntry={currentEntry}
          wrappedComponentRef={inst => (this.SelectTargetCustomerRef = inst)}
          dict={dict}
          location={location}
          previousData={{ ...taskFormData }}
          isShowTitle={isShowTitle}

          onPreview={previewCustFile}
          priviewCustFileData={priviewCustFileData}
          storedTaskFlowData={storedTaskFlowData}

          onCancel={this.resetLoading}
          isLoadingEnd={isLoadingEnd}
          isSightTelescopeLoadingEnd={isSightTelescopeLoadingEnd}
          circlePeopleData={circlePeopleData}
          getLabelInfo={getLabelInfo}
          peopleOfLabelData={peopleOfLabelData}
          getLabelPeople={getLabelPeople}
          isAuthorize={this.hasTkMampPermission}
          filterModalvisible={visible}
          orgId={orgId}
          getFiltersOfSightingTelescope={getFiltersOfSightingTelescope}
          sightingTelescopeFilters={sightingTelescopeFilters}
        />
      </div>,
    }, {
      title: '基本信息',
      content: <div className={styles.taskInner}>
        <CreateTaskForm
          wrappedComponentRef={inst => (this.formRef = inst)}
          dict={dict}
          location={location}
          previousData={{ ...taskFormData }}
          isShowTitle={isShowTitle}
          isShowErrorInfo={isShowErrorInfo}
          isShowErrorExcuteType={isShowErrorExcuteType}
          isShowErrorTaskType={isShowErrorTaskType}
          isShowErrorTaskSubType={isShowErrorTaskSubType}
          isShowErrorIntervalValue={isShowErrorIntervalValue}
          isShowErrorStrategySuggestion={isShowErrorStrategySuggestion}
          isShowErrorTaskName={isShowErrorTaskName}
        />
      </div>,
    }, {
      title: '结果跟踪&任务调查',
      content: <div>
        <ResultTrack
          wrappedComponentRef={ref => (this.resultTrackRef = ref)}
          needApproval={needApproval}
          storedData={storedTaskFlowData}
          needApproval={needApproval}
        />
        {
          needMissionInvestigation ?
            <MissionInvestigation
              wrappedComponentRef={ref => (this.missionInvestigationRef = ref)}
              storedData={storedTaskFlowData}
            /> : null
        }
      </div>,
    }, {
      title: '确认&提交',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
        storedData={storedTaskFlowData}
        approvalList={approvalList}
        currentEntry={currentEntry}
        getApprovalList={getApprovalList}
        executeTypes={executeTypes}
        taskTypes={motMissionType}
        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
        onRowSelectionChange={this.handleRowSelectionChange}
        currentSelectRecord={currentSelectRecord}
        currentSelectRowKeys={currentSelectRowKeys}
        needApproval={needApproval}
        isShowApprovalModal={isShowApprovalModal}
        isApprovalListLoadingEnd={isApprovalListLoadingEnd}
        onCancel={this.resetLoading}
        creator={creator}
      />,
    }];

    // 灰度发布展示结果跟踪和任务调查，默认不展示
    if (!envHelper.isGrayFlag()) {
      steps.splice(2, 1);
    }

    const stepsCount = _.size(steps);

    return (
      isSuccess ?
        <CreateTaskSuccess
          clearSubmitTaskFlowResult={clearSubmitTaskFlowResult}
          successType={isSuccess}
          push={push}
          location={location}
          onCloseTab={this.handleCloseTab}
        /> :
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
                onClick={this.handleRemoveTab}
                eventName="/click/taskFlow/cancel"
              >
                <Button className={styles.cancelBtn} type="default">取消</Button>
              </Clickable>
            }
            {
              current > 0
              &&
              <Clickable
                onClick={this.handlePreviousStep}
                eventName="/click/taskFlow/lastStep"
              >
                <Button className={styles.prevStepBtn} type="default">上一步</Button>
              </Clickable>
            }
            {
              current < stepsCount - 1
              &&
              <Clickable
                onClick={_.debounce(this.handleNextStep, 250)}
                eventName="/click/taskFlow/nextStep"
              >
                <Button className={styles.nextStepBtn} type="primary">下一步</Button>
              </Clickable>
            }
            {
              current === stepsCount - 1
              &&
              <Clickable
                onClick={_.debounce(this.handleSubmitTaskFlow, 250)}
                eventName="/click/taskFlow/submit"
              >
                <Button className={styles.confirmBtn} type="primary">确认无误，提交</Button>
              </Clickable>
            }
          </div>
        </div>
    );
  }
}
