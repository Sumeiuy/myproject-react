/**
 * @Author: wangjunjun
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: zhangmei
 * @Last Modified time: 2018-09-25 14:34:51
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import Header from '../../components/customerPool/home/Header';
import { optionsMap } from '../../config';
import { emp, time, permission } from '../../helper';
import { transformDateTypeToDate } from '../../components/customerPool/helper';
import withRouter from '../../decorators/withRouter';
import {
  CUST_MANAGER,
  ORG,
  MAIN_MAGEGER_ID,
} from './config';
import logable from '../../decorators/logable';
import styles from './home.less';
import {
  MorningBroadcast,
  ToBeDone,
  Viewpoint,
  PerformanceIndicators,
  TabsExtra,
  Search,
  LabelModal,
} from '../../components/customerPool/home';
import RecommendModal from '../../components/recommend/RecommendModal';
import PerformanceCharts from '../../components/newHome/PerformanceCharts';

const TabPane = Tabs.TabPane;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const effects = {
  toBeTone: 'customerPool/getToBeDone',
  getManagerIndicators: 'customerPool/getManagerIndicators',
  getHotPossibleWds: 'customerPool/getHotPossibleWds',
  getHotWds: 'customerPool/getHotWds',
  saveSearchVal: 'customerPool/saveSearchVal',
  getInformation: 'customerPool/getInformation',
  getPerformanceIndicators: 'customerPool/getPerformanceIndicators',
  getCustCount: 'customerPool/getCustCount',
  switchTab: 'customerPoolHome/switchTab',
  queryhomePageNews: 'morningBoradcast/queryhomePageNews', // 晨报列表
  queryAudioFile: 'morningBoradcast/queryAudioFile',
  custLabelListPaging: 'customerPool/custLabelListPaging', // 首页可用客户标签列表弹窗数据分页处理
  queryCustLabelList: 'customerPool/queryCustLabelList', // 获取首页可用客户标签列表数据
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  custRange: state.customerPool.custRange, // 客户池用户范围
  cycle: state.app.dict.kPIDateScopeType, // 统计周期
  process: state.customerPool.process, // 代办流程(首页总数)
  motTaskCount: state.customerPool.motTaskCount, // 今日可做任务总数
  empInfo: state.app.empInfo, // 职位信息
  hotPossibleWdsList: state.customerPool.hotPossibleWdsList, // 联想的推荐热词列表
  hotWdsList: state.customerPool.hotWdsList, // 默认推荐词及热词推荐列表
  searchHistoryVal: state.customerPool.searchHistoryVal, // 保存搜索内容
  information: state.customerPool.information, // 首席投顾观点
  performanceIndicators: state.customerPool.performanceIndicators, // 绩效指标
  managerIndicators: state.customerPool.managerIndicators, // 经营指标
  custCount: state.customerPool.custCount, // （经营指标）新增客户指标
  initBoradcastList: state.morningBoradcast.initBoradcastList,
  initBoradcastFile: state.morningBoradcast.initBoradcastFile,
  pagingCustLabelData: state.customerPool.pagingCustLabelData, // 前端处理过的带分页的所有可用客户标签数据
});

const mapDispatchToProps = {
  getCustCount: fetchDataFunction(false, effects.getCustCount),
  getManagerIndicators: fetchDataFunction(false, effects.getManagerIndicators),
  getPerformanceIndicators: fetchDataFunction(false, effects.getPerformanceIndicators),
  getInformation: fetchDataFunction(false, effects.getInformation),
  getToBeDone: fetchDataFunction(false, effects.toBeTone),
  getHotPossibleWds: fetchDataFunction(false, effects.getHotPossibleWds),
  getHotWds: fetchDataFunction(false, effects.getHotWds),
  saveSearchVal: fetchDataFunction(false, effects.saveSearchVal),
  push: routerRedux.push,
  replace: routerRedux.replace,
  switchTab: fetchDataFunction(false, effects.switchTab), // 切换，上报日志
  queryhomePageNews: fetchDataFunction(false, effects.queryhomePageNews),
  queryAudioFile: fetchDataFunction(false, effects.queryAudioFile),
  custLabelListPaging: fetchDataFunction(false, effects.custLabelListPaging),
  queryCustLabelList: fetchDataFunction(false, effects.queryCustLabelList),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getToBeDone: PropTypes.func.isRequired,
    managerIndicators: PropTypes.object,
    collectCustRange: PropTypes.func.isRequired,
    getManagerIndicators: PropTypes.func.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    getHotWds: PropTypes.func.isRequired,
    saveSearchVal: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    process: PropTypes.object,
    motTaskCount: PropTypes.number,
    empInfo: PropTypes.object,
    hotPossibleWdsList: PropTypes.array,
    hotWdsList: PropTypes.array,
    searchHistoryVal: PropTypes.string,
    getInformation: PropTypes.func.isRequired,
    information: PropTypes.object,
    performanceIndicators: PropTypes.object,
    getPerformanceIndicators: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired,
    custCount: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]), // 问了后端的逻辑，当有报错时，返回的是空对象，当正常时，返回的是数组
    getCustCount: PropTypes.func.isRequired,
    initBoradcastList: PropTypes.array.isRequired,
    initBoradcastFile: PropTypes.object.isRequired,
    queryhomePageNews: PropTypes.func.isRequired,
    queryAudioFile: PropTypes.func.isRequired,
    // 首页可用客户标签
    queryCustLabelList: PropTypes.func.isRequired,
    custLabelListPaging: PropTypes.func.isRequired,
    pagingCustLabelData: PropTypes.object.isRequired,
  }

  static defaultProps = {
    managerIndicators: EMPTY_OBJECT,
    custRange: EMPTY_LIST,
    cycle: EMPTY_LIST,
    process: EMPTY_OBJECT,
    motTaskCount: 0,
    empInfo: EMPTY_OBJECT,
    hotPossibleWdsList: EMPTY_LIST,
    hotWdsList: EMPTY_LIST,
    searchHistoryVal: '',
    information: EMPTY_OBJECT,
    performanceIndicators: EMPTY_OBJECT,
    custCount: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      createCustRange: [],
      expandAll: false,
      // 是否显示查看更多标签弹窗
      showMoreLabelModal: false,
    };
    // 登录用户orgId
    this.orgId = emp.getOrgId();
    // HTSC 首页指标查询
    this.hasIndexViewPermission = permission.hasIndexViewPermission();
    // HTSC 任务管理岗
    this.hasTkMampPermission = permission.hasTkMampPermission();
  }

  componentDidMount() {
    const {
      custRange,
      empInfo: { empPostnList = {} },
      getInformation,
      getToBeDone,
      getHotWds,
      queryhomePageNews,
    } = this.props;

    // 猜你感兴趣模块接口，经需求确认此处与职责无关，删除以前传的orgId,2017\11\7
    getHotWds({ empNo: emp.getId() });
    // 待办事项, 有任务管理岗时，将岗位id传给后端

    // 判断当前登录用户是否在非营业部
    const isNotSaleDepartment = emp.isManagementHeadquarters(this.orgId)
      || emp.isFiliale(custRange, this.orgId);
    // 非营业部登录用户有权限时，传登陆者的orgId
    getToBeDone({ orgId: isNotSaleDepartment && this.hasTkMampPermission ? this.orgId : '' });

    // 首席投顾观点
    getInformation({ curPageNum: 1, pageSize: 18 });
    // 请求指标
    this.requstIndicator(this.props);
    // 投顾绩效的时间筛选不同，拆分单独请求
    this.requestPerformanceIndicators(this.props);
    // 根据岗位orgId生成对应的组织机构树
    this.handleCreateCustRange({
      custRange,
      posOrgId: this.orgId,
      empPostnList,
    });
    // 初始化晨报列表数据，用于首页提供晨报展示
    queryhomePageNews({
      createdFrom: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      createdTo: moment().format('YYYY-MM-DD'),
      pageNum: 1,
      pageSize: 10,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: { query: prevQuery = EMPTY_OBJECT },
    } = this.props;
    const {
      location: { query: nextQuery = EMPTY_OBJECT },
    } = nextProps;

    // 时间或者组织机构树变化
    // 重新请求绩效指标数据和净创收数据
    if (prevQuery.orgId !== nextQuery.orgId
      || prevQuery.cycleSelect !== nextQuery.cycleSelect) {
      // 请求指标数据
      this.requstIndicator(nextProps);
    }

    // 时间或者组织机构树变化
    // 重新请求投顾绩效数据
    if (prevQuery.orgId !== nextQuery.orgId
      || prevQuery.performanceCycleSelect !== nextQuery.performanceCycleSelect) {
      // 请求指标数据
      this.requestPerformanceIndicators(nextProps);
    }
  }

  // 我的客户时custType=CUST_MANAGER，非我的客户时custType=ORG， custType用来传给后端
  @autobind
  getCustType(orgId) {
    let custType = CUST_MANAGER;
    if (orgId) {
      custType = orgId !== MAIN_MAGEGER_ID ? ORG : CUST_MANAGER;
    } else if (this.hasIndexViewPermission) {
      custType = ORG;
    }
    return custType;
  }

  // 周期类型
  @autobind
  getDateType(cycleSelect) {
    const { cycle } = this.props;
    return cycleSelect || (!_.isEmpty(cycle) ? cycle[0].key : '');
  }

  @autobind
  getIndicators({
    begin, end, orgId, cycleSelect, custType
  }) {
    const {
      getManagerIndicators,
      getCustCount,
    } = this.props;
    const cycleDate = transformDateTypeToDate(cycleSelect);
    const param = {
      custType, // 客户范围类型
      orgId, // 组织ID
      dateType: this.getDateType(cycleSelect), // 周期类型
      dateStart: cycleDate.cycleStartTime,
      dateEnd: cycleDate.cycleEndTime,
      empId: emp.getId(),
    };
    // 经营指标新增客户数指标
    getCustCount({ ...param });
    // 经营指标
    getManagerIndicators({ ...param, end, begin });
  }

  @autobind
  getTimeSelectBeginAndEnd(props) {
    const { cycle, location: { query: { cycleSelect } } } = props;
    const { historyTime, customerPoolTimeSelect } = optionsMap;
    const currentSelect = _.find(historyTime, (itemData) => {
      const a = _.find(
        customerPoolTimeSelect,
        item => item.key === (cycleSelect || (cycle[0] || {}).key),
      ) || {};
      return itemData.name === a.name;
    }) || {}; // 本月
    const nowDuration = time.getDurationString(currentSelect.key);
    const begin = nowDuration.begin;
    const end = nowDuration.end;
    return {
      begin,
      end,
    };
  }

  // 请求指标数据
  requstIndicator(props) {
    const {
      cycle,
      location: {
        query: {
          cycleSelect,
          orgId,
        },
      },
    } = props;
    // 根据cycle获取对应的begin和end值
    const { begin, end } = this.getTimeSelectBeginAndEnd(props);
    const custType = this.getCustType(orgId);
    const tempObj = {
      begin,
      end,
      custType,
      cycleSelect: cycleSelect || (cycle[0] || {}).key,
    };
    if (orgId) {
      tempObj.orgId = orgId !== MAIN_MAGEGER_ID ? orgId : '';
    } else if (this.hasIndexViewPermission) {
      tempObj.orgId = this.orgId;
    }
    // 绩效指标
    this.getIndicators(tempObj);
  }

  @autobind
  requestPerformanceIndicators(props) {
    const {
      location: {
        query: {
          performanceCycleSelect, // 与cycleSelect区分，只针对投顾绩效
          orgId,
        },
      },
      empInfo = {},
      getPerformanceIndicators,
    } = props;
    const { tgQyFlag = false } = empInfo.empInfo || {};

    // 查看投顾绩效开关:empinfo返回的权限指标字段（tgQyFlag：bool）
    if (tgQyFlag) {
      const custType = this.getCustType(orgId);
      let requsetOrgId;
      if (orgId) {
        requsetOrgId = orgId !== MAIN_MAGEGER_ID ? orgId : '';
      } else if (this.hasIndexViewPermission) {
        requsetOrgId = this.orgId;
      }
      const { performanceCycleSelect: selects } = optionsMap;
      const currentSelect = _.find(selects, item => item.dateKey === performanceCycleSelect)
        || selects[0];
      const duration = time.getDurationString(currentSelect.dateKey);
      const begin = duration.begin;
      const end = duration.end;
      getPerformanceIndicators({
        custType, // 客户范围类型
        orgId: requsetOrgId,
        dateType: currentSelect.key,
        begin,
        end,
        dateStart: moment(begin).format('YYYY-MM-DD'),
        dateEnd: moment(end).endOf('month').format('YYYY-MM-DD'),
      });
    }
  }

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(params) {
    const { replace, location: { pathname, query } } = this.props;
    const { cycleSelect, performanceCycleSelect, orgId } = params;
    // 切换Duration和Orig
    const obj = {};
    if (orgId) {
      obj.orgId = orgId;
    } else if (cycleSelect) {
      obj.cycleSelect = cycleSelect;
    } else if (performanceCycleSelect) {
      obj.performanceCycleSelect = performanceCycleSelect;
    }
    replace({
      pathname,
      query: {
        ...query,
        ...obj,
      },
    });
  }

  // 获取联想数据
  @autobind
  queryHotPossibleWds(state) {
    const { getHotPossibleWds } = this.props;
    const setData = {
      orgId: this.hasTkMampPermission ? this.orgId : '', // 组织ID
      empNo: emp.getId(), // 用户ID
    };
    getHotPossibleWds({
      ...setData,
      ...state,
    });
  }

  /**
   * 创建客户范围组件的tree数据
   * @param {*} props 最新的props
   */
  @autobind
  handleCreateCustRange({
    custRange,
    posOrgId,
  }) {
    const myCustomer = {
      id: MAIN_MAGEGER_ID,
      name: '我的客户',
    };
    // 有‘HTSC 首页指标查询’权限
    if (this.hasIndexViewPermission) {
      // 只要不是我的客户，都展开组织机构树
      // 用户职位是经总
      if (posOrgId === (custRange[0] || {}).id) {
        this.setState({
          expandAll: true,
          createCustRange: [...custRange, myCustomer],
        });
        return;
      }
      // posOrgId 在机构树中所处的分公司位置
      const groupInCustRange = _.find(custRange, item => item.id === posOrgId);
      if (groupInCustRange) {
        this.setState({
          expandAll: true,
          createCustRange: [groupInCustRange, myCustomer],
        });
        return;
      }
      // posOrgId 在机构树的营业部位置
      let department;
      _(custRange).forEach((obj) => {
        if (obj.children && !_.isEmpty(obj.children)) {
          const targetValue = _.find(obj.children, o => o.id === posOrgId);
          if (targetValue) {
            department = [targetValue, myCustomer];
          }
        }
      });

      if (department) {
        this.setState({
          createCustRange: department,
        });
        return;
      }
    }
    // 无权限或者有权限，但是posOrgId不在empOrg（组织机构树）中
    this.setState({
      createCustRange: [myCustomer],
    });
  }

  @autobind
  handleSaveSearchVal(obj) {
    const { saveSearchVal } = this.props;
    saveSearchVal(obj);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：经营指标/投顾绩效' } })
  handleTabClick(param) {
    const {
      switchTab,
      replace,
      location: { query },
    } = this.props;
    // 发送日志
    switchTab({ param });
    // 在URL上记录选择的图表tab
    replace({
      query: {
        ...query,
        activeKey: param,
      }
    });
  }

  // 打开/关闭 更多标签弹窗
  @autobind
  handleToggleMoreLabelModal(status) {
    this.setState({
      showMoreLabelModal: status,
    });
  }

  @autobind
  renderTabsExtra() {
    const {
      replace,
      collectCustRange,
      cycle,
      location,
    } = this.props;
    const {
      expandAll,
      // cycleSelect,
      createCustRange,
    } = this.state;
    const {
      query: {
        orgId,
        cycleSelect,
        activeKey,
        performanceCycleSelect, // 绩效视图选择的时间选项
      }
    } = location;
    // curOrgId   客户范围回填
    // 当url中由 orgId 则使用orgId
    // 有权限时默认取所在岗位的orgId
    // 无权限取 MAIN_MAGEGER_ID
    let curOrgId = this.orgId;

    // selectCycle 下拉时间选择的选项，绩效视图和经营指标并不一样
    let selectCycle;
    let curCycleSelect;
    let isPerformace = false;
    if (activeKey === 'performance') {
      selectCycle = optionsMap.performanceCycleSelect;
      curCycleSelect = performanceCycleSelect
        || (_.isArray(selectCycle) ? (selectCycle[0] || {}) : {}).dateKey;
      isPerformace = true;
    } else {
      selectCycle = cycle;
      // curCycleSelect  时间周期，先从url中取值，url中没有值时，取时间周期第一个
      curCycleSelect = cycleSelect || (_.isArray(cycle) ? (cycle[0] || {}) : {}).key;
    }

    if (orgId) {
      curOrgId = orgId;
    } else if (!this.hasIndexViewPermission) {
      curOrgId = MAIN_MAGEGER_ID;
    }
    const extraProps = {
      custRange: createCustRange,
      replace,
      updateQueryState: this.updateQueryState,
      collectCustRange,
      cycle: selectCycle,
      expandAll,
      selectValue: curCycleSelect,
      location,
      orgId: curOrgId,
      isPerformace,
    };
    return (<TabsExtra {...extraProps} />);
  }

  render() {
    const {
      managerIndicators,
      location,
      process,
      cycle,
      motTaskCount,
      hotWdsList,
      hotPossibleWdsList,
      push,
      searchHistoryVal,
      information,
      performanceIndicators,
      empInfo = {},
      custCount, // 经营指标新增客户指标数据
      initBoradcastList,
      initBoradcastFile,
      queryAudioFile,
      queryCustLabelList,
      custLabelListPaging,
      pagingCustLabelData,
    } = this.props;
    const {
      showMoreLabelModal,
    } = this.state;
    // 是否能看投顾绩效的标记
    const { tgQyFlag = false } = empInfo.empInfo || {};
    const activeKey = location.query.activeKey
      || (this.hasTkMampPermission ? 'manage' : 'performance');

    const labelModalProps = {
      location,
      queryCustLabelList,
      pageChange: custLabelListPaging,
      data: pagingCustLabelData,
      show: showMoreLabelModal,
      toggleModal: this.handleToggleMoreLabelModal,
    };

    return (
      <div className={styles.customerPoolWrap}>
        <RecommendModal />
        <Header push={push} />
        <div className={styles.poolContainer}>
          <div className={styles.content}>
            <Search
              orgId={this.orgId}
              hotWdsList={hotWdsList}
              queryHotPossibleWds={this.queryHotPossibleWds}
              queryHotWdsData={hotPossibleWdsList}
              push={push}
              searchHistoryVal={searchHistoryVal}
              saveSearchVal={this.handleSaveSearchVal}
              location={location}
              showMoreLabelModal={this.handleToggleMoreLabelModal}
            />
            <ToBeDone
              location={location}
              push={push}
              data={process}
              motTaskCountData={motTaskCount}
            />
            <Tabs
              tabBarExtraContent={this.renderTabsExtra()}
              defaultActiveKey={activeKey}
              onTabClick={this.handleTabClick}
            >
              <TabPane tab="经营指标" key="manage">
                <PerformanceIndicators
                  empInfo={empInfo}
                  push={push}
                  custCount={custCount}
                  indicators={managerIndicators}
                  location={location}
                  cycle={cycle}
                  category="manager"
                  authority={this.hasIndexViewPermission}
                />
              </TabPane>
              {
                tgQyFlag ? (
                  <TabPane tab="投顾绩效" key="performance">
                    <PerformanceIndicators
                      empInfo={empInfo}
                      push={push}
                      indicators={performanceIndicators}
                      location={location}
                      cycle={cycle}
                      custCount={custCount}
                      category="performance"
                      authority={this.hasIndexViewPermission}
                    />
                    {/* <PerformanceCharts
                      indicators={performanceIndicators}
                      isNewHome={false}
                    /> */}
                  </TabPane>
                ) : (null)
              }
            </Tabs>
          </div>
          <div className={styles.viewpoint}>
            <MorningBroadcast
              queryAudioFile={queryAudioFile}
              dataList={initBoradcastList}
              sourceList={initBoradcastFile}
            />
            <Viewpoint
              information={information}
              push={push}
            />
          </div>
        </div>
        <LabelModal {...labelModalProps} />
      </div>
    );
  }
}
