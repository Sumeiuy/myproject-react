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
import ConnectedPageHeader from '../../components/taskList/ConnectedPageHeader';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import PerformerViewDetail from '../../components/taskList/performerView/PerformerViewDetail';
import CreatorViewDetail from '../../components/taskList/creatorView/RightPanel';
import ViewList from '../../components/common/appList';
import ViewListRow from '../../components/taskList/ViewListRow';
import pageConfig from '../../components/taskList/pageConfig';
import appListTool from '../../components/common/appList/tool';
import { fspContainer } from '../../config';
import { fspGlobal } from '../../utils';

const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
const {
  taskList,
  taskList: { pageType, viewType, status, chooseMissionView },
} = pageConfig;

const EXECUTOR = 'executor'; // 执行者视图
const INITIATOR = 'initiator'; // 创造者视图
// const CONTROLLER = 'controller'; //管理者视图视图

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const effects = {
  getTaskList: 'performerView/getTaskList',
  addServiceRecord: 'customerPool/addServiceRecord',
  handleCollapseClick: 'contactModal/handleCollapseClick',  // 手动上传日志
  getServiceRecord: 'customerPool/getServiceRecord',
  getCustIncome: 'customerPool/getCustIncome',
  previewCustFile: 'tasklist/previewCustFile',
  getTaskBasicInfo: 'tasklist/getTaskBasicInfo',
};

const mapStateToProps = state => ({
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
  // 客户细分导入数据
  priviewCustFileData: state.tasklist.priviewCustFileData,
  taskBasicInfo: state.tasklist.taskBasicInfo,
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
  getServiceRecord: fetchDataFunction(false, effects.getServiceRecord),
  // 获取最近6个月收益
  getCustIncome: fetchDataFunction(false, effects.getCustIncome),
  previewCustFile: fetchDataFunction(true, effects.previewCustFile),
  getTaskBasicInfo: fetchDataFunction(true, effects.getTaskBasicInfo),
  // 清除数据
  clearTaskFlowData: query => ({
    type: 'customerPool/clearTaskFlowData',
    payload: query || {},
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PerformerView extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
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
    priviewCustFileData: PropTypes.object,
    previewCustFile: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    clearTaskFlowData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    priviewCustFileData: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentView: '',
      isEmpty: true,
      activeRowIndex: 0,
    };
  }


  componentWillMount() {
    const {
      location: {
        query,
      query: {
          pageNum,
          pageSize,
        },
      },
      getTaskList,
    } = this.props;
    const params = this.constructViewPostBody(query, pageNum || 1, pageSize || 10);
    // 默认筛选条件
    getTaskList({
      ...params,
    }).then(this.getRightDetail);
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { location: { query: prevQuery = EMPTY_OBJECT }, getTaskList } = this.props;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;
    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        const params = this.constructViewPostBody(nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        );
        getTaskList({
          ...params,
        }).then(this.getRightDetail);
      }
    }
  }

  componentDidUpdate() {
    const {
      location: {
        pathname,
      query,
      query: { isResetPageNum },
      },
      replace,
    } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
          pageNum: 1,
        },
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
      const { missionViewType: st } = item;
      this.setState({
        currentView: st,
        activeRowIndex: itemIndex,
      });
      this.getDetailByView(item);
    }
  }

  // 查询不同视图的详情信息
  getDetailByView(record) {
    const { missionViewType: st } = record;
    const {
      getTaskBasicInfo,
      taskDetailBasicInfo,
    } = this.props;
    switch (st) {
      case INITIATOR:
        getTaskBasicInfo({});
        break;
      case EXECUTOR:
        taskDetailBasicInfo({});
        break;
      default:
        break;
    }
  }

  /**
   * 根据不同的视图获取不同的Detail组件
   * @param  {string} st 子类型
   */
  @autobind
  getDetailComponentByView(st) {
    const {
      location,
      replace,
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
    } = this.props;
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
            location={location}
            replace={replace}
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
          />
        );
        break;
      default:
        break;
    }
    return detailComponent;
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
    const { id, missionViewType: st } = record;
    const {
      replace,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    if (currentId === id) return;
    replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({ currentView: st, activeRowIndex: index });
    this.getDetailByView(record);
  }

  // 头部新建按钮，跳转到新建表单
  @autobind
  handleCreateBtnClick() {
    const url = '/customerPool/taskFlow';
    const { clearTaskFlowData } = this.props;
    clearTaskFlowData();
    if (document.querySelector(fspContainer.container)) {
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
    const { activeRowIndex } = this.state;
    return (
      <ViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName="performerView"
        pageData={taskList}
      />
    );
  }

  render() {
    const {
      location,
      replace,
      list,
    } = this.props;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedPageHeader
        location={location}
        replace={replace}
        page="performerViewPage"
        pageType={pageType}
        typeOptions={viewType}
        stateOptions={status}
        chooseMissionViewOptions={chooseMissionView}
        creatSeibelModal={this.handleCreateBtnClick}
        filterControl="performerView"
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
        />
      </div>
    );
  }
}
