/**
 * @Author: sunweibin
 * @Date: 2018-04-13 11:57:34
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-06-07 21:04:31
 * @description 任务管理首页
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import withRouter from '../../decorators/withRouter';
import ConnectedPageHeader from '../../components/taskList/ConnectedPageHeader';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import PerformerViewDetail from '../../components/taskList/performerView/PerformerViewDetail';
import ManagerViewDetail from '../../components/taskList/managerView/ManagerViewDetail';
import CreatorViewDetail from '../../components/taskList/creatorView/RightPanel';
import ViewList from '../../components/common/appList';
import ViewListRow from '../../components/taskList/ViewListRow';
import ViewMenu from '../../components/taskList/ViewMenu';
import FixedTitle from '../../components/taskList/FixedTitle';
import pageConfig from '../../components/taskList/pageConfig';
import { getCurrentScopeByOrgId } from '../../components/taskList/managerView/helper';
import { openRctTab } from '../../utils';
import { emp, permission, fsp } from '../../helper';
import logable from '../../decorators/logable';
import taskListHomeShape from './taskListHomeShape';
import { getViewInfo } from './helper';

import styles from './home.less';

import {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  STATUS_MANAGER_VIEW,
  SYSTEMCODE,
  STATE_EXECUTE_CODE,
  STATE_ALL_CODE,
  CREATE_TIME,
  END_TIME,
  CREATE_TIME_KEY,
  END_TIME_KEY,
  // 三个视图左侧任务列表的请求入参，在config里面配置，后续如果需要新增，或者删除某个param，
  // 请在config里面配置QUERY_PARAMS
  QUERY_PARAMS,
  mediumPageSize,
  defaultPerformerViewCurrentTab,
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

// 查询涨乐财富通的审批人需要的btnId固定值
const ZL_QUREY_APPROVAL_BTN_ID = '200000';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

// 创建者视图的排序默认降序排序
const SORT_DESC = 'desc';
// 执行者视图和管理者视图默认升序排序
const SORT_ASC = 'asc';

@withRouter
export default class PerformerView extends PureComponent {
  static propTypes = taskListHomeShape;

  static defaultProps = {
    priviewCustFileData: EMPTY_OBJECT,
    filesList: EMPTY_LIST,
    custRange: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
    custFeedback: EMPTY_LIST,
    answersList: EMPTY_OBJECT,
    isSubmitSurveySucceed: false,
    missionImplementationDetail: EMPTY_OBJECT,
    custListForServiceImplementation: EMPTY_LIST,
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
      taskTypeCode: '',  // 自建任务，mot任务1
      typeName: '',
      eventId: '',
      statusCode: '',
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
    const {
      location: { query: prevQuery },
      changePerformerViewTab,
    } = this.props;
    const { currentId, ...otherQuery } = query;
    const { currentId: prevCurrentId, ...otherPrevQuery } = prevQuery;
    if (!_.isEqual(otherQuery, otherPrevQuery)) {
      this.queryAppList(otherQuery);
    }
    // 当前选中的任务变化，需要还原与任务绑定当前详情中选中的tab
    if (query.currentId !== prevQuery.currentId) {
      // 还原执行者视图右侧详情中tab的activeKey，默认选中第一个tab
      changePerformerViewTab(defaultPerformerViewCurrentTab);
    }
  }

  // 获取列表后再获取某个Detail
  @autobind
  getRightDetail() {
    const {
      list,
      location: { query: { currentId, missionViewType } },
      dict: { missionType },
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
      } = item;
      // 根据typeCode找出那个任务的descText的值
      const { descText } = _.find(missionType, obj => +obj.key === +typeCode) || EMPTY_OBJECT;

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
    const { queryTargetCustDetail, targetCustList = EMPTY_OBJECT } = this.props;
    const { list = EMPTY_LIST } = targetCustList;
    if (_.isEmpty(list)) {
      return;
    }
    const firstItem = list[0] || EMPTY_OBJECT;
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
    const { list = EMPTY_OBJECT, location: { query: { currentId, missionViewType } } } = this.props;
    if (currentId) {
      return currentId;
    }
    const [firstItem = EMPTY_OBJECT] = list.resultData;
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
    enterType,
  }) {
    const {
      getCustManagerScope,
      custRange,
    } = this.props;
    const newOrgId = orgId === 'msm' ? '' : orgId;
    // 获取服务经理维度任务数据
    getCustManagerScope({
      missionId: this.getCurrentId(),
      orgId: newOrgId || emp.getOrgId(),
      pageNum,
      pageSize,
      // 当前任务维度，取入参或者跟着组织机构走
      enterType: enterType || getCurrentScopeByOrgId({ custRange, orgId }),
    });
  }

  @autobind
  getManagerDetailComponentPorps() {
    const {
      dict,
      dict: { missionType = EMPTY_LIST, missionProgressStatus = EMPTY_LIST },
      empInfo,
      location,
      replace,
      push,
      previewCustDetail,
      custDetailResult,
      countFlowFeedBack,
      custFeedback,
      custRange,
      missionImplementationDetail = EMPTY_OBJECT,
      mngrMissionDetailInfo = EMPTY_OBJECT,
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
    const { empNum = 0 } = missionImplementationDetail || EMPTY_OBJECT;

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
      currentMotServiceRecord,
      answersList,
      getTempQuesAndAnswer,
      saveAnswersByType,
      isSubmitSurveySucceed,
      attachmentList,
      getTaskDetailBasicInfo,
      modifyLocalTaskList,
      custFeedbackList,
      queryCustFeedbackList4ZLFins,
      queryApprovalList,
      zhangleApprovalList,
      queryCustomer,
      custListForServiceImplementation,
      toggleServiceRecordModal,
      serviceRecordInfo,
      resetServiceRecordInfo,
      // 投资建议文本撞墙检测
      testWallCollision,
      // 投资建议文本撞墙检测是否有股票代码
      testWallCollisionStatus,
      addCallRecord,
      changePerformerViewTab,
      performerViewCurrentTab,
      taskFeedbackList,
      serviceProgress,
      custFeedBack,
      custDetail,
      queryExecutorFlowStatus,
      queryExecutorFeedBack,
      queryExecutorDetail,
    } = this.props;
    const {
      typeCode,
      typeName,
      statusCode,
      eventId,
      taskTypeCode,
    } = this.state;
    const [firstItem = EMPTY_OBJECT] = list.resultData;
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
        isCustIncomeRequested={interfaceState['customerPool/getCustIncome']}
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
        currentMotServiceRecord={currentMotServiceRecord}
        getTempQuesAndAnswer={getTempQuesAndAnswer}
        answersList={answersList}
        saveAnswersByType={saveAnswersByType}
        isSubmitSurveySucceed={isSubmitSurveySucceed}
        attachmentList={attachmentList}
        modifyLocalTaskList={modifyLocalTaskList}
        getTaskDetailBasicInfo={getTaskDetailBasicInfo}
        custFeedbackList={custFeedbackList}
        queryCustFeedbackList4ZLFins={queryCustFeedbackList4ZLFins}
        queryApprovalList={queryApprovalList}
        zhangleApprovalList={zhangleApprovalList}
        queryCustomer={queryCustomer}
        customerList={custListForServiceImplementation}
        toggleServiceRecordModal={toggleServiceRecordModal}
        serviceRecordInfo={serviceRecordInfo}
        resetServiceRecordInfo={resetServiceRecordInfo}
        testWallCollision={testWallCollision}
        testWallCollisionStatus={testWallCollisionStatus}
        addCallRecord={addCallRecord}
        changePerformerViewTab={changePerformerViewTab}
        performerViewCurrentTab={performerViewCurrentTab}
        serviceProgress={serviceProgress}
        custFeedBack={custFeedBack}
        custDetail={custDetail}
        queryExecutorFlowStatus={queryExecutorFlowStatus}
        queryExecutorFeedBack={queryExecutorFeedBack}
        queryExecutorDetail={queryExecutorDetail}
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
    const params = this.getQueryParams(query, pageNum, pageSize);

    // 默认筛选条件
    getTaskList({ ...params }).then(() => {
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
  getQueryParams(query, newPageNum, newPageSize) {
    const { missionViewType, status, creatorId, sortParam } = query;
    // 从query上筛选出需要的入参
    const params = _.pick(query, QUERY_PARAMS);
    let finalPostData = {
      pageNum: _.parseInt(newPageNum, 10),
      pageSize: _.parseInt(newPageSize, 10),
    };
    finalPostData = {
      ...params,
      ...finalPostData,
      // { orgId: 'ZZ001041' },
      orgId: emp.getOrgId(),
      // 传过来的名字叫creatorId，传给后台需要改成creator
      creator: creatorId,
    };

    // 获取当前的视图类型
    const currentViewType = getViewInfo(missionViewType).currentViewType;
    // 入参中，添加排序关键字
    finalPostData = {
      ...finalPostData,
      ...this.addSortParam(currentViewType, sortParam),
    };
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
    return finalPostData;
  }

  // 加载右侧panel中的详情内容
  @autobind
  loadDetailContent(obj) {
    const {
      getTaskDetailBasicInfo,
      queryTargetCust,
      targetCustList: { page: { pageSize } },
    } = this.props;
    getTaskDetailBasicInfo({ taskId: obj.id });
    const isFoldFspLeftMenu = fsp.isFSPLeftMenuFold();
    // fsp左侧菜单折叠pageSize传9，否则传6
    const newPageSize = isFoldFspLeftMenu ? mediumPageSize : pageSize;
    // 执行者视图服务实施客户列表中 状态筛选默认值 state='10' 未开始
    queryTargetCust({ missionId: obj.id, state: '10', pageNum: 1, pageSize: newPageSize });
    // 加载右侧详情的时候，查一把涨乐财富通的数据
    this.queryDataForZhanleServiceWay();
  }

  // 查询涨乐财富通的数据
  @autobind
  queryDataForZhanleServiceWay() {
    const { eventId, taskTypeCode, typeCode } = this.state;
    const type = `${+taskTypeCode + 1}`;
    // TODO 如果是mot任务 eventId参数需要使用 eventId
    // 如果是自建任务 需要使用serviceType
    // type 值为2的时候，该任务是自建任务
    const eventIdParam = type === '2' ? typeCode : eventId;
    this.props.queryCustFeedbackList4ZLFins({ eventId: eventIdParam, type });
    this.props.queryApprovalList({ btnId: ZL_QUREY_APPROVAL_BTN_ID });
  }

  /**
   * 管理者视图获取当前任务详细信息
   * @param {*} record 当前记录
   */
  @autobind
  loadManagerViewDetailContent(record = EMPTY_OBJECT) {
    const { missionViewType: viewType, mssnId, id, eventId: tempEventId } = record;
    const {
      queryMngrMissionDetailInfo,
      countFlowFeedBack,
      countFlowStatus,
      countAnswersByType,
      countExamineeByType,
      getCustManagerScope,
      custRange,
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
      // 当前任务维度，跟着组织机构走
      enterType: getCurrentScopeByOrgId({ custRange }),
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
  handleHeaderFilter(obj = EMPTY_OBJECT) {
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

  /**
   * 获取sortKey，createTimeSort或者endTimeSort
   * 获取sortContent，创建时间或者结束时间
   */
  @autobind
  getSortConfig(viewType) {
    let sortKey = CREATE_TIME_KEY;
    let sortContent = CREATE_TIME;
    let sortDirection = SORT_DESC;
    if (viewType === EXECUTOR || viewType === CONTROLLER) {
      sortKey = END_TIME_KEY;
      sortContent = END_TIME;
      sortDirection = SORT_ASC;
    }
    return {
      sortKey,
      sortContent,
      sortDirection,
    };
  }

  /**
   * 请求入参中添加排序
   */
  @autobind
  addSortParam(currentViewType, sortParam) {
    let param = {};
    // 如果query中没有sortParam，那么取默认的
    if (_.isEmpty(sortParam)) {
      // 创建者视图，用createTimeSort,desc
      if (currentViewType === INITIATOR) {
        param = {
          [CREATE_TIME_KEY]: SORT_DESC,
        };
      } else if (currentViewType === EXECUTOR || currentViewType === CONTROLLER) {
        // 执行者视图和管理者视图用endTimeSort,asc
        param = {
          [END_TIME_KEY]: SORT_ASC,
        };
      }
    } else {
      param = sortParam;
    }

    return param;
  }

  /**
   * 排序，请求数据
   */
  @autobind
  handleSortChange({ sortKey, sortType }) {
    const { location: { query } } = this.props;
    this.queryAppList({
      ...query,
      sortParam: {
        [sortKey]: sortType,
      },
    });
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
        // 翻页将当前任务id从url上清空
        currentId: '',
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
        // 翻页将当前任务id从url上清空
        currentId: '',
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
    const {
      queryCustUuid,
      replace,
      location: { pathname, query },
      dict,
      clearCustListForServiceImplementation,
    } = this.props;
    const isSourceFromCreatorView = this.isInitiatorView(st)
      && this.judgeTaskInApproval(statusCode);
    const ci = isSourceFromCreatorView ? mssnId : id;
    if (this.getCurrentId() === ci) return;

    // 查出任务类型是MOT还是自荐
    const currentMissionTypeObject = _.find(dict.missionType, item =>
      item.key === typeCode) || EMPTY_OBJECT;
    const { descText } = currentMissionTypeObject;
    replace({
      pathname,
      query: {
        ...query,
        currentId: ci,
      },
    });

    // 如果所点击的任务需要的是执行者视图，则预先请求custUuid
    // 将执行者视图右侧搜索客户的列表数据清空
    if (this.isExecutorView(st)) {
      // 前置请求custuuid
      queryCustUuid();
      clearCustListForServiceImplementation();
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
    const { dict = EMPTY_OBJECT } = this.props;
    const { missionType = EMPTY_LIST } = dict;
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

  /**
   * 渲染固定的列
   */
  @autobind
  renderFixedTitle() {
    const { location: { query: { missionViewType } } } = this.props;
    const viewType = getViewInfo(missionViewType).currentViewType;
    const { sortKey, sortContent, sortDirection } = this.getSortConfig(viewType);
    return (
      <FixedTitle
        sortContent={sortContent}
        sortDirection={sortDirection}
        onSortChange={this.handleSortChange}
        sortKey={sortKey}
        viewType={viewType}
      />
    );
  }

  render() {
    const { location, replace, list, dict, queryCustUuid } = this.props;

    const { currentView } = this.state;

    const { query: { pageNum = 1, pageSize = 20 } } = location;
    const { resultData = EMPTY_LIST, page = EMPTY_OBJECT } = list;

    const isEmpty = _.isEmpty(resultData);

    const topPanel = (
      <div>
        <ViewMenu
          chooseMissionViewOptions={this.missionView}
          onViewChange={this.handleHeaderFilter}
          location={location}
          onLaunchTask={this.handleCreateBtnClick}
        />
        <ConnectedPageHeader
          location={location}
          replace={replace}
          dict={dict}
          page={currentView}
          pageType={taskList.pageType}
          filterControl={currentView}
          filterCallback={this.handleHeaderFilter}
        />
      </div>
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
        fixedTitle={this.renderFixedTitle()}
        footerBordered={false}
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
          headerStyle={styles.commonHeader}
        />
      </div>
    );
  }
}
