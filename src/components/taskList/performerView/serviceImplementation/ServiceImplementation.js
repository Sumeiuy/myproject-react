/*
 * @Description: 服务实施
 * @Author: WangJunjun
 * @Date: 2018-05-22 14:52:01
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-02 17:22:24
 */

import React, { PureComponent } from 'react';
import { Prompt } from 'dva/router';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Affix, message, Modal } from 'antd';
import contains from 'rc-util/lib/Dom/contains';
import Header from './Header';
import ListSwiper from './ListSwiper';
import CustomerProfile from './CustomerProfile';
import CustomerDetail from './CustomerDetail';
import SimpleDisplayBlock from './SimpleDisplayBlock';
import ServiceRecordForm from './ServiceRecordForm';
import EmptyData from './EmptyData';
import { PHONE, MSG_ROUTEFORWARD } from './config';
import { serveWay as serveWayUtil } from '../config/code';
import { flow, task } from '../config';
import { fsp } from '../../../../helper';
import logable from '../../../../decorators/logable';
import styles from './serviceImplementation.less';
import {
  POSTCOMPLETED_CODE,
  defaultPerformerViewCurrentTab,
} from '../../../../routes/taskList/config';
import { getServiceState } from './helper';

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
    location: PropTypes.object.isRequired,
    // 左侧列表中当前选中的任务
    currentTask: PropTypes.object.isRequired,
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
      // 当前用户是否操作了表单
      isFormHalfFilledOut: false,
    };
  }

  componentDidMount() {
    const { isFold, getPageSize } = this.props;
    const isFoldFspLeftMenu = fsp.isFSPLeftMenuFold();
    const newPageSize = getPageSize(isFoldFspLeftMenu, isFold);
    // 首次进入，请求服务实施列表
    this.getTaskFlowData(newPageSize);
    // 给FSP折叠菜单按钮注册点击事件
    window.onFspSidebarbtn(this.handleFspLeftMenuClick);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isFoldFspLeftMenu } = this.state;
    const {
      isFold, getPageSize, currentId,
      location: { query },
    } = this.props;
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
      this.getTaskFlowData(pageSize);
    }
    if (query !== prevProps.location.query) {
      // 先判断再setState，避免不必要的渲染
      if (this.state.isFormHalfFilledOut) {
        this.setState({ isFormHalfFilledOut: false }); // eslint-disable-line
      }
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

  // 路由发生变化前确认
  @autobind
  handleRouteForwardComfirmation(callback = _.noop, data) {
    // 当前用户操作了页面的表单
    if (this.state.isFormHalfFilledOut) {
      Modal.confirm({
        title: '请确认',
        content: MSG_ROUTEFORWARD,
        onOk: () => {
          callback(data);
          this.setState({ isFormHalfFilledOut: false });
        },
        onCancel: () => { },
      });
    } else {
      callback(data);
    }
  }

  // 筛选前加一个确认
  @autobind
  handlePrepareFilter(callback = _.noop) {
    return (data) => {
      this.handleRouteForwardComfirmation(callback, data);
    };
  }

  // 状态筛选
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[0].name',
      value: '$args[0].value',
    },
  })
  handleStateChange({ value = [] }) {
    this.props.changeParameter({
      state: value,
      activeIndex: '1',
      preciseInputValue: '1',
    }).then(() => {
      this.queryTargetCustList({
        state: value,
        pageNum: 1,
      });
    });
  }


  // 客户筛选
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[0].name',
      value: '$args[0].value.name',
    },
  })
  handleCustomerChange({ value = {} }) {
    this.props.changeParameter({
      rowId: value.rowId || '',
      activeIndex: '1',
      preciseInputValue: '1',
    }).then(() => {
      this.queryTargetCustList({
        rowId: value.rowId || '',
        pageNum: 1,
      });
    });
  }

  // 资产排序
  @autobind
  @logable({
    type: 'click',
    payload: {
      name: '服务实施列表总资产排序，是否降序',
      value: '$args[0].isDesc',
    },
  })
  handleAssetSort(obj) {
    const assetSort = obj.isDesc ? 'desc' : 'asc';
    this.props.changeParameter({
      assetSort,
      activeIndex: '1',
      preciseInputValue: '1',
    }).then(() => {
      this.queryTargetCustList({
        assetSort,
        pageNum: 1,
      });
    });
  }

  // 精准搜索框输入值变化
  @autobind
  handlePreciseQueryChange(e) {
    const value = e.target.value;
    const reg = /^([0-9]*)?$/;
    const { targetCustList: { page: { totalCount } } } = this.state;
    // 限制输入框中只能输1到客户总数之间的正整数
    if (value === '' || (!isNaN(value) && reg.test(value) && value > 0 && value <= totalCount)) {
      this.props.changeParameter({ preciseInputValue: value });
    }
  }

  // 处理精确查找输入框enter搜索
  @autobind
  handlePreciseQueryEnterPress(e) {
    if (e.keyCode === 13) {
      const value = e.target.value;
      if (!value) return;
      const toChange = () => {
        const { targetCustList: { page: { pageSize } } } = this.state;
        this.props.changeParameter({ activeIndex: value }).then(() => {
          const pageNum = Math.ceil(parseInt(value, 10) / pageSize);
          this.queryTargetCustList({
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
      };
      this.handleRouteForwardComfirmation(toChange);
    }
  }

  // 点击了列表中的客户
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '$args[0].currentCustomer.custName',
      type: '任务流水',
    },
  })
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
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '服务实施列表翻页',
      value: '$args[0]',
    },
  })
  handlePageChange(pageNum) {
    const { targetCustList: { page: { pageSize } } } = this.state;
    const activeIndex = ((pageNum - 1) * pageSize) + 1;
    this.props.changeParameter({
      activeIndex,
      preciseInputValue: activeIndex,
    }).then(() => {
      this.queryTargetCustList({
        pageNum,
      });
    });
  }

  // 查询服务实施客户的列表
  @autobind
  queryTargetCustList(obj = {}) {
    const {
      currentId,
      queryTargetCust,
      parameter,
    } = this.props;
    const { targetCustList: { page: { pageSize, pageNum } } } = this.state;
    const { state, rowId, assetSort } = parameter;
    const payload = {
      missionId: currentId,
      pageSize,
      pageNum,
      state,
      rowId,
      assetSort,
      ...obj,
    };
    return queryTargetCust({
      ...payload,
      state: payload.state.join(','),
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

  // 判断服务状态是否为完成
  isServiceStateCompletion(state) {
    return state === POSTCOMPLETED_CODE;
  }

  // 添加服务记录服务状态为’完成‘时，更新redux中的左侧列表，重新拉取服务端的任务基本信息
  @autobind
  updateAfterFlowStateComplete(flowStatus) {
    if (this.isServiceStateCompletion(flowStatus)) {
      const {
        modifyLocalTaskList,
        currentId,
        getTaskDetailBasicInfo,
      } = this.props;
      // 重新加载基本信息,不清除服务实施客户列表中当前选中客户状态信息和筛选值、页码
      getTaskDetailBasicInfo({ taskId: currentId, isClear: false });
      // 更新redux中的左侧列表
      modifyLocalTaskList({ missionId: currentId });
    }
  }

  // 重新拉取服务端的服务实施客户列表
  @autobind
  updateCustList({ flowStatus }) {
    const { isFormHalfFilledOut } = this.state;
    // 重置当前选中的客户索引和索引查询组件input值
    this.props.changeParameter({
      preciseInputValue: 1,
      activeIndex: 1,
    }).then(() => {
      this.queryTargetCustList({ pageNum: 1 }).then(() => {
        // 添加服务记录服务状态为’完成‘时，更新redux中的左侧列表，重新拉取服务端的任务基本信息
        this.updateAfterFlowStateComplete(flowStatus);
        // 重新加载服务实施客户列表成功后，重置isFormHalfFilledOut字段
        if (isFormHalfFilledOut) {
          this.setState({ isFormHalfFilledOut: false });
        }
      });
    });
  }

  // 添加服务记录
  @autobind
  addServiceRecord({
    postBody,
    callback = _.noop,
    phoneCallback = _.noop,
    // 是否为打电话静默创建
    isSilentAdd = false,
    callId = '',
  }) {
    const {
      addServeRecord,
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
        // 添加服务记录成功， 未成功时，后端返回failure
        if (!_.isEmpty(currentMotServiceRecord.id) && currentMotServiceRecord.id !== 'failure') {
          // 不是打电话静默生成服务记录
          if (!isSilentAdd) {
            message.success('添加服务记录成功');
            // 添加成功后重新拉取服务端的服务实施客户列表
            this.updateCustList(postBody);
          } else {
            // 服务记录添加成功后重新加载当前目标客户的详细信息
            this.reloadTargetCustInfo(() => {
              // 添加成功后更新state中的服务实施客户列表
              this.updateList(postBody, callback);
              // 添加服务记录服务状态为’完成‘时，更新新左侧列表，重新加载任务基本信息
              this.updateAfterFlowStateComplete(postBody.flowStatus);
            });
            // 保存打电话自动创建的服务记录的信息或更新服务记录后删除打电话保存的服务记录
            phoneCallback();
            this.saveServiceRecordAndPhoneRelation(currentMotServiceRecord, callId);
          }
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

  // 更新组件state的服务实施客户列表信息
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
    // 提交服务记录记录成功后，更新state中的客户列表，并将isFormHalfFilledOut恢复默认值
    this.setState({
      targetCustList: {
        ...targetCustList,
        list: newList,
      },
      isFormHalfFilledOut: false,
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

  // 添加服务记录表单数据发生变化
  @autobind
  formDataChange() {
    this.setState({
      isFormHalfFilledOut: true,
    });
  }

  // 跳转前确认处理
  @autobind
  handlePrompt(location) {
    const { location: { pathname, search } } = this.props;
    if (location.pathname === pathname && location.search === search) {
      return false;
    }
    return MSG_ROUTEFORWARD;
  }

  // 根据当前的任务状态去获取对应的服务状态，再去获取服务实施列表数据
  @autobind
  getTaskFlowData(pageSize, pageNum = 1) {
    const { changeParameter, currentTask: { statusCode } } = this.props;
    const stateList = getServiceState(statusCode);
    // 将服务实施的状态记到redux
    changeParameter({ state: stateList }).then(() => {
      this.queryTargetCustList({
        state: stateList,
        pageSize,
        pageNum,
      });
    });
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
      isFoldFspLeftMenu, isFormHalfFilledOut,
    } = this.state;
    const {
      missionStatusCode, missionStatusValue, missionFlowId,
      serviceTips, serviceWayName, serviceWayCode, serviceDate,
      serviceRecord, customerFeedback, feedbackDate, custId,
      serviceContent, // 涨乐财富通的服务内容
      zlcftMsgStatus, // 新增的涨乐财富通服务方式的反馈状态
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
      // 涨乐财富通服务方式反馈状态
      zlcftMsgStatus,
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
            onCustomerClick={this.handlePrepareFilter(this.handleCustomerClick)}
            onPageChange={this.handlePrepareFilter(this.handlePageChange)}
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
          handleStateChange={this.handlePrepareFilter(this.handleStateChange)}
          handleCustomerChange={this.handlePrepareFilter(this.handleCustomerChange)}
          handleAssetSort={this.handlePrepareFilter(this.handleAssetSort)}
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
                  onFormDataChange={this.formDataChange}
                />
              </div>
            </div>
        }
        <Prompt
          when={isFormHalfFilledOut}
          message={this.handlePrompt}
        />
      </div>
    );
  }
}
