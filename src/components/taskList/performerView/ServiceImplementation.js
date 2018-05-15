/**
 * @fileOverview components/taskList/performerView/ServiceImplementation.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的服务实施模块
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message } from 'antd';

import TargetCustomer from './TargetCustomer';
import ServiceRecordForm from './ServiceRecordForm';
import { POSTCOMPLETED_CODE } from '../../../routes/taskList/config';
import { flow, task } from './config';
import { serveWay as serveWayUtil } from './config/code';

const PHONE = 'phone';

/**
 * 将数组对象中的id和name转成对应的key和value
 * @param {*} arr 原数组
 * eg: [{ id: 1, name: '11', childList: [] }] 转成 [{ key: 1, value: '11', children: [] }]
 */
function transformCustFeecbackData(arr = []) {
  return _.map(arr, (item) => {
    const obj = {
      key: String(item.id),
      value: item.name,
    };
    if (item.childList && item.childList.length) {
      obj.children = transformCustFeecbackData(item.childList);
    }
    return obj;
  });
}

export default class ServiceImplementation extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
    };
    // 服务实施客户Id
    this.serviceCustId = props.list[0].custId || '';
  }

  componentWillReceiveProps(nextProps) {
    const { list } = this.props;
    const {
      list: nextList,
    } = nextProps;
    if (nextList !== list) {
      this.setState({
        list: nextList,
      });
      this.serviceCustId = nextList[0].custId || '';
    }
  }

  @autobind
  addServiceRecord({
    postBody,
    callback = _.noop,
    callbackOfPhone = _.noop,
    noHint = false,
  }) {
    const {
      addServeRecord,
      reloadTargetCustInfo,
      queryCustUuid,
      modifyLocalTaskList,
      currentId,
      getTaskDetailBasicInfo,
      currentMotServiceRecord: { id },
      serviceRecordInfo,
    } = this.props;
    const currentMissionFlowId = this.getCurrentMissionFlowId();
    const { caller = '', id: missionFlowId, autoGenerateRecordInfo } = serviceRecordInfo;
    const { flowStatus = '', serveTime = '', serveWay = '' } = autoGenerateRecordInfo;
    // 打电话生成服务记录后，再去添加服务记录走的是更新过程，需要传自动生成的那条服务记录的id,
    // 服务状态为完成，code=30
    const payload = (caller === PHONE && currentMissionFlowId === missionFlowId) ?
      { ...postBody, id, flowStatus, serveTime, serveWay } : postBody;
    // 此处需要针对涨乐财富通服务方式特殊处理
    // 涨乐财富通服务方式下，在postBody下会多一个zlApprovalCode非参数字段
    // 执行提交服务记录的接口
    addServeRecord(_.omit(payload, ['zlApprovalCode']))
    .then(() => {
      const { currentMotServiceRecord } = this.props;
      // 服务记录添加未成功时，后端返回failure
      if (!_.isEmpty(currentMotServiceRecord.id) && currentMotServiceRecord.id !== 'failure') {
        // 服务记录添加成功后重新加载当前目标客户的详细信息
        reloadTargetCustInfo(() => {
          this.updateList(postBody, callback);
          // 添加服务记录服务状态为’完成‘时，更新新左侧列表，重新加载基本信息
          if (postBody.flowStatus === POSTCOMPLETED_CODE) {
            // 重新加载基本信息,不清除服务实施客户列表中当前选中客户状态信息和筛选值、页码
            getTaskDetailBasicInfo({ taskId: currentId, isClear: false });
            // 更新新左侧列表
            modifyLocalTaskList({ missionId: currentId });
          }
        });
        // 添加服务记录成功之后，重新获取custUuid
        queryCustUuid();
        // this.updateList(postBody);
        if (!noHint) {
          message.success('添加服务记录成功');
        }
        // 保存打电话自动创建的服务记录的信息或更新服务记录后删除打电话保存的服务记录
        callbackOfPhone();
      }
    });
  }

  // 更新组件state的list信息
  @autobind
  updateList({ missionFlowId, flowStatus, zlApprovalCode, serveWay }, callback = _.noop) {
    const { list } = this.state;
    const newList = _.map(list, (item) => {
      if (item.missionFlowId === missionFlowId) {
        if (
          flow.isComplete(flowStatus)
          || flow.isProcess(flowStatus)
        ) {
          // 此处因为涨乐财富通的服务方式的状态Code与以前普通的服务方式不一样
          const statusCodeTemp = serveWayUtil.isZhangle(serveWay) ? zlApprovalCode : flowStatus;
          const { name, id } = flow.getFlowStatus(statusCodeTemp);
          return {
            ...item,
            missionStatusCode: `${id}`,
            missionStatusValue: name,
          };
        }
      }
      return item;
    });
    if (flow.isProcess(flowStatus)) {
      // 如果是处理中，需要将upload list清除
      callback();
    }
    this.setState({
      list: newList,
    });
  }

  @autobind
  judgeMissionStatus(typeCode) {
    return task.isResultTrack(typeCode) || task.isFinished(typeCode);
  }

  // 涨乐财富通只读状态
  @autobind
  judgeZhangeLeStatus(statusCode) {
    // 已完成 || 审批中
    return flow.isComplete(statusCode) || flow.isApproval(statusCode);
  }

  // 当前流程是可编辑流程
  @autobind
  isEditableStatus(code) {
    return flow.isUnStart(code) || flow.isProcess(code);
  }

  // 判断服务记录是否是只读状态
  @autobind
  judgeIsReadyOnly({ serviceWayCode, statusCode, serviceStatusCode }) {
    if (serveWayUtil.isZhangle(serviceWayCode)) {
      // 如果是涨乐财富通的服务方式
      // 判断是否 审批中 或者 已完成
      return this.judgeZhangeLeStatus(serviceStatusCode);
    }
    return this.judgeMissionStatus(statusCode)
    || !this.isEditableStatus(serviceStatusCode);
  }

  // 涨乐财富通中的驳回状态
  @autobind
  isRejct({ serviceWayCode, serviceStatusCode }) {
    if (serveWayUtil.isZhangle(serviceWayCode)) {
      return flow.isReject(serviceStatusCode);
    }
    return false;
  }

  /**
   * 获取当前选中的流水任务id
   */
  @autobind
  getCurrentMissionFlowId() {
    const { list } = this.state;
    const {
      parameter: {
        targetMissionFlowId = '',
      },
    } = this.props;
    return targetMissionFlowId || (list[0] || {}).missionFlowId;
  }

  render() {
    const { list } = this.state;
    const serviceCustId = this.serviceCustId;
    const {
      currentId,
      dict,
      empInfo,
      isFold,
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      getCustIncome,
      monthlyProfits,
      custIncomeReqState,
      targetCustDetail,
      changeParameter,
      queryCustUuid,
      custUuid,
      getCustDetail,
      serviceTypeCode,
      serviceTypeName,
      ceFileDelete,
      getCeFileList,
      filesList,
      deleteFileResult,
      taskFeedbackList,
      attachmentList,
      statusCode,
      isTaskFeedbackListOfNone,
      custFeedbackList,
      queryCustFeedbackList4ZLFins,
      taskTypeCode,
      eventId,
      zhangleApprovalList,
      queryApprovalList,
      toggleServiceRecordModal,
      serviceRecordInfo,
      currentMotServiceRecord,
      resetServiceRecordInfo,
      // 投资建议文本撞墙检测
      testWallCollision,
      // 投资建议文本撞墙检测是否有股票代码
      testWallCollisionStatus,
    } = this.props;
    // 获取当前选中的数据的missionFlowId
    const currentMissionFlowId = this.getCurrentMissionFlowId();

    const currentCustomer = _.find(list, o => o.missionFlowId === currentMissionFlowId);
    let serviceStatusName = '';
    let serviceStatusCode = '';
    let missionFlowId = '';
    if (currentCustomer) {
      serviceStatusCode = currentCustomer.missionStatusCode;
      serviceStatusName = currentCustomer.missionStatusValue;
      missionFlowId = currentCustomer.missionFlowId;
    }

    const {
      serviceTips,
      serviceWayName,
      serviceWayCode,
      serviceDate,
      serviceRecord,
      customerFeedback,
      feedbackDate,
      custId,
      serviceContent, // 涨乐财富通的服务内容
    } = targetCustDetail;

    // 按照添加服务记录需要的服务类型和任务反馈联动的数据结构来构造数据
    const motCustfeedBackDict = [{
      key: String(serviceTypeCode),
      value: serviceTypeName,
      children: transformCustFeecbackData(taskFeedbackList),
    }];
    // 服务记录的props
    const serviceReocrd = {
      serviceTips,
      serviceWayName,
      serviceWayCode,
      serviceStatusName,
      serviceStatusCode,
      taskFeedbackList,
      serviceDate,
      serviceRecord,
      customerFeedback,
      feedbackDate,
      custId,
      custUuid,
      missionFlowId,
      motCustfeedBackDict,
      attachmentList,
      isTaskFeedbackListOfNone,
      serviceContent,
      // 当前用户选择的左侧列表的任务编号ID
      missionId: currentId,
      // 由于如果将eventId和taskTypeCode使用props传递，则不会子组件里面更新到state中去
      // 所以这些值全部通过子组件ServiceRecordForm的formData统一传递
      eventId,
      taskTypeCode,
      serviceTypeCode,
    };

    // 判断当前任务状态是结果跟踪或者完成状态，则为只读
    // 判断任务流水客户状态，处理中 和 未开始， 则为可编辑
    // TODO 新需求需要针对涨乐财富通的服务方式来判断状态是否可读
    // 涨乐财富通服务方式下，只有审批中和已完成状态，才属于只读状态
    let isReadOnly;
    if (serviceRecordInfo.caller === PHONE) {
      // 打电话调用时，服务记录表单可编辑
      isReadOnly = false;
    } else {
      isReadOnly = this.judgeIsReadyOnly({ statusCode, serviceStatusCode, serviceWayCode });
    }

    // 涨乐财富通中才有审批和驳回状态
    const isReject = this.isRejct({ serviceStatusCode, serviceWayCode });

    return (
      <div>
        <TargetCustomer
          list={list}
          currentId={currentId}
          isFold={isFold}
          currentMissionFlowId={currentMissionFlowId}
          handleCollapseClick={handleCollapseClick}
          dict={dict}
          getServiceRecord={getServiceRecord}
          serviceRecordData={serviceRecordData}
          getCustIncome={getCustIncome}
          custIncomeReqState={custIncomeReqState}
          monthlyProfits={monthlyProfits}
          targetCustDetail={targetCustDetail}
          changeParameter={changeParameter}
          queryCustUuid={queryCustUuid}
          getCustDetail={getCustDetail}
          getCeFileList={getCeFileList}
          filesList={filesList}
          toggleServiceRecordModal={toggleServiceRecordModal}
          addServeRecord={this.addServiceRecord}
          motCustfeedBackDict={motCustfeedBackDict}
          currentCustomer={currentCustomer}
          getServiceCustId={id => this.setServiceCustId(id)}
          taskTypeCode={taskTypeCode}
        />
        {
          (!_.isEmpty(taskFeedbackList) && !_.isEmpty(motCustfeedBackDict))
          ? <ServiceRecordForm
            dict={dict}
            empInfo={empInfo}
            addServeRecord={this.addServiceRecord}
            isReadOnly={isReadOnly}
            isReject={isReject}
            statusCode={statusCode}
            isEntranceFromPerformerView
            isFold={isFold}
            queryCustUuid={queryCustUuid}
            custUuid={custUuid}
            formData={serviceReocrd}
            ceFileDelete={ceFileDelete}
            deleteFileResult={deleteFileResult}
            getCeFileList={getCeFileList}
            queryCustFeedbackList4ZLFins={queryCustFeedbackList4ZLFins}
            custFeedbackList={custFeedbackList}
            queryApprovalList={queryApprovalList}
            zhangleApprovalList={zhangleApprovalList}
            serviceRecordInfo={serviceRecordInfo}
            currentMotServiceRecord={currentMotServiceRecord}
            resetServiceRecordInfo={resetServiceRecordInfo}
            testWallCollision={testWallCollision}
            testWallCollisionStatus={testWallCollisionStatus}
            serviceCustId={serviceCustId}
          /> : null
        }
      </div>
    );
  }
}

ServiceImplementation.propTypes = {
  currentId: PropTypes.string.isRequired,
  addServeRecord: PropTypes.func.isRequired,
  dict: PropTypes.object,
  empInfo: PropTypes.object,
  isFold: PropTypes.bool,
  list: PropTypes.array.isRequired,
  handleCollapseClick: PropTypes.func.isRequired,
  getServiceRecord: PropTypes.func.isRequired,
  serviceRecordData: PropTypes.object,
  getCustIncome: PropTypes.func.isRequired,
  monthlyProfits: PropTypes.object.isRequired,
  custIncomeReqState: PropTypes.bool,
  targetCustDetail: PropTypes.object.isRequired,
  parameter: PropTypes.object.isRequired,
  changeParameter: PropTypes.func.isRequired,
  queryCustUuid: PropTypes.func.isRequired,
  custUuid: PropTypes.string.isRequired,
  getCustDetail: PropTypes.func.isRequired,
  serviceTypeCode: PropTypes.string.isRequired,
  serviceTypeName: PropTypes.string,
  ceFileDelete: PropTypes.func.isRequired,
  getCeFileList: PropTypes.func.isRequired,
  filesList: PropTypes.array,
  deleteFileResult: PropTypes.array,
  taskFeedbackList: PropTypes.array,
  currentMotServiceRecord: PropTypes.object.isRequired,
  reloadTargetCustInfo: PropTypes.func.isRequired,
  attachmentList: PropTypes.array.isRequired,
  statusCode: PropTypes.string,
  isTaskFeedbackListOfNone: PropTypes.bool,
  modifyLocalTaskList: PropTypes.func.isRequired,
  getTaskDetailBasicInfo: PropTypes.func.isRequired,
  // 涨乐财富通服务方式下的客户反馈列表以及查询方法
  queryCustFeedbackList4ZLFins: PropTypes.func.isRequired,
  custFeedbackList: PropTypes.array.isRequired,
  // 事件ID
  eventId: PropTypes.string.isRequired,
  // 任务类型：自建还是MOT
  taskTypeCode: PropTypes.string.isRequired,
  // 涨乐财富通服务方式下的审批人列表以及查询方法
  queryApprovalList: PropTypes.func.isRequired,
  zhangleApprovalList: PropTypes.array.isRequired,
  toggleServiceRecordModal: PropTypes.func.isRequired,
  serviceRecordInfo: PropTypes.object.isRequired,
  resetServiceRecordInfo: PropTypes.func.isRequired,
  // 投资建议文本撞墙检测
  testWallCollision: PropTypes.func.isRequired,
  // 投资建议文本撞墙检测是否有股票代码
  testWallCollisionStatus: PropTypes.bool.isRequired,
};

ServiceImplementation.defaultProps = {
  dict: {},
  empInfo: {},
  isFold: false,
  serviceRecordData: {},
  custIncomeReqState: false,
  filesList: [],
  deleteFileResult: [],
  taskFeedbackList: [],
  serviceTypeName: '',
  statusCode: '',
  isTaskFeedbackListOfNone: false,
};
