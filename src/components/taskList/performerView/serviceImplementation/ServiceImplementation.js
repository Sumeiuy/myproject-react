/*
 * @Description: 服务实施
 * @Author: WangJunjun
 * @Date: 2018-05-22 14:52:01
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-06-15 15:02:11
 */

import React, { PureComponent } from 'react';
import { Prompt } from 'dva/router';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Affix, message } from 'antd';
import contains from 'rc-util/lib/Dom/contains';
import Header from './Header';
import ListSwiper from './ListSwiper';
import CustomerProfile from './CustomerProfile';
import CustomerDetail from './CustomerDetail';
import SimpleDisplayBlock from './SimpleDisplayBlock';
import ServiceRecordForm from './ServiceRecordForm';
import EmptyData from './EmptyData';
import { PHONE } from './config';
import { serveWay as serveWayUtil } from '../config/code';
import { flow, task } from '../config';
import { fsp } from '../../../../helper';
import styles from './serviceImplementation.less';
import {
  POSTCOMPLETED_CODE,
  defaultPerformerViewCurrentTab,
} from '../../../../routes/taskList/config';
// 默认的任务筛选值
const TASKSTATE_NOTSTARTED = '10';

// 这个是防止页面里有多个class重复，所以做个判断，必须包含当前节点
// 如果找不到无脑取第一个就行
const getStickyTarget = (currentNode) => {
  const containers = document.querySelectorAll('.sticky-container');
  return (currentNode && _.find(
    containers,
    element => contains(element, currentNode),
  )) || containers[0];
};

/**
 * 将数组对象中的id和name转成对应的key和value
 * @param {*} arr 原数组
 * eg: [{ id: 1, name: '11', childList: [] }] 转成 [{ key: 1, value: '11', children: [] }]
 */
function transformCustFeecbackData(arr = []) {
  return arr.map((item = {}) => {
    const obj = {
      key: String(item.id),
      value: item.name || item.parentClassName,
    };
    if (item.feedbackList && item.feedbackList.length) {
      obj.children = transformCustFeecbackData(item.feedbackList);
    }
    if (item.childList && item.childList.length) {
      obj.children = transformCustFeecbackData(item.childList);
    }
    return obj;
  });
}

export default class ServiceImplementation extends PureComponent {
  static propTypes = {
    searchCustomer: PropTypes.func.isRequired,
    customerList: PropTypes.array,
    currentId: PropTypes.string.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    parameter: PropTypes.object.isRequired,
    changeParameter: PropTypes.func.isRequired,
    targetCustList: PropTypes.object.isRequired,
    performerViewCurrentTab: PropTypes.string.isRequired,
    changePerformerViewTab: PropTypes.func.isRequired,
    isFold: PropTypes.bool.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    targetCustDetail: PropTypes.object.isRequired,
    servicePolicy: PropTypes.string,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    isCustIncomeRequested: PropTypes.bool,
    addServeRecord: PropTypes.func.isRequired,
    currentMotServiceRecord: PropTypes.object.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    modifyLocalTaskList: PropTypes.func.isRequired,
    getTaskDetailBasicInfo: PropTypes.func.isRequired,
    serviceRecordInfo: PropTypes.object.isRequired,
    resetServiceRecordInfo: PropTypes.func.isRequired,
    statusCode: PropTypes.string,
    taskFeedbackList: PropTypes.array,
    attachmentList: PropTypes.array.isRequired,
    eventId: PropTypes.string.isRequired,
    // 任务类型：自建还是MOT
    taskTypeCode: PropTypes.string.isRequired,
    serviceTypeCode: PropTypes.string.isRequired,
    serviceTypeName: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    deleteFileResult: PropTypes.array,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    // 涨乐财富通服务方式下的客户反馈列表以及查询方法
    queryCustFeedbackList4ZLFins: PropTypes.func.isRequired,
    custFeedbackList: PropTypes.array.isRequired,
    // 涨乐财富通服务方式下的审批人列表以及查询方法
    queryApprovalList: PropTypes.func.isRequired,
    zhangleApprovalList: PropTypes.array.isRequired,
    // 投资建议文本撞墙检测
    testWallCollision: PropTypes.func.isRequired,
    // 投资建议文本撞墙检测是否有股票代码
    testWallCollisionStatus: PropTypes.bool.isRequired,
    addCallRecord: PropTypes.func,
    toggleServiceRecordModal: PropTypes.func,
    queryTargetCustDetail: PropTypes.func.isRequired,
    getPageSize: PropTypes.func.isRequired,
  }

  static defaultProps = {
    customerList: [],
    servicePolicy: '',
    statusCode: '',
    taskFeedbackList: [],
    deleteFileResult: [],
    filesList: [],
    addCallRecord: _.noop,
    toggleServiceRecordModal: _.noop,
    isCustIncomeRequested: false,
  }

  static contextTypes = {
    dict: PropTypes.object,
    empInfo: PropTypes.object,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { targetCustList } = nextProps;
    // props上的服务实施列表上数据变化，将服务实施的列表存到state里面
    if (targetCustList !== prevState.propsTargetCustList) {
      return {
        targetCustList,
        propsTargetCustList: targetCustList,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { targetCustList } = props;
    this.state = {
      // Fsp页面左侧菜单是否被折叠
      isFoldFspLeftMenu: fsp.isFSPLeftMenuFold(),
      // 当前服务实施列表的数据
      targetCustList,
      propsTargetCustList: targetCustList,
    };
  }

  componentDidMount() {
    const { isFold, getPageSize } = this.props;
    const isFoldFspLeftMenu = fsp.isFSPLeftMenuFold();
    const newPageSize = getPageSize(isFoldFspLeftMenu, isFold);
    // 首次进入，请求服务实施列表，参数为默认值
    this.queryTargetCustList({
      state: TASKSTATE_NOTSTARTED,
      pageSize: newPageSize,
      pageNum: 1,
    });
    // 给FSP折叠菜单按钮注册点击事件
    window.onFspSidebarbtn(this.handleFspLeftMenuClick);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isFoldFspLeftMenu } = this.state;
    const { isFold, getPageSize, currentId } = this.props;
    const pageSize = getPageSize(isFoldFspLeftMenu, isFold);
    // 左侧列表或者左侧菜单发生折叠状态时，需要重新请求服务实施列表的数据
    if (
      prevProps.isFold !== isFold
      || prevState.isFoldFspLeftMenu !== isFoldFspLeftMenu
    ) {
      const { parameter } = this.props;
      const { rowId, assetSort, state, activeIndex } = parameter;
      const pageNum = Math.ceil(parseInt(activeIndex, 10) / pageSize);
      this.queryTargetCustList({
        state,
        rowId,
        assetSort,
        pageSize,
        pageNum,
      });
    }
    // 任务切换时，重新请求服务实施列表，参数为默认值
    if (prevProps.currentId !== currentId) {
      this.queryTargetCustList({
        state: TASKSTATE_NOTSTARTED,
        pageSize,
        pageNum: 1,
      });
    }
  }

  componentWillUnmount() {
    // 移除FSP折叠菜单按钮注册的点击事件
    window.offFspSidebarbtn(this.handleFspLeftMenuClick);
  }

  // FSP折叠菜单按钮被点击
  @autobind
  handleFspLeftMenuClick() {
    // 是否折叠了fsp左侧菜单
    const isFoldFspLeftMenu = fsp.isFSPLeftMenuFold();
    this.setState({ isFoldFspLeftMenu });
  }

  // 状态筛选
  @autobind
  handleStateChange({ value = '' }) {
    const { parameter, changeParameter } = this.props;
    const { targetCustList: { page: { pageSize } } } = this.state;
    const { rowId, assetSort } = parameter;
    changeParameter({ state: value, activeIndex: '1', preciseInputValue: '1' })
      .then(() => {
        this.queryTargetCustList({
          state: value,
          rowId,
          assetSort,
          pageSize,
          pageNum: 1,
        });
      });
  }

  // 客户筛选
  @autobind
  handleCustomerChange({ value = {} }) {
    const { parameter, changeParameter } = this.props;
    const { targetCustList: { page: { pageSize } } } = this.state;
    const { state, assetSort } = parameter;
    changeParameter({ rowId: value.rowId || '', activeIndex: '1', preciseInputValue: '1' })
      .then(() => {
        this.queryTargetCustList({
          rowId: value.rowId || '',
          state,
          assetSort,
          pageSize,
          pageNum: 1,
        });
      });
  }

  // 资产排序
  @autobind
  handleAssetSort(obj) {
    const assetSort = obj.isDesc ? 'desc' : 'asc';
    const { parameter, changeParameter } = this.props;
    const { targetCustList: { page: { pageSize, pageNum } } } = this.state;
    const { state, rowId } = parameter;
    changeParameter({ assetSort, activeIndex: '1', preciseInputValue: '1' })
      .then(() => {
        this.queryTargetCustList({
          rowId,
          state,
          assetSort,
          pageSize,
          pageNum,
        });
      });
  }

  // 精准搜索框输入值变化
  @autobind
  handlePreciseQueryChange(e) {
    const value = e.target.value;
    const reg = /^([0-9]*)?$/;
    const { changeParameter } = this.props;
    const { targetCustList: { page: { totalCount } } } = this.state;
    // 限制输入框中只能输1到客户总数之间的正整数
    if (value === '' || (!isNaN(value) && reg.test(value) && value > 0 && value <= totalCount)) {
      changeParameter({ preciseInputValue: value });
    }
  }

  // 处理精确查找输入框enter搜索
  @autobind
  handlePreciseQueryEnterPress(e) {
    if (e.keyCode === 13) {
      const value = e.target.value;
      if (!value) return;
      const { parameter, changeParameter } = this.props;
      const { targetCustList: { page: { pageSize } } } = this.state;
      // const newValue = value > totalCount ? totalCount : value;
      changeParameter({ activeIndex: value }).then(() => {
        const { rowId, state, assetSort } = parameter;
        const pageNum = Math.ceil(parseInt(value, 10) / pageSize);
        this.queryTargetCustList({
          rowId,
          state,
          assetSort,
          pageSize,
          pageNum,
          isGetFirstItemDetail: false,
        }).then(() => {
          const { queryTargetCustDetail, currentId } = this.props;
          const { targetCustList: { list = [], page: { totalCount } } } = this.state;
          // 当value大于总数totalCount的时候，取totalCount
          const newValue = value > totalCount ? totalCount : value;
          // 根据当前的activeIndex找到在当前列表中的数据，再去查询该条数据的详情
          const index = parseInt(newValue, 10) % pageSize;
          const { custId, missionFlowId } = list[index - 1];
          queryTargetCustDetail({
            custId,
            missionId: currentId,
            missionFlowId,
          });
        });
      });
    }
  }

  // 点击了列表中的客户
  @autobind
  handleCustomerClick(obj = {}) {
    const { changeParameter, currentId, queryTargetCustDetail } = this.props;
    changeParameter({
      activeIndex: obj.activeIndex,
      currentCustomer: obj.currentCustomer,
      preciseInputValue: obj.activeIndex,
    }).then(() => {
      const { custId, missionFlowId } = obj.currentCustomer;
      queryTargetCustDetail({
        custId,
        missionId: currentId,
        missionFlowId,
      });
    });
  }

  // 客户列表左右按钮翻页
  @autobind
  handlePageChange(pageNum) {
    const { parameter, changeParameter } = this.props;
    const { targetCustList: { page: { pageSize } } } = this.state;
    const { rowId, assetSort, state } = parameter;
    const activeIndex = ((pageNum - 1) * pageSize) + 1;
    changeParameter({
      activeIndex,
      preciseInputValue: activeIndex,
    }).then(() => {
      this.queryTargetCustList({
        state,
        rowId,
        assetSort,
        pageSize,
        pageNum,
      });
    });
  }

  // 查询服务实施客户的列表
  @autobind
  queryTargetCustList(obj) {
    const {
      currentId,
      queryTargetCust,
    } = this.props;
    return queryTargetCust({
      ...obj,
      missionId: currentId,
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

  // 添加服务记录
  @autobind
  addServiceRecord({
    postBody,
    callback = _.noop,
    phoneCallback = _.noop,
    noHint = false,
    callId = '',
  }) {
    const {
      addServeRecord,
      queryCustUuid,
      modifyLocalTaskList,
      currentId,
      getTaskDetailBasicInfo,
      currentMotServiceRecord: { id },
      serviceRecordInfo,
      targetCustDetail,
    } = this.props;
    const currentMissionFlowId = targetCustDetail.missionFlowId;
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
          this.reloadTargetCustInfo(() => {
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
          phoneCallback();

          this.saveServiceRecordAndPhoneRelation(currentMotServiceRecord, callId);
        }
      });
  }

  reloadTargetCustInfo(callback) {
    const { currentId, getCustDetail, targetCustDetail } = this.props;
    const { custId, missionFlowId } = targetCustDetail;
    getCustDetail({
      missionId: currentId,
      custId,
      missionFlowId,
      callback,
    });
  }

  // 更新组件state的list信息
  @autobind
  updateList({ missionFlowId, flowStatus, zlApprovalCode, serveWay }, callback = _.noop) {
    const { targetCustList = {}, targetCustList: { list = [] } } = this.state;
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
      targetCustList: {
        ...targetCustList,
        list: newList,
      },
    });
  }

  /**
   * 通话的uuid关联服务记录
   */
  @autobind
  saveServiceRecordAndPhoneRelation(currentMotServiceRecord = {}, callId) {
    if (callId) {
      this.props.addCallRecord({
        uuid: callId,
        projectId: currentMotServiceRecord.id,
      });
    }
  }

  render() {
    const { dict = {}, empInfo } = this.context;
    const {
      currentId, parameter, targetCustDetail, servicePolicy, isFold,
      serviceRecordInfo, currentMotServiceRecord, resetServiceRecordInfo,
      monthlyProfits, isCustIncomeRequested, getCustIncome, statusCode, custUuid,
      serviceTypeCode, ceFileDelete, deleteFileResult, getCeFileList,
      taskFeedbackList, attachmentList, eventId, taskTypeCode,
      queryCustFeedbackList4ZLFins, custFeedbackList, queryApprovalList, zhangleApprovalList,
      testWallCollision, testWallCollisionStatus, toggleServiceRecordModal, performerViewCurrentTab,
    } = this.props;
    const {
      targetCustList,
      targetCustList: { list: currentTargetList },
      isFoldFspLeftMenu,
    } = this.state;
    const {
      missionStatusCode, missionStatusValue, missionFlowId,
      serviceTips, serviceWayName, serviceWayCode, serviceDate,
      serviceRecord, customerFeedback, feedbackDate, custId,
      serviceContent, // 涨乐财富通的服务内容
    } = targetCustDetail;
    // 判断当前任务状态是结果跟踪或者完成状态，则为只读
    // 判断任务流水客户状态，处理中 和 未开始， 则为可编辑
    // TODO 新需求需要针对涨乐财富通的服务方式来判断状态是否可读
    // 涨乐财富通服务方式下，只有审批中和已完成状态，才属于只读状态
    let isReadOnly;
    const { caller = '', autoGenerateRecordInfo = {} } = serviceRecordInfo;
    // 判断是不是当前选中任务打的电话
    const isCurrentMissionPhoneCall = caller === PHONE
      && missionFlowId === autoGenerateRecordInfo.missionFlowId;
    if (isCurrentMissionPhoneCall) {
      // 打电话调用时，服务记录表单可编辑
      isReadOnly = false;
    } else {
      isReadOnly = this.judgeIsReadyOnly({
        statusCode,
        serviceStatusCode: missionStatusCode,
        serviceWayCode,
      });
    }
    // 涨乐财富通中才有审批和驳回状态
    const isReject = this.isRejct({ serviceStatusCode: missionStatusCode, serviceWayCode });
    // 按照添加服务记录需要的服务类型和任务反馈联动的数据结构来构造数据
    const motCustfeedBackDict = transformCustFeecbackData(taskFeedbackList) || [];
    // 服务记录的formData
    const serviceReocrd = {
      serviceTips,
      serviceWayName,
      serviceWayCode,
      serviceStatusName: missionStatusValue,
      serviceStatusCode: missionStatusCode,
      serviceDate,
      serviceRecord,
      customerFeedback,
      feedbackDate,
      custId,
      custUuid,
      missionFlowId,
      motCustfeedBackDict,
      attachmentList,
      serviceContent,
      // 当前用户选择的左侧列表的任务编号ID
      missionId: currentId,
      // 由于如果将eventId和taskTypeCode使用props传递，则不会子组件里面更新到state中去
      // 所以这些值全部通过子组件ServiceRecordForm的formData统一传递
      eventId,
      taskTypeCode,
      serviceTypeCode,
    };
    // fsp左侧菜单和左侧列表折叠状态变化，强制更新affix、文字折叠区域
    const leftFoldState = `${isFoldFspLeftMenu}${isFold}`;

    const affixNode = (
      <div>
        <div className={styles.listSwiperBox}>
          <ListSwiper
            targetCustList={targetCustList}
            parameter={parameter}
            containerClass={styles.listSwiper}
            currentTargetList={currentTargetList}
            onCustomerClick={this.handleCustomerClick}
            onPageChange={this.handlePageChange}
          />
        </div>
        <CustomerProfile
          currentId={currentId}
          taskTypeCode={taskTypeCode}
          addServeRecord={this.addServiceRecord}
          motCustfeedBackDict={motCustfeedBackDict}
          targetCustDetail={targetCustDetail}
          toggleServiceRecordModal={toggleServiceRecordModal}
        />
      </div>
    );
    return (
      <div className={styles.serviceImplementation} ref={ref => this.container = ref}>
        <Header
          {...this.props}
          {...this.state}
          dict={dict}
          handleStateChange={this.handleStateChange}
          handleCustomerChange={this.handleCustomerChange}
          handleAssetSort={this.handleAssetSort}
          handlePreciseQueryChange={this.handlePreciseQueryChange}
          handlePreciseQueryEnterPress={this.handlePreciseQueryEnterPress}
        />
        {
          _.isEmpty(currentTargetList) ?
            <EmptyData /> :
            <div>
              {
                /** 当选中服务实施列表tab的时候，给头部加一个固定效果 */
                performerViewCurrentTab === defaultPerformerViewCurrentTab ?
                  <Affix
                    key={leftFoldState}
                    target={() => getStickyTarget(this.container)}
                  >
                    {affixNode}
                  </Affix>
                  : affixNode
              }
              <div className={styles.taskDetail}>
                <CustomerDetail
                  currentId={currentId}
                  targetCustDetail={targetCustDetail}
                  monthlyProfits={monthlyProfits}
                  isCustIncomeRequested={isCustIncomeRequested}
                  getCustIncome={getCustIncome}
                  leftFoldState={leftFoldState}
                />
                <SimpleDisplayBlock
                  title="服务策略"
                  data={servicePolicy}
                  currentId={currentId}
                  missionFlowId={missionFlowId}
                  leftFoldState={leftFoldState}
                />
                <SimpleDisplayBlock
                  title="任务提示"
                  data={targetCustDetail.serviceTips}
                  currentId={currentId}
                  missionFlowId={missionFlowId}
                  leftFoldState={leftFoldState}
                />
                <ServiceRecordForm
                  dict={dict}
                  empInfo={empInfo}
                  addServeRecord={this.addServiceRecord}
                  isReadOnly={isReadOnly}
                  isReject={isReject}
                  statusCode={statusCode}
                  isEntranceFromPerformerView
                  isFold={isFold}
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
                  serviceCustId={custId}
                  isCurrentMissionPhoneCall={isCurrentMissionPhoneCall}
                />
              </div>
            </div>
        }
        <Prompt
          message={location => (
            location.pathname.startsWith('/taskList')
              ? true : '离开本页面可能会丢失操作的数据，是否离开？'
          )}
        />
      </div>
    );
  }
}
