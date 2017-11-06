/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-06 10:36:15
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-06 14:44:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { Steps, message, Button, Mention } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { permission, fspGlobal, helper } from '../../utils';
import { fspContainer } from '../../config';
import { validateFormContent } from '../../decorators/validateFormContent';
import PickTargetCustomer from '../../components/customerPool/taskFlow/PickTargetCustomer';
import TaskPreview from '../../components/customerPool/taskFlow/TaskPreview';
import CreateTaskForm from '../../components/customerPool/createTask/CreateTaskForm';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
import styles from './taskFlow.less';

const Step = Steps.Step;
const { toString } = Mention;

const orgId = helper.getOrgId();
const EMPTY_OBJECT = {};

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
  };

  static defaultProps = {
    dict: {},
    getLabelPeopleLoading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      currentSelectRecord: {},
      currentSelectRowKeys: [],
      isSuccess: false,
      custSource: '',
      isLoadingEnd: true,
      isShowErrorInfo: false,
      isShowErrorTaskType: false,
      isShowErrorExcuteType: false,
    };
    // 首页指标查询权限
    this.isHasAuthorize = permission.hasIndexViewPermission();
  }

  componentWillReceiveProps(nextProps) {
    const { getLabelPeopleLoading } = this.props;
    const { submitTaskFlowResult: nextResult, getLabelPeopleLoading: nextLoading } = nextProps;

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
  }

  componentWillUnmount() {
    const { clearTaskFlowData, resetActiveTab } = this.props;
    // 清除数据
    clearTaskFlowData();
    // 恢复默认tab
    resetActiveTab();
  }

  @autobind
  handleNextStep() {
    // 下一步
    const { saveTaskFlowData, storedTaskFlowData = EMPTY_OBJECT, currentTab } = this.props;
    const { current } = this.state;

    let taskFormData = storedTaskFlowData.taskFormData;
    let pickTargetCustomerData = {};
    let isFormValidate = !_.isEmpty(taskFormData);
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
      labelId,
      customNum: labelCustNums,
      uploadedFileKey: fileId,
      executionType,
      serviceStrategySuggestion,
      taskName,
      taskType,
      templetDesc,
      timelyIntervalValue,
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

    if (currentTab === '1') {
      submitTaskFlow({
        fileId,
        ...postBody,
      });
    } else {
      submitTaskFlow({
        labelId,
        queryLabelDTO: {
          ptyMngId: helper.getEmpId(),
          orgId,
        },
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
  resetLoading() {
    this.setState({
      isLoadingEnd: false,
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
        onCancel={this.resetLoading}
        isHasAuthorize={this.isHasAuthorize}
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
        taskTypes={custServerTypeFeedBackDict}
        onSingleRowSelectionChange={this.handleSingleRowSelectionChange}
        onRowSelectionChange={this.handleRowSelectionChange}
        currentSelectRecord={currentSelectRecord}
        currentSelectRowKeys={currentSelectRowKeys}
        isNeedApproval={this.isHasAuthorize}
        custSource={custSource}
      />,
    }];

    const stepsCount = _.size(steps);

    return (
      isSuccess ?
        <CreateTaskSuccess
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
                onClick={_.debounce(this.handleNextStep, 250)}
              >下一步</Button>
            }
            {
              current === stepsCount - 1
              &&
              <Button
                className={styles.confirmBtn}
                type="primary"
                onClick={_.debounce(this.handleSubmitTaskFlow, 250)}
              >确认无误，提交</Button>
            }
          </div>
        </div>
    );
  }
}
