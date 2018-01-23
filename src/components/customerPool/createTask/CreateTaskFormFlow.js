/**
 * @file customerPool/CreateTaskFormFlow.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { url } from '../../../helper';
import TaskFormFlowStep from './TaskFormFlowStep';
import styles from './createTaskFormFlow.less';

export default class CreateTaskFormFlow extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object,
    createTask: PropTypes.func,
    createTaskResult: PropTypes.object,
    storedCreateTaskData: PropTypes.object.isRequired,
    saveCreateTaskData: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    getApprovalList: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    push: PropTypes.func.isRequired,
    isShowApprovalModal: PropTypes.bool.isRequired,
    isApprovalListLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCloseTab: PropTypes.func.isRequired,
    enterType: PropTypes.string,
    // 新增
    templateId: PropTypes.number.isRequired,
    generateTemplateId: PropTypes.func.isRequired,
    creator: PropTypes.string.isRequired,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
  }

  static defaultProps = {
    dict: {},
    createTaskResult: {},
    createTask: () => { },
    orgId: null,
    enterType: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowErrorInfo: false,
      isShowErrorTaskType: false,
      isShowErrorTaskSubType: false,
      isShowErrorExcuteType: false,
    };
  }

  // 从业务目标池客户：businessCustPool
  // 标签、搜索目标客户：searchCustPool
  // 绩效目标客户 - 净新增客户： performanceCustPool
  // 绩效目标客户 - 业务开通：performanceBusinessOpenCustPool

  @autobind
  parseQuery() {
    const { location: { query: { ids = '', condition = {} } } } = this.props;
    let custCondition = {};
    let custIdList = null;
    if (!_.isEmpty(condition)) {
      if (!_.isEmpty(ids)) {
        custIdList = decodeURIComponent(ids).split(',');
        custCondition = JSON.parse(decodeURIComponent(condition));
      } else {
        custCondition = JSON.parse(decodeURIComponent(condition));
      }
    }
    return {
      custIdList,
      custCondition,
    };
  }

  // @autobind
  // handleCancleTab() {
  //   const { onCloseTab } = this.props;
  //   if (env.isInFsp()) {
  //     onCloseTab();
  //     const param = {
  //       id: 'tab-home',
  //       title: '首页',
  //     };
  //     fspGlobal.openRctTab({ url: '/customerPool', param });
  //   }
  // }

  /**
   * 判断入口来源
   */
  @autobind
  judgeSource(source) {
    // returnTask是审批驳回之后，编辑自建任务信息界面
    return source === 'custGroupList' || source === 'managerView' || source === 'returnTask';
  }

  @autobind
  getStoredCreateTaskData() {
    const { location: { query: { source, flowData = {} } }, storedCreateTaskData } = this.props;
    let currentFlowData = url.parse(flowData);
    if (!_.isEmpty(currentFlowData)) {
      // 生成需要的自建任务数据
      const {
        // 指标分类id
        indexCateId,
        // 是否和产品绑定
        isProdBound,
        // 跟踪操作符
        traceOpVO: {
          name,
          key,
        },
        // 输入值
        threshold,
        // 下限
        thresholdMin,
        // 上限
        thresholdMax,
        // 指标单位
        indexUnit,
        // 二级指标描述
        indexRemark,
        // 一级指标id
        indexId,
        // 跟踪窗口期
        trackDay,
        // 金融产品
        finProductVO,
        // 问卷调查
        quesInfoList = [],
      } = currentFlowData;

      currentFlowData = {
        resultTrackData: {
          // 跟踪窗口期
          trackWindowDate: trackDay,
          // 一级指标
          indicatorLevel1Key: indexId,
          // 二级指标
          indicatorLevel2Key: indexCateId,
          // 操作符key,传给后台,譬如>=/<=
          operationKey: key,
          // 当前输入的指标值
          inputIndicator: threshold,
          // 单位
          unit: indexUnit,
          // 是否有产品搜索
          hasSearchedProduct: isProdBound,
          // 是否选中
          isResultTrackChecked: true,
          operationValue: name,
          currentMin: thresholdMin,
          currentMax: thresholdMax,
          currentIndicatorDescription: indexRemark,
          currentSelectedProduct: finProductVO,
        },
        missionInvestigationData: {
          isMissionInvestigationChecked: true,
          questionList: quesInfoList,
        },
      };

      return currentFlowData;
    }

    let storedData = {};
    if (this.judgeSource(source)) {
      storedData = storedCreateTaskData[`${source}`] || {};
    } else {
      storedData = storedCreateTaskData.custList || {};
    }

    return storedData;
  }

  @autobind
  storeCreateTaskData(data) {
    const {
      saveCreateTaskData,
      location: { query: { source } },
      storedCreateTaskData,
     } = this.props;
    if (this.judgeSource(source)) {
      saveCreateTaskData({
        ...storedCreateTaskData,
        [source]: data,
      });
    } else {
      saveCreateTaskData({
        ...storedCreateTaskData,
        custList: data,
      });
    }
  }

  render() {
    const {
      dict,
      location,
      createTask,
      getApprovalList,
      approvalList,
      orgId,
      push,
      isShowApprovalModal,
      isApprovalListLoadingEnd,
      onCancel,
      onCloseTab,
      generateTemplateId,
      templateId,
      creator,
      sendCustsServedByPostnResult,
      isSendCustsServedByPostn,
    } = this.props;

    return (
      <div className={styles.taskInner}>
        <TaskFormFlowStep
          location={location}
          dict={dict}
          saveCreateTaskData={this.storeCreateTaskData}
          storedCreateTaskData={this.getStoredCreateTaskData()}
          createTask={createTask}
          approvalList={approvalList}
          getApprovalList={getApprovalList}
          parseQuery={this.parseQuery}
          push={push}
          orgId={orgId}
          onCloseTab={onCloseTab}
          isShowApprovalModal={isShowApprovalModal}
          isApprovalListLoadingEnd={isApprovalListLoadingEnd}
          onCancel={onCancel}
          generateTemplateId={generateTemplateId}
          templateId={templateId}
          creator={creator}
          sendCustsServedByPostnResult={sendCustsServedByPostnResult}
          isSendCustsServedByPostn={isSendCustsServedByPostn}
        />
      </div>
    );
  }
}
