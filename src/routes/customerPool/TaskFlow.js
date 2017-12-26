/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-06 10:36:15
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-26 17:04:55
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { Steps, message, Button, Mention } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { permission, fspGlobal } from '../../utils';
import { emp } from '../../helper';
import Clickable from '../../components/common/Clickable';
import { fspContainer } from '../../config';
import { validateFormContent } from '../../decorators/validateFormContent';
import PickTargetCustomer from '../../components/customerPool/taskFlow/PickTargetCustomer';
import TaskPreview from '../../components/customerPool/taskFlow/TaskPreview';
import CreateTaskForm from '../../components/customerPool/createTask/CreateTaskForm';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
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
  };

  static defaultProps = {
    dict: {},
    getLabelPeopleLoading: false,
    getApprovalListLoading: false,
  };

  constructor(props) {
    super(props);
    const { current, currentSelectRowKeys, currentSelectRecord } = props.storedTaskFlowData || {};
    this.state = {
      current: current || 0,
      currentSelectRecord: currentSelectRecord || {},
      currentSelectRowKeys: currentSelectRowKeys || [],
      isSuccess: false,
      custSource: '',
      isLoadingEnd: true,
      isShowErrorInfo: false,
      isShowErrorTaskType: false,
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

  @autobind
  handleNextStep() {
    // 下一步
    const { saveTaskFlowData, storedTaskFlowData = EMPTY_OBJECT, currentTab } = this.props;
    const { current } = this.state;

    let taskFormData = storedTaskFlowData.taskFormData;
    let pickTargetCustomerData = {};
    let isFormValidate = false;
    let isSelectCust = true;
    if (current === 0) {
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
    } else if (current === 1) {
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
    }

    if (isFormValidate && isSelectCust) {
      saveTaskFlowData({
        ...storedTaskFlowData,
        taskFormData,
        ...pickTargetCustomerData,
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
      labelMapping,
      customNum: labelCustNums,
      uploadedFileKey: fileId,
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc,
      timelyIntervalValue,
      labelDesc,
      labelName,
    } = finalData;

    let postBody = {
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc: toString(templetDesc),
      timelyIntervalValue,
    };

    if (this.isHasAuthorize) {
      postBody = {
        ...postBody,
        flowAuditorId,
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

    if (currentTab === '1') {
      submitTaskFlow({
        fileId,
        ...postBody,
      });
    } else if (this.isHasAuthorize) {
      submitTaskFlow(_.merge(labelCustPostBody, {
        queryLabelDTO: {
          orgId,
        },
      }));
    } else {
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
    if (document.querySelector(fspContainer.container)) {
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
    if (document.querySelector(fspContainer.container)) {
      fspGlobal.closeTabMenu('FSP_ST_TAB_MOT_SELFBUILD_ADD');
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
      custSource,
      isLoadingEnd,
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      visible,
      isApprovalListLoadingEnd,
      isShowApprovalModal,
    } = this.state;

    const {
      dict,
      dict: { executeTypes, custServerTypeFeedBackDict },
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

    const { taskFormData = EMPTY_OBJECT } = storedTaskFlowData;
    const isShowTitle = true;
    const steps = [{
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
        orgId={orgId}
        isLoadingEnd={isLoadingEnd}
        visible={visible}
        onCancel={this.resetLoading}
        isHasAuthorize={this.isHasAuthorize}
      />,
    }, {
      title: '提交',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
        storedData={storedTaskFlowData}
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
          onRemoveTab={this.handleRemoveTab}
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
