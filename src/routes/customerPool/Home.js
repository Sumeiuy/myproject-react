/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';
import _ from 'lodash';

import { getDurationString } from '../../utils/helper';
import { optionsMap, fspContainer } from '../../config';
import TabsExtra from '../../components/customerPool/home/TabsExtra';
import PerformanceIndicators from '../../components/customerPool/home/PerformanceIndicators';
import ManageIndicators from '../../components/customerPool/home/ManageIndicators';
import Viewpoint from '../../components/customerPool/home/Viewpoint';
import ToBeDone from '../../components/customerPool/home/ToBeDone';
import { helper, permission } from '../../utils';
import Search from '../../components/customerPool/home/Search';
import styles from './home.less';

const TabPane = Tabs.TabPane;
const CUST_MANAGER = '1'; // 客户经理
const ORG = '3'; // 组织机构
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// const HTSC_RESPID = '1-46IDNZI'; // 首页指标查询
// 主服务经理id，用于url和custrange组件中，不传给后端
const MAIN_MAGEGER_ID = 'msm';
// const LOCAL_MONTH = '518003';

const effects = {
  toBeTone: 'customerPool/getToBeDone',
  manageIndicators: 'customerPool/getManageIndicators',
  getHotPossibleWds: 'customerPool/getHotPossibleWds',
  getHotWds: 'customerPool/getHotWds',
  getHistoryWdsList: 'customerPool/getHistoryWdsList',
  clearSearchHistoryList: 'customerPool/clearSearchHistoryList',
  saveSearchVal: 'customerPool/saveSearchVal',
  getInformation: 'customerPool/getInformation',
  getHSRateAndBusinessIndicator: 'customerPool/getHSRateAndBusinessIndicator',
  getPerformanceIndicators: 'customerPool/getPerformanceIndicators',
  getCustCount: 'customerPool/getCustCount',
  switchTab: 'customerPoolHome/switchTab',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  manageIndicators: state.customerPool.manageIndicators, // 经营指标
  custRange: state.customerPool.custRange, // 客户池用户范围
  cycle: state.app.dict.kPIDateScopeType,  // 统计周期
  process: state.customerPool.process, // 代办流程(首页总数)
  motTaskCount: state.customerPool.motTaskCount, // 今日可做任务总数
  empInfo: state.app.empInfo, // 职位信息
  hotPossibleWdsList: state.customerPool.hotPossibleWdsList, // 联想的推荐热词列表
  hotWds: state.customerPool.hotWds, // 默认推荐词及热词推荐列表
  historyWdsList: state.customerPool.historyWdsList, // 历史搜索
  clearState: state.customerPool.clearState, // 清除历史列表
  searchHistoryVal: state.customerPool.searchHistoryVal, // 保存搜索内容
  information: state.customerPool.information, // 首席投顾观点
  performanceIndicators: state.customerPool.performanceIndicators, // 绩效指标
  hsRateAndBusinessIndicator: state.customerPool.hsRateAndBusinessIndicator, // 沪深归集率和业务开通指标（经营指标）
  custCount: state.customerPool.custCount, // 绩效指标
});

const mapDispatchToProps = {
  getCustCount: fetchDataFunction(true, effects.getCustCount),
  getHSRateAndBusinessIndicator: fetchDataFunction(true, effects.getHSRateAndBusinessIndicator),
  getPerformanceIndicators: fetchDataFunction(true, effects.getPerformanceIndicators),
  getInformation: fetchDataFunction(true, effects.getInformation),
  getToBeDone: fetchDataFunction(true, effects.toBeTone),
  getManageIndicators: fetchDataFunction(true, effects.manageIndicators),
  getHotPossibleWds: fetchDataFunction(false, effects.getHotPossibleWds),
  getHotWds: fetchDataFunction(true, effects.getHotWds),
  getHistoryWdsList: fetchDataFunction(false, effects.getHistoryWdsList),
  clearSearchHistoryList: fetchDataFunction(false, effects.clearSearchHistoryList),
  saveSearchVal: fetchDataFunction(false, effects.saveSearchVal),
  push: routerRedux.push,
  replace: routerRedux.replace,
  switchTab: fetchDataFunction(false, effects.switchTab), // 切换，上报日志
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getToBeDone: PropTypes.func.isRequired,
    manageIndicators: PropTypes.object,
    collectCustRange: PropTypes.func.isRequired,
    getManageIndicators: PropTypes.func.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    getHotWds: PropTypes.func.isRequired,
    getHistoryWdsList: PropTypes.func.isRequired,
    clearSearchHistoryList: PropTypes.func.isRequired,
    saveSearchVal: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    process: PropTypes.object,
    motTaskCount: PropTypes.number,
    empInfo: PropTypes.object,
    hotPossibleWdsList: PropTypes.array,
    hotWds: PropTypes.object,
    historyWdsList: PropTypes.array,
    clearState: PropTypes.object,
    searchHistoryVal: PropTypes.string,
    getInformation: PropTypes.func.isRequired,
    information: PropTypes.object,
    performanceIndicators: PropTypes.array,
    getPerformanceIndicators: PropTypes.func.isRequired,
    hsRateAndBusinessIndicator: PropTypes.array,
    getHSRateAndBusinessIndicator: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired,
    custCount: React.PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]), // 问了后端的逻辑，当有报错时，反悔的时空对象，当正常时，反悔的时数组
    getCustCount: PropTypes.func.isRequired,
  }

  static defaultProps = {
    manageIndicators: EMPTY_OBJECT,
    custRange: EMPTY_LIST,
    cycle: EMPTY_LIST,
    collectCustRange: () => { },
    process: EMPTY_OBJECT,
    motTaskCount: 0,
    empInfo: EMPTY_OBJECT,
    hotPossibleWdsList: EMPTY_LIST,
    hotWds: EMPTY_OBJECT,
    historyWdsList: EMPTY_LIST,
    clearState: EMPTY_OBJECT,
    searchHistoryVal: '',
    information: EMPTY_OBJECT,
    performanceIndicators: EMPTY_LIST,
    hsRateAndBusinessIndicator: EMPTY_LIST,
    custCount: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      cycleSelect: '',
      createCustRange: [],
      expandAll: false,
    };
    // 首页指标查询,总部-营销活动管理岗,分公司-营销活动管理岗,营业部-营销活动管理岗权限
    this.isHasAuthorize = permission.hasCustomerPoolPermission();
  }

  componentDidMount() {
    const {
      custRange,
      empInfo: { empInfo = {}, empPostnList = {} },
      getInformation,
      getToBeDone,
      getHotWds,
      getHistoryWdsList,
    } = this.props;
    // 获取登录用户empId和occDivnNum
    const { empNum = '', occDivnNum = '' } = empInfo;

    // 登录用户orgId，默认在fsp中中取出来的当前用户岗位对应orgId，本地时取用户信息中的occDivnNum
    if (document.querySelector(fspContainer.container)) {
      this.orgId = window.forReactPosition.orgId;
    } else {
      this.orgId = occDivnNum;
    }
    // 权限控制是否传给后端orgId
    const authOrgId = this.isHasAuthorize ? this.orgId : '';
    // 猜你感兴趣模块接口，经需求确认此处与职责无关，删除以前传的orgId,2017\11\7
    getHotWds({ empNo: empNum });
    // 历史搜索记录 orgId, empNo 两个参数必传一个，两个同时传时以orgId为准
    getHistoryWdsList({ orgId: authOrgId, empNo: empNum });
    // 待办事项
    getToBeDone({ orgId: authOrgId });

    // 首席投顾观点
    getInformation({ curPageNum: 1, pageSize: 18 });
    // 发送绩效指标和沪深归集率请求
    this.sendIndicatorAndHSRateReq(this.props);
    // 根据岗位orgId生成对应的组织机构树
    this.handleCreateCustRange({
      custRange,
      posOrgId: this.orgId,
      empPostnList,
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
      // 发送绩效指标和沪深归集率请求
      this.sendIndicatorAndHSRateReq(nextProps);
    }
  }

  // 我的客户时custType=CUST_MANAGER，非我的客户时custType=ORG， custType用来传给后端
  @autobind
  getCustType(orgId) {
    let custType = CUST_MANAGER;
    if (orgId) {
      custType = orgId !== MAIN_MAGEGER_ID ? ORG : CUST_MANAGER;
    } else if (this.isHasAuthorize) {
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
  getIndicators({ begin, end, orgId, cycleSelect, custType }) {
    const {
      getPerformanceIndicators,
      getManageIndicators,
      getCustCount,
      empInfo = {},
    } = this.props;
    const { tgQyFlag = false } = empInfo.empInfo || {};
    const param = {
      custType, // 客户范围类型
      dateType: this.getDateType(cycleSelect), // 周期类型
      orgId, // 组织ID
    };
    // 经营指标新增客户数指标
    getCustCount({
      ...param,
      empId: helper.getEmpId(),
    });
    getManageIndicators(param);

    // 查看投顾绩效开关:empinfo返回的权限指标字段（tgQyFlag：bool）
    if (tgQyFlag) {
      getPerformanceIndicators({
        ...param,
        end,
        begin,
        empId: helper.getEmpId(),
      });
    }
  }

  @autobind
  getTimeSelectBeginAndEnd(props) {
    const { cycle, location: { query: { cycleSelect } } } = props;
    const { historyTime, customerPoolTimeSelect } = optionsMap;
    const currentSelect = _.find(historyTime, itemData =>
      itemData.name === _.find(customerPoolTimeSelect, item =>
        item.key === ((cycleSelect || (cycle[0] || {}).key)) || {}).name) || {}; // 本月
    const nowDuration = getDurationString(currentSelect.key);
    const begin = nowDuration.begin;
    const end = nowDuration.end;
    return {
      begin,
      end,
    };
  }

  // 发送绩效指标和沪深归集率请求
  sendIndicatorAndHSRateReq(props) {
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
    } else if (this.isHasAuthorize) {
      tempObj.orgId = this.orgId;
    }
    // 绩效指标
    this.getIndicators(tempObj);
    // 沪深归集率和业务开通指标（经营指标）
    this.fetchHSRateAndBusinessIndicator(tempObj);
  }

  @autobind
  fetchHSRateAndBusinessIndicator({ begin, end, orgId, cycleSelect, custType }) {
    const { getHSRateAndBusinessIndicator } = this.props;
    getHSRateAndBusinessIndicator({
      custType, // 客户范围类型
      dateType: this.getDateType(cycleSelect), // 周期类型
      orgId, // 组织ID
      empId: helper.getEmpId(),
      begin,
      end,
    });
  }

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(params) {
    const { replace, location: { pathname, query } } = this.props;
    const { cycleSelect, orgId } = params;
    // 切换Duration和Orig
    const obj = {};
    if (orgId) {
      obj.orgId = orgId;
    } else if (cycleSelect) {
      obj.cycleSelect = cycleSelect;
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
      orgId: this.isHasAuthorize ? this.orgId : '', // 组织ID
      empNo: helper.getEmpId(), // 用户ID
    };
    getHotPossibleWds({
      ...setData,
      ...state,
    });
  }

  // 获取历史搜索
  @autobind
  queryHistoryWdsList() {
    const { getHistoryWdsList } = this.props;
    const setData = {
      orgId: this.isHasAuthorize ? this.orgId : '', // 组织ID
      empNo: helper.getEmpId(), // 用户ID
    };
    getHistoryWdsList({
      ...setData,
    });
  }

  // 清除历史搜索
  @autobind
  clearHistoryList() {
    const { clearSearchHistoryList } = this.props;
    const setData = {
      orgId: this.isHasAuthorize ? this.orgId : '', // 组织ID
      empNo: helper.getEmpId(), // 用户ID
    };
    clearSearchHistoryList({
      ...setData,
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
    empPostnList,
  }) {
    const myCustomer = {
      id: MAIN_MAGEGER_ID,
      name: '我的客户',
    };
    // 无‘HTSC 首页指标查询’‘总部-营销活动管理岗’,
    // ‘分公司-营销活动管理岗’,‘营业部-营销活动管理岗’职责的普通用户，取值 '我的客户'
    if (!this.isHasAuthorize) {
      this.setState({
        createCustRange: [myCustomer],
      });
      return;
    }
    // 只要不是我的客户，都展开组织机构树
    // 用户职位是经总
    if (posOrgId === (custRange[0] || {}).id) {
      this.setState({
        expandAll: true,
        createCustRange: custRange,
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
    // 有权限，但是posOrgId不在empOrg（组织机构树）中，
    // 用posOrgId去empPostnList中匹配，找出对应岗位的信息显示出来
    const curJob = _.find(empPostnList, obj => obj.orgId === posOrgId);
    this.setState({
      createCustRange: [{
        id: curJob.orgId,
        name: curJob.orgName,
      }],
    });
  }

  @autobind
  handleSaveSearchVal(obj) {
    const { saveSearchVal } = this.props;
    saveSearchVal(obj);
  }

  @autobind
  handleTabClick(param) {
    const { switchTab } = this.props;
    // 发送日志
    switchTab({ param });
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
    const { query: {
      orgId,
      cycleSelect,
    } } = location;
    // curOrgId   客户范围回填
    // 当url中由 orgId 则使用orgId
    // 有权限时默认取所在岗位的orgId
    // 无权限取 MAIN_MAGEGER_ID
    let curOrgId = this.orgId;
    // curCycleSelect  时间周期，先从url中取值，url中没有值时，取时间周期第一个
    const curCycleSelect = cycleSelect || (cycle[0] || {}).key;
    if (orgId) {
      curOrgId = orgId;
    } else if (!this.isHasAuthorize) {
      curOrgId = MAIN_MAGEGER_ID;
    }
    const extraProps = {
      custRange: createCustRange,
      replace,
      updateQueryState: this.updateQueryState,
      collectCustRange,
      cycle,
      expandAll,
      selectValue: curCycleSelect,
      location,
      orgId: curOrgId,
    };
    return (<TabsExtra {...extraProps} />);
  }

  render() {
    const {
      manageIndicators,
      location,
      process,
      cycle,
      motTaskCount,
      hotWds,
      hotPossibleWdsList,
      push,
      historyWdsList,
      clearState,
      searchHistoryVal,
      information,
      performanceIndicators,
      hsRateAndBusinessIndicator,
      empInfo = {},
      custCount, // 经营指标新增客户指标数据
    } = this.props;
    // 是否能看投顾绩效的标记
    const { tgQyFlag = false } = empInfo.empInfo || {};
    return (
      <div className={styles.customerPoolWrap}>
        <Search
          data={hotWds}
          queryHotPossibleWds={this.queryHotPossibleWds}
          queryHistoryWdsList={this.queryHistoryWdsList}
          queryHotWdsData={hotPossibleWdsList}
          push={push}
          historyWdsList={historyWdsList}
          clearSuccess={clearState}
          clearFun={this.clearHistoryList}
          searchHistoryVal={searchHistoryVal}
          saveSearchVal={this.handleSaveSearchVal}
          location={location}
        />
        <div className={styles.poolContainer}>
          <div className={styles.content}>
            <ToBeDone
              location={location}
              push={push}
              data={process}
              motTaskCountData={motTaskCount}
              authority={this.isHasAuthorize}
            />
            <Tabs
              tabBarExtraContent={this.renderTabsExtra()}
              defaultActiveKey="manage"
              onTabClick={this.handleTabClick}
            >
              <TabPane tab="经营指标" key="manage">
                <ManageIndicators
                  empInfo={empInfo}
                  push={push}
                  custCount={custCount}
                  indicators={manageIndicators}
                  location={location}
                  cycle={cycle}
                  hsRateAndBusinessIndicator={hsRateAndBusinessIndicator}
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
                    />
                  </TabPane>
                ) : (null)
              }
            </Tabs>
          </div>
          <div className={styles.viewpoint}>
            <Viewpoint
              information={information}
              push={push}
            />
          </div>
        </div>
      </div>
    );
  }
}
