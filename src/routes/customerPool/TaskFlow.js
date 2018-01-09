/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-06 10:36:15
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-09 15:00:02
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import { Steps, message, Button, Mention } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { permission, fspGlobal } from '../../utils';
import { emp, env } from '../../helper';
import Clickable from '../../components/common/Clickable';
import { validateFormContent } from '../../decorators/validateFormContent';
import PickTargetCustomer from '../../components/customerPool/taskFlow/PickTargetCustomer';
import ResultTrack from '../../components/common/resultTrack/ConnectedComponent';
import MissionInvestigation from '../../components/common/missionInvestigation/ConnectedComponent';
import TaskPreview from '../../components/customerPool/taskFlow/TaskPreview';
import CreateTaskForm from '../../components/customerPool/createTask/CreateTaskForm';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
import withRouter from '../../decorators/withRouter';
import styles from './taskFlow.less';

const Step = Steps.Step;
const { toString } = Mention;

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
  templateId: state.customerPool.templateId,
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
    templateId: PropTypes.string,
    generateTemplateId: PropTypes.func.isRequired,
  };

  static defaultProps = {
    dict: {},
    getLabelPeopleLoading: false,
    getApprovalListLoading: false,
    templateId: '',
  };

  constructor(props) {
    super(props);
    const { current, currentSelectRowKeys, currentSelectRecord } = props.storedTaskFlowData || {};
    this.state = {
      current: current || 2,
      currentSelectRecord: currentSelectRecord || {},
      currentSelectRowKeys: currentSelectRowKeys || [],
      isSuccess: false,
      isLoadingEnd: true,
      isShowErrorInfo: false,
      isShowErrorTaskType: false,
      isShowErrorTaskSubType: false,
      isShowErrorExcuteType: false,
      visible: false,
      isApprovalListLoadingEnd: false,
      isShowApprovalModal: false,
    };
    // 首页指标查询权限
    this.isHasAuthorize = permission.hasCreateTaskPermission();
  }

  componentWillReceiveProps(nextProps) {
    const { getLabelPeopleLoading,
      peopleOfLabelData = EMPTY_ARRAY,
      getApprovalListLoading,
      approvalList = EMPTY_ARRAY,
     } = this.props;
    const { submitTaskFlowResult: nextResult,
      getLabelPeopleLoading: nextLoading,
      getApprovalListLoading: nextApprovalListLoading,
      peopleOfLabelData: nextData = EMPTY_ARRAY,
      approvalList: nextList = EMPTY_ARRAY,
    } = nextProps;

    if (nextResult === 'success') {
      this.setState({
        isSuccess: true,
      });
    }

    // loading状态
    // 只有全部loading完毕才触发isLoadingEnd
    if (getLabelPeopleLoading && !nextLoading) {
      this.setState({
        isLoadingEnd: true,
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
   * 点击下一步，校验所有信息，然后下一步界面
   */
  @autobind
  handleNextStep() {
    // 下一步
    const {
      saveTaskFlowData,
      storedTaskFlowData = EMPTY_OBJECT,
      currentTab,
      generateTemplateId,
    } = this.props;
    const { current } = this.state;

    let taskFormData = storedTaskFlowData.taskFormData;
    let pickTargetCustomerData = {};
    let resultTrackData = {};
    let missionInvestigationData = {};
    let isFormValidate = false;
    let isSelectCust = false;
    let isResultTrackValidate = false;
    let isMissionInvestigationValidate = false;
    // 第一步是选择客户界面
    if (current === 0) {
      isFormValidate = true;
      pickTargetCustomerData = this.pickTargetCustomerRef.getWrappedInstance().getData();
      const { labelCust: { labelId }, custSegment: { uploadedFileKey } } = pickTargetCustomerData;
      if (currentTab === '2' && _.isEmpty(labelId)) {
        isSelectCust = false;
        message.error('请利用标签圈出目标客户');
      }
      if (currentTab === '1' && _.isEmpty(uploadedFileKey)) {
        isSelectCust = false;
        message.error('请导入Excel或CSV文件');
      }
    } else if (current === 1) {
      // 第二步是基本信息界面
      this.formRef.props.form.validateFields((err, values) => {
        let isFormError = false;
        console.log('err-->', err);
        if (!_.isEmpty(err)) {
          isFormError = true;
          isFormValidate = false;
        }
        const formDataValidation = this.checkFormField({ ...values, isFormError });
        if (formDataValidation) {
          taskFormData = this.formRef.props.form.getFieldsValue();
          isFormValidate = true;
        }
        this.props.clearTaskFlowData();
      });
    } else if (current === 2) {
      // 第三步是结果跟踪和任务调查页面
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

    // isFormValidate && isSelectCust
    if (isFormValidate && isSelectCust && isMissionInvestigationValidate && isResultTrackValidate) {
      saveTaskFlowData({
        ...storedTaskFlowData,
        taskFormData,
        ...pickTargetCustomerData,
        resultTrackData,
        missionInvestigationData,
        current: current + 1,
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
  handlePreview({ uploadKey, pageNum, pageSize }) {
    console.log(uploadKey);
    if (!uploadKey) {
      message.error('请先上传文件');
      return;
    }
    const { previewCustFile } = this.props;
    // 预览数据
    previewCustFile({
      filename: uploadKey,
      pageNum,
      pageSize,
    });
  }

  @autobind
  handleSubmitTaskFlow() {
    const { submitTaskFlow, storedTaskFlowData, currentTab = '1', templateId } = this.props;

    const { currentSelectRecord: { login: flowAuditorId = null } } = this.state;

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
      labelMapping,
      custNum: labelCustNums,
      uploadedFileKey: fileId,
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      taskSubType,
      templetDesc,
      timelyIntervalValue,
      labelDesc,
      labelName,
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

    let postBody = {
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc: toString(templetDesc),
      timelyIntervalValue,
      // 任务子类型
      taskSubType,
    };

    if (this.isHasAuthorize) {
      postBody = {
        ...postBody,
        flowAuditorId,
      };
    }

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

    const labelCustPostBody = {
      labelId: labelMapping,
      queryLabelDTO: {
        labelDesc,
        labelName,
      },
      labelCustNums,
      ...postBody,
    };

    // 当前tab是第一个，则代表导入客户
    if (currentTab === '1') {
      submitTaskFlow({
        fileId,
        ...postBody,
      });
    } else if (this.isHasAuthorize) {
      // 有审批权限，则需要传入orgId
      submitTaskFlow(_.merge(labelCustPostBody, {
        queryLabelDTO: {
          orgId,
        },
      }));
    } else {
      // 没有审批权限，则需要传入ptyMngId
      submitTaskFlow(_.merge(labelCustPostBody, {
        queryLabelDTO: {
          ptyMngId: emp.getId(),
        },
      }));
    }

    // 成功之后再clear
    // clearTaskFlowData();
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
    if (env.isInFsp()) {
      fspGlobal.closeRctTabById('FSP_ST_TAB_MOT_SELFBUILD_ADD');
    } else {
      console.log('close tab');
      this.setState({
        isSuccess: false,
      });
    }
  }

  @autobind
  handleRemoveTab() {
    if (env.isInFsp()) {
      fspGlobal.closeRctTabById('FSP_ST_TAB_MOT_SELFBUILD_ADD');
    }
  }

  @autobind
  resetLoading() {
    this.setState({
      isLoadingEnd: true,
      visible: false,
      isShowApprovalModal: false,
      isApprovalListLoadingEnd: true,
    });
  }

  render() {
    const {
      current,
      currentSelectRecord,
      currentSelectRowKeys,
      isSuccess,
      isLoadingEnd,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorTaskSubType,
      visible,
      isApprovalListLoadingEnd,
      isShowApprovalModal,
    } = this.state;

    const {
      dict,
      dict: { executeTypes, missionType },
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
      clearSubmitTaskFlowResult,
    } = this.props;

    // 拿到自建任务需要的missionType
    // descText为1
    const motMissionType = _.filter(missionType, item => item.descText === '1') || [];

    const { taskFormData = EMPTY_OBJECT } = storedTaskFlowData;
    const isShowTitle = true;
    const steps = [{
      title: '选择目标客户',
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
        orgId={orgId}
        isLoadingEnd={isLoadingEnd}
        visible={visible}
        onCancel={this.resetLoading}
        isHasAuthorize={this.isHasAuthorize}
      />,
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
        />
      </div>,
    }, {
      title: '结果跟踪&任务调查',
      content: <div>
        <ResultTrack
          ref={ref => (this.resultTrackRef = ref)}
          storedData={storedTaskFlowData}
        />
        {
          this.isHasAuthorize ?
            <MissionInvestigation
              ref={ref => (this.missionInvestigationRef = ref)}
              storedData={storedTaskFlowData}
            /> :
            null
        }
      </div>,
    }, {
      title: '确认&提交',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
        storedData={storedTaskFlowData}
        approvalList={approvalList}
        currentTab={currentTab}
        getApprovalList={getApprovalList}
        executeTypes={executeTypes}
        taskTypes={motMissionType}
        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
        onRowSelectionChange={this.handleRowSelectionChange}
        currentSelectRecord={currentSelectRecord}
        currentSelectRowKeys={currentSelectRowKeys}
        isNeedApproval={this.isHasAuthorize}
        isShowApprovalModal={isShowApprovalModal}
        isApprovalListLoadingEnd={isApprovalListLoadingEnd}
        onCancel={this.resetLoading}
      />,
    }];

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
                onClick={this.handleCloseTab}
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
