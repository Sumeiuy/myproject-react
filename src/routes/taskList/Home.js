/*
 * @Description: 执行者视图 home 页面
 * @Author: 洪光情
 * @Date: 2017-11-20 15:38:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import moment from 'moment';
import ConnectedPageHeader from '../../components/taskList/ConnectedPageHeader';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import PerformerViewDetail from '../../components/taskList/performerView/PerformerViewDetail';
import ManagerViewDetail from '../../components/taskList/managerView/ManagerViewDetail';
import CreatorViewDetail from '../../components/taskList/creatorView/RightPanel';
import ViewList from '../../components/common/appList';
import ViewListRow from '../../components/taskList/ViewListRow';
import pageConfig from '../../components/taskList/pageConfig';
import appListTool from '../../components/common/appList/tool';
import { fspGlobal } from '../../utils';
import { env, emp } from '../../helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];

const {
  taskList,
  taskList: { pageType, chooseMissionView },
} = pageConfig;

const EXECUTOR = 'executor'; // 执行者视图
const INITIATOR = 'initiator'; // 创造者视图
const CONTROLLER = 'controller'; // 管理者视图

const SYSTEMCODE = '102330'; // 理财平台系统编号

const today = moment(new Date()).format('YYYY-MM-DD');
const beforeToday = moment(moment(today).subtract(60, 'days')).format('YYYY-MM-DD');
const afterToday = moment(moment(today).add(60, 'days')).format('YYYY-MM-DD');

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

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
    custDetailResult: PropTypes.array.isRequired,
    mngrMissionDetailInfo: PropTypes.object.isRequired,
    queryMngrMissionDetailInfo: PropTypes.func.isRequired,
    countFlowFeedBack: PropTypes.func.isRequired,
    custFeedback: PropTypes.array.isRequired,
    custRange: PropTypes.array,
    empInfo: PropTypes.object,
    missionImplementationDetail: PropTypes.object.isRequired,
    countFlowStatus: PropTypes.func.isRequired,
  }

  static defaultProps = {
    priviewCustFileData: EMPTY_OBJECT,
    filesList: [],
    custRange: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentView: '',
      isEmpty: true,
      activeRowIndex: 0,
      typeCode: '',
      typeName: '',
    };
  }

  componentDidMount() {
    const {
      location: {
        query,
      query: {
          pageNum,
        pageSize,
        missionViewType,
        },
      },
    } = this.props;
    console.log('missionViewType-->', missionViewType);
    if (missionViewType === INITIATOR) {
      this.queryAppListInit(query, pageNum, pageSize, beforeToday, today, true);
    } else {
      this.queryAppListInit(query, pageNum, pageSize, today, afterToday);
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
      const { missionViewType: st, typeCode, typeName } = item;
      this.setState({
        // 当前视图（三种）
        currentView: st,
        activeRowIndex: itemIndex,
        typeCode,
        typeName,
      });
      this.getDetailByView(item);
    }
  }

  // 执行者视图获取目标客户列表项的对应浮层详情
  @autobind
  getCustDetail({ missionId = '', custId = '' }) {
    const { queryTargetCustDetail, targetCustList = EMPTY_OBJECT } = this.props;
    const { list = [] } = targetCustList;
    if (_.isEmpty(list)) {
      return;
    }
    queryTargetCustDetail({
      missionId,
      custId: custId || (list[0] || EMPTY_OBJECT).custId,
    });
  }

  // 查询不同视图的详情信息
  getDetailByView(record) {
    const { missionViewType: st, flowId } = record;
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
  getFlowStatus() {
    const {
      countFlowStatus,
      location: { query: { currentId } },
    } = this.props;
    // 管理者视图任务实施进度
    countFlowStatus({
      taskId: currentId,
      orgId: emp.getOrgId(),
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
    } = this.props;
    const {
      query: { currentId },
    } = location;
    const { typeCode, typeName } = this.state;
    let detailComponent = null;
    switch (st) {
      case INITIATOR:
        detailComponent = (
          <CreatorViewDetail
            onPreview={this.handlePreview}
            priviewCustFileData={priviewCustFileData}
            taskBasicInfo={taskBasicInfo}
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
            ceFileDelete={ceFileDelete}
            getCeFileList={getCeFileList}
            filesList={filesList}
            deleteFileResult={deleteFileResult}
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
            missionImplementationDetail={missionImplementationDetail}
            mngrMissionDetailInfo={mngrMissionDetailInfo}
            launchNewTask={this.handleCreateBtnClick}
          />
        );
        break;
      default:
        break;
    }
    return detailComponent;
  }

  // 头部筛选请求
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    const { getTaskList } = this.props;
    const params = this.constructViewPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    getTaskList({ ...params }).then(this.getRightDetail);
  }

  // 第一次加载请求
  @autobind
  queryAppListInit(query, pageNum = 1, pageSize = 10, createTimeStart, createTimeEnd,
    isCreat = false) {
    const { getTaskList, location, replace } = this.props;
    const { pathname } = location;
    const item = this.constructViewPostBody(query, pageNum, pageSize);
    const params = isCreat ? { ...item, createTimeEnd, createTimeStart } :
      { ...item, endTimeStart: createTimeEnd, endTimeEnd: createTimeStart };
    if (isCreat) {
      replace({
        pathname,
        query: {
          ...query,
          pageNum: 1,
          createTimeStart,
          createTimeEnd,
          endTimeStart: null,
          endTimeEnd: null,
        },
      });
    } else {
      replace({
        pathname,
        query: {
          ...query,
          pageNum: 1,
          endTimeStart: createTimeStart,
          endTimeEnd: createTimeEnd,
          createTimeStart: null,
          createTimeEnd: null,
        },
      });
    }
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
    finalPostData = _.merge(finalPostData, omitData);

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
      pageSize: 8,
    }).then(() => this.getCustDetail({ missionId: obj.id }));
  }

  /**
   * 管理者视图获取当前任务详细信息
   * @param {*} record 当前记录
   */
  @autobind
  loadManagerViewDetailContent(record = {}) {
    console.log(record);
    const {
      queryMngrMissionDetailInfo,
      countFlowFeedBack,
      countFlowStatus,
    } = this.props;
    // 管理者视图获取任务基本信息
    queryMngrMissionDetailInfo({
      taskId: record.id,
      orgId: emp.getOrgId(),
    });
    // 管理者视图获取客户反馈
    countFlowFeedBack({
      taskId: record.id,
      orgId: emp.getOrgId(),
    });
    // 管理者视图任务实施进度
    countFlowStatus({
      taskId: record.id,
      orgId: emp.getOrgId(),
    });
  }

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
    console.log(obj);
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
    const { id, missionViewType: st, typeCode, typeName } = record;
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
    });
    this.getDetailByView(record);
    // 前置请求custuuid
    queryCustUuid();
  }

  // 头部新建按钮，跳转到新建表单
  @autobind
  handleCreateBtnClick() {
    const url = '/customerPool/taskFlow';
    const { clearTaskFlowData } = this.props;
    clearTaskFlowData();
    if (env.isInFsp()) {
      fspGlobal.openRctTab({
        url,
        param: {
          id: 'FSP_ST_TAB_MOT_SELFBUILD_ADD',
          title: '新建自建任务',
          closable: true,
          isSpecialTab: true,
        },
      });
    } else {
      this.props.push(url);
    }
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex, currentView } = this.state;
    return (
      <ViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName={currentView === CONTROLLER ? 'managerView' : 'performerView'}
        pageData={taskList}
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
        chooseMissionViewOptions={chooseMissionView}
        creatSeibelModal={this.handleCreateBtnClick}
        filterControl={currentView}
        filterCallback={this.handleHeaderFilter}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const { resultData = [], page = {} } = list;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      defaultCurrent: 1,
      size: 'small', // 迷你版
      total: page.totalCount || 0,
      pageSize: parseInt(pageSize, 10),
      defaultPageSize: 10,
      onChange: this.handlePageNumberChange,
      showTotal: appListTool.showTotal,
      showSizeChanger: true,
      onShowSizeChange: this.handlePageSizeChange,
      pageSizeOptions: appListTool.constructPageSizeOptions(page.totalCount || 0),
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
          leftWidth={this.state.currentView === 'controller' ? 562 : 400}
        />
      </div>
    );
  }
}
