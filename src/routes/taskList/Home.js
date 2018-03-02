/*
 * @Description: 执行者视图 home 页面
 * @Author: 洪光情
 * @Date: 2017-11-20 15:38:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
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
import { emp, permission, env as envHelper, data as dataHelper } from '../../helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
const LEFT_PANEL_WIDTH = 400;
const {
  taskList,
  taskList: { pageType, chooseMissionView },
} = pageConfig;

const EXECUTOR = 'executor'; // 执行者视图
const INITIATOR = 'initiator'; // 创造者视图
const CONTROLLER = 'controller'; // 管理者视图

// 50代表执行中
// 60代表结果跟踪
// 70代表结束
const EXECUTE_STATE = '50';
const RESULT_TRACK_STATE = '60';
const COMPLETED_STATE = '70';

const SYSTEMCODE = '102330'; // 理财平台系统编号

const today = moment(new Date()).format('YYYY-MM-DD');
const beforeToday = moment(moment(today).subtract(60, 'days')).format('YYYY-MM-DD');
const afterToday = moment(moment(today).add(60, 'days')).format('YYYY-MM-DD');

const TASKFEEDBACK_QUERY = {
  pageNum: 1,
  pageSize: 10000,
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

// 找不到反馈类型的时候，前端写死一个其他类型，作容错处理
const feedbackListOfNone = [{
  id: -1,
  name: '其他',
  length: 1,
  childList: [{
    id: -1,
    name: '其他',
    length: null,
    childList: null,
  }],
}];

const effects = {
  getTaskList: 'performerView/getTaskList',
  addServiceRecord: 'performerView/addMotServeRecord',
  handleCollapseClick: 'contactModal/handleCollapseClick',  // 手动上传日志
  getServiceRecord: 'customerPool/getServiceRecord',
  getCustIncome: 'customerPool/getCustIncome',
  changeParameter: 'performerView/changeParameter',
  queryTargetCust: 'performerView/queryTargetCust',
  queryTargetCustDetail: 'performerView/queryTargetCustDetail',
  getTaskDetailBasicInfo: 'performerView/getTaskDetailBasicInfo',
  queryCustUuid: 'performerView/queryCustUuid',
  getServiceType: 'performerView/getServiceType',
  previewCustFile: 'tasklist/previewCustFile',
  getTaskBasicInfo: 'tasklist/getTaskBasicInfo',
  ceFileDelete: 'performerView/ceFileDelete',
  getCeFileList: 'customerPool/getCeFileList',
  // 预览客户明细
  previewCustDetail: 'managerView/previewCustDetail',
  // 管理者视图查询任务详细信息中的基本信息
  queryMngrMissionDetailInfo: 'managerView/queryMngrMissionDetailInfo',
  // 管理者视图一二级客户反馈
  countFlowFeedBack: 'managerView/countFlowFeedBack',
  // 管理者视图任务实施进度
  countFlowStatus: 'managerView/countFlowStatus',
  getTempQuesAndAnswer: 'performerView/getTempQuesAndAnswer',
  saveAnswersByType: 'performerView/saveAnswersByType',
  // 任务反馈统计
  countAnswersByType: 'performerView/countAnswersByType',
  // 任务反馈已反馈总数
  countExamineeByType: 'performerView/countExamineeByType',
  // 查看是否是自己名下的客户
  isCustServedByPostn: 'customerPool/isCustServedByPostn',
  exportCustListExcel: 'managerView/exportCustListExcel',
};

const mapStateToProps = state => ({
  // 记录详情中的参数
  parameter: state.performerView.parameter,
  // 详情中基本信息
  taskDetailBasicInfo: state.performerView.taskDetailBasicInfo,
  list: state.performerView.taskList,
  dict: state.app.dict,
  // 详情中目标客户的数据
  targetCustList: state.performerView.targetCustList,
  serviceRecordData: state.customerPool.serviceRecordData,
  // 接口的loading状态
  interfaceState: state.loading.effects,
  // 6个月收益数据
  monthlyProfits: state.customerPool.monthlyProfits,
  // 任务详情中目标客户列表当前选中的详情信息
  targetCustDetail: state.performerView.targetCustDetail,
  // 添加服务记录和上传附件用的custUuid
  custUuid: state.performerView.custUuid,
  // 客户细分导入数据
  priviewCustFileData: state.tasklist.priviewCustFileData,
  taskBasicInfo: state.tasklist.taskBasicInfo,
  filesList: state.customerPool.filesList,
  deleteFileResult: state.performerView.deleteFileResult,
  custDetailResult: state.managerView.custDetailResult,
  // 管理者视图任务详情中的基本信息
  mngrMissionDetailInfo: state.managerView.mngrMissionDetailInfo,
  // 管理者视图一二级客户反馈
  custFeedback: state.managerView.custFeedback,
  // 客户池用户范围
  custRange: state.customerPool.custRange,
  // 职位信息
  empInfo: state.app.empInfo,
  // 管理者视图任务实施进度数据
  missionImplementationDetail: state.managerView.missionImplementationDetail,
  // 任务反馈的字典
  taskFeedbackList: state.performerView.taskFeedbackList,
  // 执行者视图添加服务记录是否成功
  addMotServeRecordSuccess: state.performerView.addMotServeRecordSuccess,
  answersList: state.performerView.answersList,
  saveAnswersSucce: state.performerView.saveAnswersSucce,
  // 任务反馈统计数据
  missionFeedbackData: state.performerView.missionFeedbackData,
  // 任务反馈已反馈
  missionFeedbackCount: state.performerView.missionFeedbackCount,
  attachmentList: state.performerView.attachmentList,
  // 是否包含非本人名下客户
  custServedByPostnResult: state.customerPool.custServedByPostnResult,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 获取左侧列表
  getTaskList: fetchDataFunction(true, effects.getTaskList),
  // 添加服务记录
  addServeRecord: fetchDataFunction(true, effects.addServiceRecord),
  // 手动上传日志
  handleCollapseClick: fetchDataFunction(false, effects.handleCollapseClick),
  // 最近五次服务记录
  getServiceRecord: fetchDataFunction(true, effects.getServiceRecord),
  // 获取最近6个月收益
  getCustIncome: fetchDataFunction(false, effects.getCustIncome),
  // 改变详情中的用来查询的参数
  changeParameter: fetchDataFunction(false, effects.changeParameter),
  // 查询详情中目标客户列表
  queryTargetCust: fetchDataFunction(true, effects.queryTargetCust),
  // 查询详情中目标客户的详情
  queryTargetCustDetail: fetchDataFunction(true, effects.queryTargetCustDetail),
  // 右侧详情的基本信息
  getTaskDetailBasicInfo: fetchDataFunction(true, effects.getTaskDetailBasicInfo),
  // 获取添加服务记录和上传附件用的custUuid
  queryCustUuid: fetchDataFunction(true, effects.queryCustUuid),
  // 预览客户文件
  previewCustFile: fetchDataFunction(true, effects.previewCustFile),
  // 创建者视图的详情接口
  getTaskBasicInfo: fetchDataFunction(true, effects.getTaskBasicInfo),
  getCeFileList: fetchDataFunction(false, effects.getCeFileList),
  // 清除数据
  clearTaskFlowData: query => ({
    type: 'customerPool/clearTaskFlowData',
    payload: query || {},
  }),
  // 清除自建任务数据
  clearCreateTaskData: query => ({
    type: 'customerPool/clearCreateTaskData',
    payload: query || {},
  }),
  // 删除文件接口
  ceFileDelete: fetchDataFunction(true, effects.ceFileDelete),
  // 预览客户明细
  previewCustDetail: fetchDataFunction(true, effects.previewCustDetail),
  // 查询管理者视图任务详细信息中的基本信息
  queryMngrMissionDetailInfo: fetchDataFunction(true, effects.queryMngrMissionDetailInfo),
  // 管理者视图一二级客户反馈
  countFlowFeedBack: fetchDataFunction(true, effects.countFlowFeedBack),
  // 管理者视图任务实施进度
  countFlowStatus: fetchDataFunction(true, effects.countFlowStatus),
  // 获取添加服务记录中的任务反馈
  getServiceType: fetchDataFunction(true, effects.getServiceType),
  getTempQuesAndAnswer: fetchDataFunction(false, effects.getTempQuesAndAnswer),
  saveAnswersByType: fetchDataFunction(false, effects.saveAnswersByType),
  countAnswersByType: fetchDataFunction(false, effects.countAnswersByType),
  countExamineeByType: fetchDataFunction(false, effects.countExamineeByType),
  // 查询是否包含本人名下客户
  isCustServedByPostn: fetchDataFunction(true, effects.isCustServedByPostn),
  exportCustListExcel: fetchDataFunction(true, effects.exportCustListExcel),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PerformerView extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    parameter: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired,
    getTaskList: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    taskDetailBasicInfo: PropTypes.object.isRequired,
    targetCustList: PropTypes.object.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    // 接口的loading状态
    interfaceState: PropTypes.object.isRequired,
    // 6个月收益数据
    monthlyProfits: PropTypes.object.isRequired,
    targetCustDetail: PropTypes.object.isRequired,
    changeParameter: PropTypes.func.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    queryTargetCustDetail: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    getTaskDetailBasicInfo: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object,
    previewCustFile: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    clearTaskFlowData: PropTypes.func.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    deleteFileResult: PropTypes.array.isRequired,
    // 预览客户细分
    previewCustDetail: PropTypes.func.isRequired,
    // 预览客户细分结果
    custDetailResult: PropTypes.object.isRequired,
    mngrMissionDetailInfo: PropTypes.object.isRequired,
    queryMngrMissionDetailInfo: PropTypes.func.isRequired,
    countFlowFeedBack: PropTypes.func.isRequired,
    custFeedback: PropTypes.array,
    custRange: PropTypes.array,
    empInfo: PropTypes.object,
    missionImplementationDetail: PropTypes.object.isRequired,
    countFlowStatus: PropTypes.func.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
    getServiceType: PropTypes.func.isRequired,
    taskFeedbackList: PropTypes.array.isRequired,
    addMotServeRecordSuccess: PropTypes.bool.isRequired,
    getTempQuesAndAnswer: PropTypes.func.isRequired,
    answersList: PropTypes.object,
    saveAnswersByType: PropTypes.func.isRequired,
    saveAnswersSucce: PropTypes.bool,
    missionFeedbackData: PropTypes.array.isRequired,
    countAnswersByType: PropTypes.func.isRequired,
    missionFeedbackCount: PropTypes.number.isRequired,
    countExamineeByType: PropTypes.func.isRequired,
    attachmentList: PropTypes.array.isRequired,
    isCustServedByPostn: PropTypes.func.isRequired,
    custServedByPostnResult: PropTypes.bool.isRequired,
    exportCustListExcel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    priviewCustFileData: EMPTY_OBJECT,
    filesList: [],
    custRange: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
    custFeedback: EMPTY_LIST,
    answersList: EMPTY_OBJECT,
    saveAnswersSucce: false,
  };

  constructor(props) {
    super(props);
    const { location: { query: { missionViewType = '' } } } = props;
    this.hasPermissionOfManagerView = permission.hasPermissionOfManagerView();
    // 如果当前用户有职责权限并且url上没有当前视图类型，默认显示管理者视图
    let currentView = '';
    let newMissionView = chooseMissionView;

    // 默认不展示执行者视图与管理者视图的入口
    if (envHelper.isGrayFlag()) {
      // 支持灰度发布，则展示执行者视图与管理者视图的入口
      // 然后根据权限来，到底需不需要展示管理者视图的入口
      if (!this.hasPermissionOfManagerView) {
        // 没有管理者视图查看权限
        newMissionView = _.filter(chooseMissionView, item => item.value !== CONTROLLER);
        // 当前视图是执行者视图
        currentView = EXECUTOR;
      } else {
        // 当前视图是管理者视图
        currentView = CONTROLLER;
      }
      // 在灰度发布的权限情况下，如果当前url上有当前视图类型，则用url上的视图类型
      if (!_.isEmpty(missionViewType)) {
        currentView = missionViewType;
      }
    } else {
      // 默认只展示
      newMissionView = _.filter(chooseMissionView, item => item.value === INITIATOR);
      // 当前视图是创建者视图
      currentView = INITIATOR;
    }

    this.missionView = newMissionView;
    this.state = {
      currentView,
      isEmpty: true,
      activeRowIndex: 0,
      typeCode: '',
      typeName: '',
      eventId: '',
      statusCode: '',
      isTaskFeedbackListOfNone: false,
    };
  }

  componentDidMount() {
    const { location: { query, query: { pageNum, pageSize } } } = this.props;
    const { currentView } = this.state;
    const commonPostBody = {
      ...query,
      pageNum,
      pageSize,
      today,
      missionViewType: currentView,
    };
    if (currentView === INITIATOR || !envHelper.isGrayFlag()) {
      this.queryAppListInit({
        ...commonPostBody,
        beforeToday,
      });
    } else {
      this.queryAppListInit({
        ...commonPostBody,
        afterToday,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      getServiceType,
      dict: { missionType },
    } = this.props;
    const { typeCode, eventId } = this.state;
    if (prevState.typeCode !== typeCode || prevState.eventId !== eventId) {
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
      getServiceType({ ...TASKFEEDBACK_QUERY, type: +currentItem.descText + 1 })
        .then(() => {
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
        });
    }
  }

  // 获取列表后再获取某个Detail
  @autobind
  getRightDetail() {
    const {
      replace,
      list,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    if (!_.isEmpty(list.resultData)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      const { pageNum, pageSize } = list.page;
      let item = list.resultData[0];
      let itemIndex = _.findIndex(list.resultData, o => o.id.toString() === currentId);
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = _.filter(list.resultData, o => String(o.id) === String(currentId))[0];
      } else {
        // 不存在currentId
        replace({
          pathname,
          query: {
            ...query,
            currentId: item.id,
            pageNum,
            pageSize,
          },
        });
        itemIndex = 0;
      }
      const { missionViewType: st, typeCode, statusCode, typeName } = item;
      this.setState({
        // 当前视图（三种）
        currentView: st,
        activeRowIndex: itemIndex,
        typeCode,
        typeName,
        statusCode,
      });
      this.getDetailByView(item);
    }
  }

  // 执行者视图获取目标客户列表项的对应浮层详情
  @autobind
  getCustDetail({ missionId = '', custId = '', callback }) {
    const { queryTargetCustDetail, targetCustList = EMPTY_OBJECT } = this.props;
    const { list = [] } = targetCustList;
    if (_.isEmpty(list)) {
      return;
    }
    queryTargetCustDetail({
      missionId,
      custId: custId || (list[0] || EMPTY_OBJECT).custId,
    }).then(callback);
  }

  // 查询不同视图的详情信息
  getDetailByView(record) {
    const {
      missionViewType: st,
      flowId,
    } = record;
    const {
      getTaskBasicInfo,
    } = this.props;
    switch (st) {
      case INITIATOR:
        getTaskBasicInfo({
          flowId,
          systemCode: SYSTEMCODE,
        });
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
      location: { query: { currentId } },
    } = this.props;
    const newOrgId = orgId === 'msm' ? '' : orgId;
    // 管理者视图任务实施进度
    countFlowStatus({
      missionId: currentId,
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
      location: { query: { currentId } },
    } = this.props;
    const newOrgId = orgId === 'msm' ? '' : orgId;
    // 管理者视图获取客户反馈饼图
    countFlowFeedBack({
      missionId: currentId,
      orgId: newOrgId || emp.getOrgId(),
    });
  }

  /**
   * 根据不同的视图获取不同的Detail组件
   * @param  {string} st 视图类型
   */
  @autobind
  getDetailComponentByView(st) {
    const {
      parameter,
      location,
      dict,
      addServeRecord,
      taskDetailBasicInfo,
      targetCustList,
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      interfaceState,
      getCustIncome,
      monthlyProfits,
      taskBasicInfo,
      priviewCustFileData,
      targetCustDetail,
      changeParameter,
      queryTargetCust,
      queryCustUuid,
      custUuid,
      ceFileDelete,
      getCeFileList,
      filesList,
      deleteFileResult,
      previewCustDetail,
      custDetailResult,
      countFlowFeedBack,
      custFeedback,
      custRange,
      empInfo,
      replace,
      missionImplementationDetail,
      mngrMissionDetailInfo,
      push,
      clearCreateTaskData,
      addMotServeRecordSuccess,
      getTempQuesAndAnswer,
      answersList,
      saveAnswersByType,
      saveAnswersSucce,
      missionFeedbackData,
      missionFeedbackCount,
      attachmentList,
      isCustServedByPostn,
      custServedByPostnResult,
    } = this.props;
    const {
      query: { currentId },
    } = location;
    const { empNum = 0 } = missionImplementationDetail || {};
    const {
      typeCode,
      typeName,
      taskFeedbackList,
      statusCode,
      isTaskFeedbackListOfNone,
    } = this.state;
    let detailComponent = null;
    const { missionType = [], missionProgressStatus = [] } = dict || {};
    switch (st) {
      case INITIATOR:
        detailComponent = (
          <CreatorViewDetail
            onPreview={this.handlePreview}
            priviewCustFileData={priviewCustFileData}
            taskBasicInfo={{ ...taskBasicInfo, currentId }}
          />
        );
        break;
      case EXECUTOR:
        detailComponent = (
          <PerformerViewDetail
            currentId={currentId}
            parameter={parameter}
            dict={dict}
            addServeRecord={addServeRecord}
            basicInfo={taskDetailBasicInfo}
            targetCustList={targetCustList}
            handleCollapseClick={handleCollapseClick}
            getServiceRecord={getServiceRecord}
            serviceRecordData={serviceRecordData}
            getCustIncome={getCustIncome}
            monthlyProfits={monthlyProfits}
            custIncomeReqState={interfaceState[effects.getCustIncome]}
            targetCustDetail={targetCustDetail}
            changeParameter={changeParameter}
            queryTargetCust={queryTargetCust}
            queryCustUuid={queryCustUuid}
            custUuid={custUuid}
            getCustDetail={this.getCustDetail}
            serviceTypeCode={typeCode}
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
          />
        );
        break;
      case CONTROLLER:
        detailComponent = (
          <ManagerViewDetail
            currentId={currentId}
            dict={dict}
            previewCustDetail={previewCustDetail}
            custDetailResult={custDetailResult}
            onGetCustFeedback={countFlowFeedBack}
            custFeedback={custFeedback}
            custRange={custRange}
            empInfo={empInfo}
            location={location}
            replace={replace}
            countFlowStatus={this.getFlowStatus}
            countFlowFeedBack={this.getFlowFeedback}
            missionImplementationDetail={missionImplementationDetail || EMPTY_OBJECT}
            mngrMissionDetailInfo={mngrMissionDetailInfo || EMPTY_OBJECT}
            launchNewTask={this.handleCreateBtnClick}
            clearCreateTaskData={clearCreateTaskData}
            push={push}
            missionType={typeCode}
            missionTypeDict={missionType}
            exportExcel={this.handleExportExecl}
            missionProgressStatusDic={missionProgressStatus}
            missionFeedbackData={missionFeedbackData}
            missionFeedbackCount={missionFeedbackCount}
            serveManagerCount={empNum}
            isCustServedByPostn={isCustServedByPostn}
            custServedByPostnResult={custServedByPostnResult}
          />
        );
        break;
      default:
        break;
    }
    return detailComponent;
  }

  // 导出客户
  @autobind
  handleExportExecl(orgId) {
    const {
      location: { query: { currentId } },
      mngrMissionDetailInfo,
    } = this.props;
    const params = {
      missionName: mngrMissionDetailInfo.missionName,
      orgId,
      missionId: currentId,
      serviceTips: _.isEmpty(mngrMissionDetailInfo.missionDesc) ? ' ' : mngrMissionDetailInfo.missionDesc,
      servicePolicy: mngrMissionDetailInfo.servicePolicy,
    };
    return params;
  }

  // 头部筛选请求
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 20) {
    const { getTaskList, dict: { missionStatus }, replace,
      location: { pathname } } = this.props;
    let newQuery = query;
    let newMissionStatus = missionStatus;
    const { status, missionViewType } = newQuery;

    // 从其他视图切过来
    // 如果当前视图是管理者视图，并且当前url上的status在过滤以后的status字典里面找不到对应的
    // 那么将当前status置为空
    if (missionViewType === CONTROLLER) {
      newMissionStatus = _.filter(newMissionStatus, item => item.key === EXECUTE_STATE
        || item.key === RESULT_TRACK_STATE || item.key === COMPLETED_STATE);
      if (_.isEmpty(_.find(newMissionStatus, item => item.key === status))) {
        newQuery = {
          ...newQuery,
          status: '',
        };
        // 替换无效的status为空
        replace({
          pathname,
          query: {
            ...newQuery,
          },
        });
      }
    }
    const params = this.constructViewPostBody(newQuery, pageNum, pageSize);

    // 默认筛选条件
    getTaskList({ ...params }).then(this.getRightDetail);
  }

  // 默认时间设置
  @autobind
  handleDefaultTime({ before, todays, after }) {
    const { location: { query } } = this.props;
    const { createTimeStart: urlCreateTimeStart,
      createTimeEnd: urlCreateTimeEnd,
      endTimeStart: urlEndTimeStart,
      endTimeEnd: urlEndTimeEnd } = query;

    // 判断URL里是否存在日期（例如页面跳转，日期已设置）
    const beforeTime = this.handleURlTime(urlCreateTimeStart, before);

    const afterTime = this.handleURlTime(urlCreateTimeEnd, todays);

    const entBeforeTime = this.handleURlTime(urlEndTimeStart, todays);

    const endAfterTime = this.handleURlTime(urlEndTimeEnd, after);

    const createTimeStart = _.isEmpty(before) ? null : beforeTime;
    const createTimeEnd = _.isEmpty(before) ? null : afterTime;
    const endTimeStart = _.isEmpty(after) ? null : entBeforeTime;
    const endTimeEnd = _.isEmpty(after) ? null : endAfterTime;
    return { createTimeStart, createTimeEnd, endTimeStart, endTimeEnd };
  }

  // 判断url里是否有时间设置
  handleURlTime(urlTime, time) {
    return _.isEmpty(urlTime) ? moment(time).format('YYYY-MM-DD') :
      moment(urlTime).format('YYYY-MM-DD');
  }

  // 第一次加载请求
  @autobind
  queryAppListInit({
    pageNum = 1,
    pageSize = 20,
    beforeToday: before,
    today: todays,
    afterToday: after,
    ...remainingParams
   }) {
    const { getTaskList, location, replace } = this.props;
    const { pathname } = location;
    const item = this.constructViewPostBody(remainingParams, pageNum, pageSize);
    const timersValue = this.handleDefaultTime({ before, todays, after });
    const { createTimeStart, createTimeEnd, endTimeStart, endTimeEnd } = timersValue;
    const params = { ...item, createTimeEnd, createTimeStart, endTimeStart, endTimeEnd };

    replace({
      pathname,
      query: {
        ...remainingParams,
        pageNum: 1,
        createTimeStart,
        createTimeEnd,
        endTimeStart,
        endTimeEnd,
      },
    });
    // 默认筛选条件
    getTaskList({ ...params }).then(this.getRightDetail);
  }

  /**
   * 构造入参
   * @param {*} query 查询
   * @param {*} newPageNum 当前页
   * @param {*} newPageSize 当前分页条目数
   */
  @autobind
  constructViewPostBody(query, newPageNum, newPageSize) {
    let finalPostData = {
      pageNum: _.parseInt(newPageNum, 10),
      pageSize: _.parseInt(newPageSize, 10),
    };

    const omitData = _.omit(query, ['currentId', 'pageNum', 'pageSize', 'isResetPageNum']);
    finalPostData = _.merge(
      finalPostData,
      omitData,
      // { orgId: 'ZZ001041' },
      { orgId: emp.getOrgId() },
    );

    // 对反馈状态做处理
    if (!('missionViewType' in finalPostData)
      || _.isEmpty(finalPostData.missionViewType)) {
      finalPostData = _.merge(finalPostData, { missionViewType: EXECUTOR });
    }

    return finalPostData;
  }

  // 加载右侧panel中的详情内容
  @autobind
  loadDetailContent(obj) {
    const {
      getTaskDetailBasicInfo,
      queryTargetCust,
    } = this.props;
    getTaskDetailBasicInfo({
      taskId: obj.id,
    });
    queryTargetCust({
      missionId: obj.id,
      pageNum: 1,
      pageSize: 10,
    }).then(() => this.getCustDetail({ missionId: obj.id }));
  }

  /**
   * 管理者视图获取当前任务详细信息
   * @param {*} record 当前记录
   */
  @autobind
  loadManagerViewDetailContent(record = {}) {
    const {
      queryMngrMissionDetailInfo,
      countFlowFeedBack,
      countFlowStatus,
      countAnswersByType,
      countExamineeByType,
    } = this.props;
    // 管理者视图获取任务基本信息
    queryMngrMissionDetailInfo({
      taskId: record.id,
      // taskId: '101111171108181',
      orgId: emp.getOrgId(),
      // orgId: 'ZZ001041',
      // 管理者视图需要eventId来查询详细信息
      eventId: record.eventId,
    }).then(
      () => {
        const { mngrMissionDetailInfo: { templateId } } = this.props;
        if (templateId !== null) {
          // 管理者视图任务反馈统计
          countAnswersByType({
            templateId,
          });
          // 任务反馈已反馈总数
          countExamineeByType({
            templateId,
          });
        }
      },
    );

    // 管理者视图获取客户反馈
    countFlowFeedBack({
      missionId: record.id,
      orgId: emp.getOrgId(),
    });
    // 管理者视图任务实施进度
    countFlowStatus({
      missionId: record.id,
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
  handleHeaderFilter(obj) {
    // 1.将值写入Url
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        ...obj,
      },
    });
    // 2.调用queryApplicationList接口
    this.queryAppList({ ...query, ...obj }, 1, query.pageSize);
  }

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: nextPage,
        pageSize: currentPageSize,
      },
    });
    this.queryAppList(query, nextPage, currentPageSize);
    // 切换页码，将页面的scrollToTop
    const listWrap = this.splitPanelElem.listWrap;
    if (listWrap) {
      const appList = dataHelper.getChainPropertyFromObject(listWrap, 'firstChild.firstChild');
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
    this.queryAppList(query, 1, changedPageSize);
  }

  /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  handleListRowClick(record, index) {
    const { id, missionViewType: st, typeCode, statusCode, typeName, eventId } = record;
    const {
      queryCustUuid,
      replace,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    if (currentId === String(id)) return;
    replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({
      currentView: st,
      activeRowIndex: index,
      typeCode,
      typeName,
      eventId,
      statusCode,
    });
    this.getDetailByView(record);
    // 如果当前视图是执行者视图，则预先请求custUuid
    if (st === EXECUTOR) {
      // 前置请求custuuid
      queryCustUuid();
    }
  }

  // 头部新建按钮，跳转到新建表单
  @autobind
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
    const { missionType = [] } = dict || {};
    return (
      <ViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName={currentView === CONTROLLER ? 'managerView' : 'performerView'}
        pageData={taskList}
        missionTypeDict={missionType}
      />
    );
  }

  render() {
    const {
      location,
      replace,
      list,
      dict,
      queryCustUuid,
    } = this.props;
    const { currentView } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedPageHeader
        location={location}
        replace={replace}
        dict={dict}
        page={currentView}
        pageType={pageType}
        chooseMissionViewOptions={this.missionView}
        creatSeibelModal={this.handleCreateBtnClick}
        filterControl={currentView}
        filterCallback={this.handleHeaderFilter}
        isGrayFlag={envHelper.isGrayFlag()}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 20 } } } = this.props;
    const { resultData = [], page = {} } = list;
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
    const rightPanel = this.getDetailComponentByView(this.state.currentView);

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
