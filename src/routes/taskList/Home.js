/**
 * @Author: sunweibin
 * @Date: 2018-04-13 11:57:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-17 10:36:48
 * @description 任务管理首页
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import withRouter from '../../decorators/withRouter';
import ConnectedPageHeader from '../../components/taskList/ConnectedPageHeader';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import PerformerViewDetail from '../../components/taskList/performerView/PerformerViewDetail';
import ManagerViewDetail from '../../components/taskList/managerView/ManagerViewDetail';
import CreatorViewDetail from '../../components/taskList/creatorView/RightPanel';
import ViewList from '../../components/common/appList';
import ViewListRow from '../../components/taskList/ViewListRow';
import pageConfig from '../../components/taskList/pageConfig';
import { openRctTab } from '../../utils';
import { emp, permission, env as envHelper } from '../../helper';
import logable from '../../decorators/logable';
import taskListHomeShape from './taskListHomeShape';
import { getViewInfo } from './helper';

import {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  currentDate,
  beforeCurrentDate60Days,
  dateFormat,
  STATUS_MANAGER_VIEW,
  SYSTEMCODE,
  STATE_EXECUTE_CODE,
  STATE_FINISHED_CODE,
  STATE_ALL_CODE,
} from './config';

// 空函数
const NOOP = _.noop;
// 执行者视图的左侧列表宽度
const LEFT_PANEL_WIDTH = 400;
// 视图配置项
const { taskList } = pageConfig;

// 服务经理维度任务统计分页初始化
const GET_CUST_SCOPE_PAGE_NUM = 1;
const GET_CUST_SCOPE_PAGE_SIZE = 5;

// 找不到反馈类型的时候，前端写死一个和后端一模一样的其它类型，作容错处理
const feedbackListOfNone = [{
  id: 99999,
  name: '其它',
  length: 1,
  childList: [{
    id: 100000,
    name: '其它',
    length: null,
    childList: null,
  }],
}];

@withRouter
export default class PerformerView extends PureComponent {
  static propTypes = taskListHomeShape;

  static defaultProps = {
    priviewCustFileData: {},
    filesList: [],
    custRange: [],
    empInfo: {},
    custFeedback: [],
    answersList: {},
    saveAnswersSucce: false,
  };

  constructor(props) {
    super(props);
    const { location: { query: { missionViewType = '' } } } = props;
    this.hasPermissionOfManagerView = permission.hasPermissionOfManagerView();
    const viewInfo = getViewInfo(missionViewType);

    this.missionView = viewInfo.missionViewList;
    this.state = {
      // 当前视图
      currentView: viewInfo.currentViewType,
      isEmpty: true,
      activeRowIndex: 0,
      typeCode: '',
      taskTypeCode: '',  // 自建任务，mot任务
      typeName: '',
      eventId: '',
      statusCode: '',
      isTaskFeedbackListOfNone: false,
      // 执行中创建者视图右侧展示管理者视图
      isSourceFromCreatorView: false,
    };
  }

  componentDidMount() {
    const { location: { query } } = this.props;
    this.queryAppList(query);
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query } } = nextProps;
    const { location: { query: prevQuery } } = this.props;
    const { currentId, ...otherQuery } = query;
    const { currentId: prevCurrentId, ...otherPrevQuery } = prevQuery;
    if (!_.isEqual(otherQuery, otherPrevQuery)) {
      this.queryAppList(otherQuery);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { list: { resultData } } = this.props;
    if (_.isEmpty(resultData)) {
      return;
    }
    const { typeCode, eventId, currentView } = this.state;
    // 当前视图是执行者视图
    if (
      this.isExecutorView(currentView)
      && (prevState.typeCode !== typeCode || prevState.eventId !== eventId)) {
      this.queryMissionList(typeCode, eventId);
    }
  }

  // 获取列表后再获取某个Detail
  @autobind
  getRightDetail() {
    const {
      list,
      location: { query: { currentId, missionViewType } },
    } = this.props;
    const viewInfo = getViewInfo(missionViewType);
    const resultData = list && list.resultData;
    if (!_.isEmpty(resultData)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      // 默认取第一个item
      let item = resultData[0];
      let itemIndex = '';
      const defaultItem = item;
      const defaultItemIndex = 0;

      if (!_.isEmpty(currentId)) {
        itemIndex = _.findIndex(resultData, o => String(o.id) === currentId);
        // currentId与id比较，在listData里面找不到
        if (itemIndex === -1) {
          // 如果是创建者视图，先比较id是否与currentId一样
          if (this.isInitiatorView(viewInfo.currentViewType)) {
            // 则用currentId与mssnId比较
            const mssnObjectIndex = _.findIndex(resultData, o => String(o.mssnId) === currentId);
            itemIndex = mssnObjectIndex;
            // 如果能找到，并且当前statusCode为执行中，则右侧详情展示管理者视图
            if (itemIndex > -1) {
              item = list.resultData[itemIndex];
            } else {
              // 如果都找不到，则默认取数据的第一条
              item = defaultItem;
              itemIndex = defaultItemIndex;
            }
          } else {
            // 如果都找不到，则默认取数据的第一条
            item = defaultItem;
            itemIndex = defaultItemIndex;
          }
        } else {
          // 如果id与currentId比较，存在，则取数据
          item = list.resultData[itemIndex];
        }
      } else {
        // 不存在currentId
        itemIndex = defaultItemIndex;
      }
      const {
        missionViewType: st,
        typeCode,
        statusCode,
        typeName,
        eventId,
        descText,
      } = item;

      this.setState({
        taskTypeCode: descText,
        currentView: st,
        activeRowIndex: itemIndex,
        typeCode,
        typeName,
        statusCode,
        eventId,
        isSourceFromCreatorView: this.isInitiatorView(st) &&
        this.judgeTaskInApproval(item.statusCode),
      }, () => { this.getDetailByView(item); });
    } else {
      // 没有查到数据时，保存当前的视图状态
      this.setState({
        taskTypeCode: '',
        currentView: viewInfo.currentViewType,
        activeRowIndex: '',
        typeCode: '',
        typeName: '',
        statusCode: '',
        eventId: '',
        isSourceFromCreatorView: false,
      });
    }
  }

  // 执行者视图获取目标客户列表项的对应浮层详情
  @autobind
  getCustDetail({ missionId = '', custId = '', missionFlowId = '', callback = NOOP }) {
    const { queryTargetCustDetail, targetCustList = {} } = this.props;
    const { list = [] } = targetCustList;
    if (_.isEmpty(list)) {
      return;
    }
    const firstItem = list[0] || {};
    queryTargetCustDetail({
      missionId,
      custId: custId || firstItem.custId,
      missionFlowId: missionFlowId || firstItem.missionFlowId,
    }).then(callback);
  }

  /**
   * 获取左侧列表当前选中任务的id
   * 创建者视图中左侧任务状态为 执行中、结果跟踪、结束时，取mssnId
   * 其余任务取id
   */
  @autobind
  getCurrentId() {
    const { list = {}, location: { query: { currentId, missionViewType } } } = this.props;
    if (currentId) {
      return currentId;
    }
    const [firstItem = {}] = list.resultData;
    const currentViewType = getViewInfo(missionViewType).currentViewType;
    if (currentViewType === INITIATOR && this.state.isSourceFromCreatorView) {
      return firstItem.mssnId;
    }
    return firstItem.id;
  }

  // 获取创造者视图的任务详情
  @autobind
  getDetailOfInitiator(record) {
    // 如果当前视图是创建者视图，并且状态是执行中，那么将右侧详情展示成管理者视图
    const { flowId, statusCode } = record;
    if (this.judgeTaskInApproval(statusCode)) {
      this.loadManagerViewDetailContent(record);
    } else {
      // 将创建者视图的flowId存起来，供驳回修改跳转使用
      this.setState({ flowId });
      this.props.getTaskBasicInfo({ flowId, systemCode: SYSTEMCODE });
    }
  }

  // 查询不同视图的详情信息
  @autobind
  getDetailByView(record) {
    const { missionViewType: st } = record;

    switch (st) {
      case INITIATOR:
        this.getDetailOfInitiator(record);
        break;
      case EXECUTOR:
        this.loadDetailContent(record);
        break;
      case CONTROLLER:
        this.loadManagerViewDetailContent(record);
        break;
      default:
        break;
    }
  }

  /**
   * 获取任务实施进度
   */
  @autobind
  getFlowStatus({ orgId }) {
    const {
      countFlowStatus,
    } = this.props;
    const newOrgId = orgId === 'msm' ? '' : orgId;
    // 管理者视图任务实施进度
    countFlowStatus({
      missionId: this.getCurrentId(),
      orgId: newOrgId || emp.getOrgId(),
    });
  }

  /**
   * 获取客户反馈饼图
   */
  @autobind
  getFlowFeedback({ orgId }) {
    const {
      countFlowFeedBack,
    } = this.props;
    const newOrgId = orgId === 'msm' ? '' : orgId;
    // 管理者视图获取客户反馈饼图
    countFlowFeedBack({
      missionId: this.getCurrentId(),
      orgId: newOrgId || emp.getOrgId(),
    });
  }

  /**
   * 获取服务经理维度任务数据详细
   * @param {*string} param0 orgId集合
   */
  @autobind
  getCustManagerScope({
    orgId,
    pageNum = GET_CUST_SCOPE_PAGE_NUM,
    pageSize = GET_CUST_SCOPE_PAGE_SIZE,
  }) {
    const {
      getCustManagerScope,
    } = this.props;
    const newOrgId = orgId === 'msm' ? '' : orgId;
    // 获取服务经理维度任务数据
    getCustManagerScope({
      missionId: this.getCurrentId(),
      orgId: newOrgId || emp.getOrgId(),
      pageNum,
      pageSize,
    });
  }

  @autobind
  getManagerDetailComponentPorps() {
    const {
      dict,
      dict: { missionType = [], missionProgressStatus = [] },
      empInfo,
      location,
      replace,
      push,
      previewCustDetail,
      custDetailResult,
      countFlowFeedBack,
      custFeedback,
      custRange,
      missionImplementationDetail = {},
      mngrMissionDetailInfo = {},
      clearCreateTaskData,
      missionFeedbackData,
      missionFeedbackCount,
      custServedByPostnResult,
      missionReport,
      createMotReport,
      queryMOTServeAndFeedBackExcel,
      queryDistinctCustomerCount,
      distinctCustomerCount,
      custManagerScopeData,
    } = this.props;

    const {
      typeCode,
    } = this.state;
    const { empNum = 0 } = missionImplementationDetail || {};

    return {
      dict,
      empInfo,
      location,
      replace,
      push,
      previewCustDetail,
      custDetailResult,
      onGetCustFeedback: countFlowFeedBack,
      custFeedback,
      custRange,
      countFlowStatus: this.getFlowStatus,
      countFlowFeedBack: this.getFlowFeedback,
      missionImplementationDetail,
      mngrMissionDetailInfo,
      launchNewTask: this.handleCreateBtnClick,
      clearCreateTaskData,
      missionType: typeCode,
      missionTypeDict: missionType,
      exportExcel: this.handleExportExecl,
      missionProgressStatusDic: missionProgressStatus,
      missionFeedbackData,
      missionFeedbackCount,
      serveManagerCount: empNum,
      custServedByPostnResult,
      missionReport,
      createMotReport,
      queryMOTServeAndFeedBackExcel,
      queryDistinctCustomerCount,
      distinctCustomerCount,
      getCustManagerScope: this.getCustManagerScope,
      custManagerScopeData,
    };
  }

  // 获取管理者视图
  @autobind
  getManagerDetailComponent() {
    const managerViewDetailProps = this.getManagerDetailComponentPorps();
    return (
      <ManagerViewDetail
        currentId={this.getCurrentId()}
        {...managerViewDetailProps}
      />
    );
  }

  // 获取创造者详情组件
  @autobind
  getInitiatorDetailComponent() {
    const { isSourceFromCreatorView, flowId } = this.state;
    const {
      push,
      location,
      priviewCustFileData,
      clearCreateTaskData,
      taskBasicInfo,
    } = this.props;

    // 如果当前视图是创建者视图，并且状态是执行中，就展示管理者视图
    if (isSourceFromCreatorView) {
      return this.getManagerDetailComponent();
    }
    const newTaskBasicInfo = { ...taskBasicInfo, currentId: this.getCurrentId() };

    return (
      <CreatorViewDetail
        onPreview={this.handlePreview}
        priviewCustFileData={priviewCustFileData}
        taskBasicInfo={newTaskBasicInfo}
        flowId={flowId}
        push={push}
        location={location}
        clearCreateTaskData={clearCreateTaskData}
      />
    );
  }

  @autobind
  getExecutorDetailComponent() {
    const {
      location,
      list,
      parameter,
      dict,
      empInfo,
      addServeRecord,
      taskDetailBasicInfo,
      targetCustList,
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      getCustIncome,
      monthlyProfits,
      interfaceState,
      targetCustDetail,
      changeParameter,
      queryTargetCust,
      queryCustUuid,
      custUuid,
      ceFileDelete,
      getCeFileList,
      filesList,
      deleteFileResult,
      addMotServeRecordSuccess,
      answersList,
      getTempQuesAndAnswer,
      saveAnswersByType,
      saveAnswersSucce,
      attachmentList,
      getTaskDetailBasicInfo,
      modifyLocalTaskList,
      custFeedbackList,
      queryCustFeedbackList4ZLFins,
      queryApprovalList,
      zhangleApprovalList,
    } = this.props;
    const {
      typeCode,
      typeName,
      taskFeedbackList,
      statusCode,
      isTaskFeedbackListOfNone,
      eventId,
      taskTypeCode,
    } = this.state;
    const [firstItem = {}] = list.resultData;
    const { query: { currentId } } = location;
    return (
      <PerformerViewDetail
        currentId={currentId || firstItem.id}
        parameter={parameter}
        dict={dict}
        empInfo={empInfo}
        addServeRecord={addServeRecord}
        basicInfo={taskDetailBasicInfo}
        targetCustList={targetCustList}
        handleCollapseClick={handleCollapseClick}
        getServiceRecord={getServiceRecord}
        serviceRecordData={serviceRecordData}
        getCustIncome={getCustIncome}
        monthlyProfits={monthlyProfits}
        custIncomeReqState={interfaceState['customerPool/getCustIncome']}
        targetCustDetail={targetCustDetail}
        changeParameter={changeParameter}
        queryTargetCust={queryTargetCust}
        queryCustUuid={queryCustUuid}
        custUuid={custUuid}
        getCustDetail={this.getCustDetail}
        serviceTypeCode={typeCode}
        eventId={eventId}
        taskTypeCode={taskTypeCode}
        serviceTypeName={typeName}
        statusCode={statusCode}
        ceFileDelete={ceFileDelete}
        getCeFileList={getCeFileList}
        filesList={filesList}
        deleteFileResult={deleteFileResult}
        taskFeedbackList={taskFeedbackList}
        addMotServeRecordSuccess={addMotServeRecordSuccess}
        getTempQuesAndAnswer={getTempQuesAndAnswer}
        answersList={answersList}
        saveAnswersByType={saveAnswersByType}
        saveAnswersSucce={saveAnswersSucce}
        attachmentList={attachmentList}
        isTaskFeedbackListOfNone={isTaskFeedbackListOfNone}
        modifyLocalTaskList={modifyLocalTaskList}
        getTaskDetailBasicInfo={getTaskDetailBasicInfo}
        custFeedbackList={custFeedbackList}
        queryCustFeedbackList4ZLFins={queryCustFeedbackList4ZLFins}
        queryApprovalList={queryApprovalList}
        zhangleApprovalList={zhangleApprovalList}
      />
    );
  }

  /**
   * 根据不同的视图获取不同的Detail组件
   * @param  {string} st 视图类型
   */
  @autobind
  getDetailComponentByView(st) {
    let detailComponent = null;

    switch (st) {
      case INITIATOR:
        detailComponent = this.getInitiatorDetailComponent();
        break;
      case EXECUTOR:
        detailComponent = this.getExecutorDetailComponent();
        break;
      case CONTROLLER:
        detailComponent = this.getManagerDetailComponent();
        break;
      default:
        break;
    }

    return detailComponent;
  }

  // 获取服务经理使用的客户反馈列表，
  // 以及涨乐财富通给予客户的可选反馈列表
  @autobind
  getFeedbackList({ typeCode, eventId, currentItem }) {
    let currentType = {};
    let taskFeedbackList = [];
    if (+currentItem.descText === 1) {
      currentType = _.find(this.props.taskFeedbackList, obj => +obj.id === +typeCode);
    } else {
      currentType = _.find(this.props.taskFeedbackList, obj => +obj.id === +eventId);
    }
    if (_.isEmpty(currentType)) {
      // 找不到反馈类型，则前端做一下处理，手动给一级和二级都塞一个其他类型
      taskFeedbackList = feedbackListOfNone;
    } else {
      taskFeedbackList = currentType.feedbackList;
    }
    this.setState({
      taskFeedbackList,
      isTaskFeedbackListOfNone: taskFeedbackList === feedbackListOfNone,
    });
  }

  /**
 * 发送获取任务反馈字典的请求
 * @param {*} typeCode 当前左侧列表的选中项的typeCode
 * @param {*} eventId 当前左侧列表的选中项的eventId
 */
  @autobind
  queryMissionList(typeCode, eventId) {
    const {
      getServiceType,
      dict: { missionType },
    } = this.props;
    /**
     * 区分mot任务和自建任务
     * 用当前任务的typeCode与字典接口中missionType数据比较，找到对应的任务类型currentItem
     * currentItem 的descText=‘0’表示mot任务，descText=‘1’ 表示自建任务
     * 根据descText的值请求对应的任务类型和任务反馈的数据
     * 再判断当前任务是属于mot任务还是自建任务
     * 自建任务时：用当前任务的typeCode与请求回来的任务类型和任务反馈的数据比较，找到typeCode对应的任务反馈
     * mot任务时：用当前任务的eventId与请求回来的任务类型和任务反馈的数据比较，找到typeCode对应的任务反馈
     */
    const currentItem = _.find(missionType, obj => +obj.key === +typeCode) || {};
    getServiceType({ pageNum: 1, pageSize: 10000, type: +currentItem.descText + 1 })
      .then(() => this.getFeedbackList({ typeCode, eventId, currentItem }));
  }

  // 帕努单任务是否在执行中，用于管理者视图
  @autobind
  judgeTaskInApproval(status) {
    return _.includes(STATUS_MANAGER_VIEW, status);
  }

  // 导出客户
  @autobind
  handleExportExecl(orgId) {
    const {
      mngrMissionDetailInfo,
    } = this.props;
    const params = {
      missionName: mngrMissionDetailInfo.missionName,
      orgId,
      missionId: this.getCurrentId(),
      serviceTips: _.isEmpty(mngrMissionDetailInfo.missionDesc) ? ' ' : mngrMissionDetailInfo.missionDesc,
      servicePolicy: mngrMissionDetailInfo.servicePolicy,
    };
    return params;
  }

  // 判断当前视图是否执行者视图
  @autobind
  isExecutorView(view) {
    return view === EXECUTOR;
  }

  // 判断当前视图是否创造者视图
  @autobind
  isInitiatorView(view) {
    return view === INITIATOR;
  }

  // 头部筛选请求
  @autobind
  queryAppList(query) {
    const { getTaskList } = this.props;
    const { pageNum = 1, pageSize = 20 } = query;
    const params = this.constructViewPostBody(query, pageNum, pageSize);

    // 默认筛选条件
    getTaskList({ ...params }).then(() => {
      const { list = {} } = this.props;
      const { resultData = [] } = list;
      // const firstData = resultData[0] || {};
      // 当前视图是执行者视图
      if (!_.isEmpty(resultData) && this.isExecutorView(resultData[0].missionViewType)) {
        // 初始化取第一条任务来获取反馈列表数据
        const { typeCode, eventId } = resultData[0];
        this.queryMissionList(typeCode, eventId);
      }
      this.getRightDetail();
    });
  }

  /**
   * 构造入参
   * @param {*} query 查询
   * @param {*} newPageNum 当前页
   * @param {*} newPageSize 当前分页条目数
   */
  @autobind
  constructViewPostBody(query, newPageNum, newPageSize) {
    const { missionViewType, status } = query;
    let finalPostData = {
      pageNum: _.parseInt(newPageNum, 10),
      pageSize: _.parseInt(newPageSize, 10),
    };
    const omitData = _.omit(query, ['currentId', 'pageNum', 'pageSize', 'isResetPageNum', 'custName']);
    finalPostData = _.merge(
      finalPostData,
      omitData,
      // { orgId: 'ZZ001041' },
      { orgId: emp.getOrgId() },
    );
    // 获取当前的视图类型
    const currentViewType = getViewInfo(missionViewType).currentViewType;
    // 执行者视图中，状态默认选中‘执行中’, status传50
    // url中status为‘all’时传空字符串或者不传，其余传对应的code码
    if (this.isExecutorView(currentViewType)) {
      if (status) {
        finalPostData.status = status === STATE_ALL_CODE ? '' : status;
      } else {
        finalPostData.status = STATE_EXECUTE_CODE;
      }
    } else if (_.includes([INITIATOR, CONTROLLER], currentViewType)) {
      // 创建者视图和管理者视图中，状态默认选中‘所有状态’， status传空字符串或者不传
      // url中status为‘all’时传空字符串或者不传，其余传对应的code码
      if (!status || status === STATE_ALL_CODE) {
        finalPostData.status = '';
      } else {
        finalPostData.status = status;
      }
    }
    // 状态默认选中‘执行中’, status传50，其余传对应的code码
    finalPostData.status = status || STATE_EXECUTE_CODE;
    finalPostData = { ...finalPostData, missionViewType: currentViewType };
    if (this.isInitiatorView(currentViewType)) {
      const { createTimeEnd, createTimeStart } = finalPostData;
      finalPostData = {
        ...finalPostData,
        createTimeEnd: this.getFinishedStateDate({
          status,
          value: currentDate,
          urlDate: createTimeEnd,
        }),
        createTimeStart: this.getFinishedStateDate({
          status,
          value: beforeCurrentDate60Days,
          urlDate: createTimeStart,
        }),
      };
    } else {
      const { endTimeEnd, endTimeStart } = finalPostData;
      finalPostData = {
        ...finalPostData,
        endTimeEnd: this.getFinishedStateDate({
          status,
          value: currentDate,
          urlDate: endTimeEnd,
        }),
        endTimeStart: this.getFinishedStateDate({
          status,
          value: beforeCurrentDate60Days,
          urlDate: endTimeStart,
        }),
      };
    }
    return finalPostData;
  }

  // 当前筛选的状态为‘结束’时，优先取url中日期的值，再取默认的日期，否则返回空字符串
  @autobind
  getFinishedStateDate({
    status = STATE_EXECUTE_CODE,
    value,
    urlDate,
  }) {
    if (status === STATE_FINISHED_CODE) {
      return urlDate || moment(value).format(dateFormat);
    }
    return '';
  }

  // 加载右侧panel中的详情内容
  @autobind
  loadDetailContent(obj) {
    const { getTaskDetailBasicInfo, queryTargetCust } = this.props;
    getTaskDetailBasicInfo({ taskId: obj.id });
    queryTargetCust({
      missionId: obj.id,
      pageNum: 1,
      pageSize: 10,
    });
  }

  /**
   * 管理者视图获取当前任务详细信息
   * @param {*} record 当前记录
   */
  @autobind
  loadManagerViewDetailContent(record = {}) {
    const { missionViewType: viewType, mssnId, id, eventId: tempEventId } = record;
    const {
      queryMngrMissionDetailInfo,
      countFlowFeedBack,
      countFlowStatus,
      countAnswersByType,
      countExamineeByType,
      getCustManagerScope,
    } = this.props;
    // 如果来源是创建者视图，那么取mssnId作为missionId
    // 取id作为eventId
    const missionId = this.isInitiatorView(viewType) ? mssnId : id;
    const eventId = this.isInitiatorView(viewType) ? id : tempEventId;
    const orgId = emp.getOrgId();
    // 管理者视图获取任务基本信息
    queryMngrMissionDetailInfo({
      taskId: missionId,
      orgId,
      // 管理者视图需要eventId来查询详细信息
      eventId,
    }).then(
      () => {
        const { mngrMissionDetailInfo, queryMOTServeAndFeedBackExcel } = this.props;
        const { templateId, missionName, servicePolicy, missionDesc } = mngrMissionDetailInfo;
        if (!_.isEmpty(templateId)) {
          // 管理者视图任务反馈统计
          countAnswersByType({ templateId });
          // 任务反馈已反馈总数
          countExamineeByType({ templateId });
        }
        const paylaod = {
          missionName,
          orgId,
          missionId,
          serviceTips: _.isEmpty(missionDesc) ? ' ' : missionDesc,
          servicePolicy,
        };
        queryMOTServeAndFeedBackExcel(paylaod);
      },
    );

    // 管理者视图获取客户反馈
    countFlowFeedBack({ missionId, orgId });
    // 管理者视图任务实施进度
    countFlowStatus({ missionId, orgId });
    // 管理者视图服务经理维度任务详细数据
    getCustManagerScope({
      pageNum: GET_CUST_SCOPE_PAGE_NUM,
      pageSize: GET_CUST_SCOPE_PAGE_SIZE,
      missionId,
      orgId: emp.getOrgId(),
    });
  }

  // 查看附件客户列表
  @autobind
  handlePreview({ filename, pageNum, pageSize }) {
    const { previewCustFile } = this.props;
    // 预览数据
    previewCustFile({
      filename,
      pageNum,
      pageSize,
    });
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj = {}) {
    const { name = '', ...otherQuery } = obj;
    // 1.将值写入Url
    const { replace, location, push } = this.props;
    const { query, pathname } = location;
    if (name === 'switchView') {
      push({ pathname, query: otherQuery });
    } else {
      replace({
        pathname,
        query: {
          ...query,
          ...otherQuery,
          currentId: '',
          pageNum: 1,
        },
      });
    }
  }

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: nextPage,
      },
    });
    // 切换页码，将页面的scrollToTop
    const listWrap = this.splitPanelElem.listWrap;
    if (listWrap) {
      const appList = _.get(listWrap, 'firstChild.firstChild');
      if (appList) {
        appList.scrollTop = 0;
      }
    }
  }

  // 切换每一页显示条数
  @autobind
  handlePageSizeChange(currentPageNum, changedPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        pageSize: changedPageSize,
      },
    });
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '执行者视图左侧列表',
      type: '$props.location.query.type',
      subType: '$props.location.query.subType',
    },
  })
  handleListRowClick(record, index) {
    // typeCode为任务类型，通过这个类型，查到字典中missionType的descText
    const { id, missionViewType: st, typeCode, statusCode, typeName, eventId, mssnId } = record;
    const { queryCustUuid, replace, location: { pathname, query }, dict } = this.props;
    const isSourceFromCreatorView = this.isInitiatorView(st)
      && this.judgeTaskInApproval(statusCode);
    const ci = isSourceFromCreatorView ? mssnId : id;
    if (this.getCurrentId() === ci) return;

    // 查出任务类型是MOT还是自荐
    const currentMissionTypeObject = _.find(dict.missionType, item =>
      item.key === typeCode) || {};
    const { descText } = currentMissionTypeObject;
    replace({
      pathname,
      query: {
        ...query,
        currentId: ci,
      },
    });

    // 如果所点击的任务需要的是执行者视图，则预先请求custUuid
    if (this.isExecutorView(st)) {
      // 前置请求custuuid
      queryCustUuid();
    }

    this.setState({
      currentView: st,
      activeRowIndex: index,
      typeCode,
      typeName,
      eventId,
      statusCode,
      isSourceFromCreatorView,
      taskTypeCode: descText,
    }, () => {
      this.getDetailByView(record);
    });
  }

  // 头部新建按钮，跳转到新建表单
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '跳转到新建自建任务' } })
  handleCreateBtnClick() {
    const url = '/customerPool/taskFlow';
    const { clearTaskFlowData, push } = this.props;
    clearTaskFlowData();
    openRctTab({
      routerAction: push,
      url,
      param: {
        id: 'FSP_ST_TAB_MOT_SELFBUILD_ADD',
        title: '新建自建任务',
        closable: true,
        isSpecialTab: true,
      },
    });
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex, currentView } = this.state;
    const { dict = {} } = this.props;
    const { missionType = [] } = dict;
    const pageName = currentView === CONTROLLER ? 'managerView' : 'performerView';
    return (
      <ViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName={pageName}
        pageData={taskList}
        missionTypeDict={missionType}
      />
    );
  }

  render() {
    const { location, replace, list, dict, queryCustUuid } = this.props;

    const { currentView } = this.state;

    const { query: { pageNum = 1, pageSize = 20 } } = location;
    const { resultData = [], page = {} } = list;

    const isEmpty = _.isEmpty(resultData);

    const topPanel = (
      <ConnectedPageHeader
        location={location}
        replace={replace}
        dict={dict}
        page={currentView}
        pageType={taskList.pageType}
        chooseMissionViewOptions={this.missionView}
        creatSeibelModal={this.handleCreateBtnClick}
        filterControl={currentView}
        filterCallback={this.handleHeaderFilter}
        isGrayFlag={envHelper.isGrayFlag()}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount || 0,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: this.handlePageSizeChange,
    };

    const leftPanel = (
      <ViewList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
        queryCustUuid={queryCustUuid}
      />
    );
    // TODO 此处需要根据不同的子类型使用不同的Detail组件
    const rightPanel = isEmpty ? null : this.getDetailComponentByView(currentView);

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="premissionList"
          leftWidth={LEFT_PANEL_WIDTH}
          ref={ref => (this.splitPanelElem = ref)}
        />
      </div>
    );
  }
}
