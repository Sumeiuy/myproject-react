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
import { optionsMap } from '../../config';
import TabsExtra from '../../components/customerPool/home/TabsExtra';
import PerformanceIndicators from '../../components/customerPool/home/PerformanceIndicators';
import ToBeDone from '../../components/customerPool/home/ToBeDone';
import { helper } from '../../utils';
import Search from '../../components/customerPool/home/Search';
import Viewpoint from '../../components/customerPool/home/Viewpoint';
import styles from './home.less';

const TabPane = Tabs.TabPane;
const CUST_MANAGER = '1'; // 客户经理
// const CUST_MANAGER_TEAM = 2; // 客户经理团队
const ORG = '3'; // 组织机构
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const HTSC_RESPID = '1-46IDNZI'; // 首页指标查询
// 主服务经理id
const MAIN_MAGEGER_ID = 'msm';
const effects = {
  toBeTone: 'customerPool/getToBeDone',
  performanceIndicators: 'customerPool/getPerformanceIndicators',
  getHotPossibleWds: 'customerPool/getHotPossibleWds',
  getHotWds: 'customerPool/getHotWds',
  getHistoryWdsList: 'customerPool/getHistoryWdsList',
  clearSearchHistoryList: 'customerPool/clearSearchHistoryList',
  saveSearchVal: 'customerPool/saveSearchVal',
  getIncomeData: 'customerPool/getIncomeData',
  getViewpoints: 'customerPool/getViewpoints',
  getLastAddCust: 'customerPool/getLastAddCust',
  getServiceIndicators: 'customerPool/getServiceIndicators',

};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  performanceIndicators: state.customerPool.performanceIndicators, // 绩效指标
  custRange: state.customerPool.custRange, // 客户池用户范围
  cycle: state.customerPool.dict.kPIDateScopeType,  // 统计周期
  position: state.customerPool.position, // 职责切换
  process: state.customerPool.process, // 代办流程(首页总数)
  motTaskCount: state.customerPool.motTaskCount, // 今日可做任务总数
  empInfo: state.app.empInfo, // 职位信息
  hotPossibleWdsList: state.customerPool.hotPossibleWdsList, // 联想的推荐热词列表
  hotWds: state.customerPool.hotWds, // 默认推荐词及热词推荐列表
  historyWdsList: state.customerPool.historyWdsList, // 历史搜索
  clearState: state.customerPool.clearState, // 清除历史列表
  searchHistoryVal: state.customerPool.searchHistoryVal, // 保存搜索内容
  incomeData: state.customerPool.incomeData, // 净创收数据
  viewpoints: state.customerPool.viewpoints, // 首席投顾观点
  lastAddCusts: state.customerPool.lastAddCusts, // 新增客户数
  serviceIndicators: state.customerPool.serviceIndicators, // 服务指标
});

const mapDispatchToProps = {
  getServiceIndicators: fetchDataFunction(true, effects.getServiceIndicators),
  getLastAddCust: fetchDataFunction(true, effects.getLastAddCust),
  getViewpoints: fetchDataFunction(true, effects.getViewpoints),
  getToBeDone: fetchDataFunction(true, effects.toBeTone),
  getPerformanceIndicators: fetchDataFunction(true, effects.performanceIndicators),
  getHotPossibleWds: fetchDataFunction(false, effects.getHotPossibleWds),
  getHotWds: fetchDataFunction(true, effects.getHotWds),
  getHistoryWdsList: fetchDataFunction(false, effects.getHistoryWdsList),
  clearSearchHistoryList: fetchDataFunction(false, effects.clearSearchHistoryList),
  saveSearchVal: fetchDataFunction(false, effects.saveSearchVal),
  getIncomeData: fetchDataFunction(true, effects.getIncomeData),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getToBeDone: PropTypes.func.isRequired,
    performanceIndicators: PropTypes.object,
    collectCustRange: PropTypes.func.isRequired,
    getPerformanceIndicators: PropTypes.func.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    getHotWds: PropTypes.func.isRequired,
    getHistoryWdsList: PropTypes.func.isRequired,
    clearSearchHistoryList: PropTypes.func.isRequired,
    saveSearchVal: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    position: PropTypes.object,
    process: PropTypes.object,
    motTaskCount: PropTypes.number,
    empInfo: PropTypes.object,
    hotPossibleWdsList: PropTypes.array,
    hotWds: PropTypes.object,
    historyWdsList: PropTypes.array,
    clearState: PropTypes.object,
    searchHistoryVal: PropTypes.string,
    incomeData: PropTypes.array,
    getIncomeData: PropTypes.func.isRequired,
    getViewpoints: PropTypes.func.isRequired,
    viewpoints: PropTypes.array,
    lastAddCusts: PropTypes.array,
    getLastAddCust: PropTypes.func.isRequired,
    getServiceIndicators: PropTypes.func.isRequired,
    serviceIndicators: PropTypes.array,
  }

  static defaultProps = {
    performanceIndicators: EMPTY_OBJECT,
    custRange: EMPTY_LIST,
    cycle: EMPTY_LIST,
    collectCustRange: () => { },
    position: EMPTY_OBJECT,
    process: EMPTY_OBJECT,
    motTaskCount: 0,
    empInfo: EMPTY_OBJECT,
    hotPossibleWdsList: EMPTY_LIST,
    hotWds: EMPTY_OBJECT,
    historyWdsList: EMPTY_LIST,
    clearState: EMPTY_OBJECT,
    searchHistoryVal: '',
    incomeData: EMPTY_LIST,
    viewpoints: EMPTY_LIST,
    lastAddCusts: EMPTY_LIST,
    serviceIndicators: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      cycleSelect: '',
      fspOrgId: '', // 主服务经理
      createCustRange: [],
      expandAll: false,
      isHasAuthorize: false,
    };
  }

  componentDidMount() {
    const {
      custRange,
      location: { query: { orgId = '', cycleSelect = '' } },
      empInfo: { empInfo, empRespList },
      position: { orgId: posOrgId = '' },
    } = this.props;

    // 初始化时，判断url上存在orgId
    let fspOrgId = '';
    if (orgId === '') {
      fspOrgId = posOrgId;
    } else {
      fspOrgId = orgId;
    }

    const { begin, end } = this.getTimeSelectBeginAndEnd();
    this.getAllInfo({
      custRange,
      empInfo,
      empRespList,
      posOrgId: fspOrgId,
      cycleSelect,
      begin,
      end,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      position: prePosition,
      empInfo: { empInfo, empRespList },
      location: { query: prevQuery = EMPTY_OBJECT },
      custRange,
    } = this.props;

    const {
      position: nextPosition,
      cycle: nextCycle,
      location: { query: { cycleSelect: nextCycleSelect = '' } },
   } = nextProps;

    const { cycleSelect = '' } = prevQuery;

    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;

    // FSP职责切换，position变化
    if (preOrgId !== nextOrgId) {
      this.setState({
        fspOrgId: nextOrgId,
      }, () => {
        const { begin, end } = this.getTimeSelectBeginAndEnd();
        this.getAllInfo({
          custRange,
          empInfo,
          empRespList,
          posOrgId: nextOrgId,
          cycleSelect: nextCycleSelect,
          begin,
          end,
        });
      });
    }
    // 当url上没有cycleSelect时，默认选中第一个，本月
    if (!cycleSelect) {
      this.setState({
        cycleSelect: (nextCycle[0] || {}).key,
      });
    }

    // 当url上有cycleSelect时，更新state
    if (cycleSelect !== nextCycleSelect) {
      this.setState({
        cycleSelect: nextCycleSelect,
      });
    }
  }

  @autobind
  getIndicators({ orgId, cycleSelect }) {
    const { getPerformanceIndicators, custRange, cycle } = this.props;
    const { fspOrgId } = this.state;
    let custType = ORG;
    if (custRange.length < 1) {
      return null;
    }
    if (!_.isEmpty(orgId || fspOrgId)) { // 判断客户范围类型
      custType = ORG;
    } else {
      custType = CUST_MANAGER;
    }
    getPerformanceIndicators({
      custType, // 客户范围类型
      dateType: cycleSelect || (!_.isEmpty(cycle) ? cycle[0].key : ''), // 周期类型
      orgId: orgId || fspOrgId, // 组织ID
    });
    return null;
  }

  @autobind
  getIncomes({ begin, end, orgId, cycleSelect }) {
    const { getIncomeData, custRange, cycle } = this.props;
    const { fspOrgId } = this.state;
    let custType = ORG;
    if (custRange.length < 1) {
      return null;
    }
    if (!_.isEmpty(orgId || fspOrgId)) { // 判断客户范围类型
      custType = ORG;
    } else {
      custType = CUST_MANAGER;
    }
    getIncomeData({
      custType, // 客户范围类型
      dateType: cycleSelect || (!_.isEmpty(cycle) ? cycle[0].key : ''), // 周期类型
      orgId: orgId || fspOrgId, // 组织ID
      empId: helper.getEmpId(),
      fieldList: [
        'tranPurRakeCopy',
        'totCrdtIntCopy',
        'totTranInt',
        'pIncomeAmt',
        'prdtOIncomeAmt',
        'oIncomeAmt',
      ],
      begin,
      end,
    });
    return null;
  }

  @autobind
  getTimeSelectBeginAndEnd() {
    const { location: { query: { cycleSelect } } } = this.props;
    const { historyTime, customerPoolTimeSelect } = optionsMap;
    const currentSelect = _.find(historyTime, itemData =>
      itemData.name === _.find(customerPoolTimeSelect, item =>
        item.key === (cycleSelect || '518003')).name) || {}; // 本月
    const nowDuration = getDurationString(currentSelect.key);
    const begin = nowDuration.begin;
    const end = nowDuration.end;
    return {
      begin,
      end,
    };
  }

  @autobind
  getAllInfo({ custRange, empInfo, empRespList, posOrgId, cycleSelect, begin, end }) {
    this.setState({
      cycleSelect,
      createCustRange: this.handleCreateCustRange({
        begin,
        end,
        custRange,
        empInfo,
        empRespList,
        posOrgId,
        cycleSelect,
      }),
    });
  }

  @autobind
  handleGetAllInfo(begin, end, cycleSelect) {
    const { fspOrgId } = this.state;
    const {
      getServiceIndicators,
      getLastAddCust,
      getViewpoints,
      getToBeDone,
      getHotWds,
      getHistoryWdsList,
      location: { pathname, query },
      replace,
    } = this.props;

    // 热词搜索
    getHotWds({
      orgId: fspOrgId === '' ? null : fspOrgId, // 组织ID
      empNo: helper.getEmpId(), // 用户ID
    });

    // 历史搜索记录
    getHistoryWdsList({
      orgId: fspOrgId === '' ? null : fspOrgId, // 组织ID
      empNo: helper.getEmpId(), // 用户ID
    });

    // 待办事项
    getToBeDone();
    // 首席投顾观点
    getViewpoints();
    // 新增客户
    getLastAddCust();
    // 服务指标
    getServiceIndicators();

    // 净创收数据
    this.getIncomes({ begin, end, orgId: fspOrgId, cycleSelect });

    // 绩效指标
    this.getIndicators({ orgId: fspOrgId, cycleSelect });

    // 替换url orgId
    replace({
      pathname,
      query: {
        ...query,
        orgId: fspOrgId,
      },
    });
  }

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(params) {
    const { replace, location: { pathname, query } } = this.props;
    const { begin, end, cycleSelect = '', orgId = '' } = params;
    const { fspOrgId, cycleSelect: currentCycleSelect } = this.state;
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    this.setState({
      cycleSelect: cycleSelect || currentCycleSelect, // 切换组织机构树的时候并没有cycleSelect
      fspOrgId: orgId === 'msm' ? '' : fspOrgId, // 切换时间的时候并没有组织机构
    }, () => {
      if (orgId) {
        replace({
          pathname,
          query: {
            ...query,
            orgId,
          },
        });
      } else if (cycleSelect) {
        replace({
          pathname,
          query: {
            ...query,
            cycleSelect,
          },
        });
      }

      // 时间或者组织机构树变化
      // 重新请求绩效指标数据和净创收数据
      this.getIndicators({
        orgId: orgId === 'msm' ? '' : orgId,
        cycleSelect: cycleSelect || currentCycleSelect,
      });
      this.getIncomes({
        begin,
        end,
        orgId: orgId === 'msm' ? '' : orgId,
        cycleSelect: cycleSelect || currentCycleSelect,
      });
    });
  }

  // 获取联想数据
  @autobind
  queryHotPossibleWds(state) {
    const { getHotPossibleWds } = this.props;
    const { fspOrgId } = this.state;
    const setData = {
      orgId: fspOrgId, // 组织ID
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
    const { fspOrgId } = this.state;
    const setData = {
      orgId: fspOrgId === '' ? null : fspOrgId, // 组织ID
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
    const { fspOrgId } = this.state;
    const setData = {
      orgId: fspOrgId === '' ? null : fspOrgId, // 组织ID
      empNo: helper.getEmpId(), // 用户ID
    };
    clearSearchHistoryList({
      ...setData,
    });
  }

  /**
   * 创建客户范围
   * @param {*} props 最新的props
   */
  @autobind
  handleCreateCustRange({
    begin,
    end,
    custRange,
    empInfo,
    empRespList,
    posOrgId,
    cycleSelect,
  }) {
    // 判断是否存在首页绩效指标查看权限
    const respIdOfPosition = _.find(empRespList, item => (item.respId === HTSC_RESPID));
    const myCustomer = {
      id: MAIN_MAGEGER_ID,
      name: '我的客户',
    };
    // 无‘HTSC 首页指标查询’职责的普通用户，取值 '我的客户'
    if (!respIdOfPosition) {
      this.setState({
        fspOrgId: '',
      }, () => {
        this.handleGetAllInfo(begin, end, cycleSelect);
      });
      return [myCustomer];
    }

    // 保证全局的职位存在的情况下取职位, 取不到时从empInfo中取值
    const occDivnNum = empInfo.occDivnNum || '';
    // let fspJobOrgId = 'ZZ001041048';
    let fspJobOrgId = !_.isEmpty(window.forReactPosition) ?
      window.forReactPosition.orgId :
      occDivnNum;
    if (posOrgId) {
      fspJobOrgId = posOrgId;
    }
    this.setState({
      fspOrgId: fspJobOrgId,
      isHasAuthorize: true,
    }, () => {
      this.handleGetAllInfo(begin, end, cycleSelect);
    });
    // 只要不是我的客户，都展开组织机构树
    // 用户职位是经总
    if (fspJobOrgId === (custRange[0] || {}).id) {
      this.setState({
        expandAll: true,
      });
      return custRange;
    }
    // fspJobOrgId 在机构树中所处的分公司位置
    const groupInCustRange = _.find(custRange, item => item.id === fspJobOrgId);
    if (groupInCustRange) {
      this.setState({
        expandAll: true,
      });
      return [groupInCustRange, myCustomer];
    }
    // fspJobOrgId 在机构树中所处的营业部位置
    // let tempData = custRange;
    // tempData = _.filter(_.filter(tempData, i => i.level !== '1'),
    //   (itemData) => {
    //     if (_.isEmpty(itemData.children)) {
    //       return itemData.id === fspJobOrgId;
    //     }
    //     return !_.isEmpty(_.filter(itemData.children, c => c.id === fspJobOrgId) || []);
    //   }) || [];
    // if (!_.isEmpty(tempData)) {
    //   this.setState({
    //     expandAll: true,
    //   });
    //   return [...tempData, myCustomer];

    let department;
    _(custRange).forEach((obj) => {
      if (obj.children && !_.isEmpty(obj.children)) {
        const targetValue = _.find(obj.children, o => o.id === fspJobOrgId);
        if (targetValue) {
          department = [targetValue, myCustomer];
        }
      }
    });

    if (department) {
      return department;
    }
    // 有权限，但是用户信息中获取到的occDivnNum不在empOrg（组织机构树）中，显示用户信息中的数据
    return [{
      id: empInfo.occDivnNum,
      name: empInfo.occupation,
    }];
  }

  @autobind
  handleSaveSearchVal(obj) {
    const { saveSearchVal } = this.props;
    saveSearchVal(
      obj,
    );
  }

  @autobind
  renderTabsExtra() {
    const {
      custRange,
      replace,
      collectCustRange,
      cycle,
      location,
    } = this.props;
    const {
      expandAll,
      cycleSelect,
      createCustRange,
      fspOrgId,
      isHasAuthorize,
    } = this.state;
    const extraProps = {
      custRange: createCustRange,
      replace,
      updateQueryState: this.updateQueryState,
      collectCustRange,
      cycle,
      expandAll,
      selectValue: cycleSelect,
      location,
      orgId: isHasAuthorize ? (fspOrgId || custRange[0].id) : null,
    };
    return (<TabsExtra {...extraProps} />);
  }

  render() {
    const {
      performanceIndicators,
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
      incomeData,
      viewpoints,
      lastAddCusts,
      serviceIndicators,
    } = this.props;
    const { fspOrgId } = this.state;
    return (
      <div className={styles.customerPoolWrap}>
        <Search
          data={hotWds}
          queryHotPossibleWds={this.queryHotPossibleWds}
          queryHistoryWdsList={this.queryHistoryWdsList}
          queryHotWdsData={hotPossibleWdsList}
          push={push}
          orgId={fspOrgId}
          historyWdsList={historyWdsList}
          clearSuccess={clearState}
          clearFun={this.clearHistoryList}
          searchHistoryVal={searchHistoryVal}
          saveSearchVal={this.handleSaveSearchVal}
        />
        <div className={styles.poolContainer}>
          <div className={styles.content}>
            <ToBeDone
              push={push}
              data={process}
              motTaskCountData={motTaskCount}
            />
            <Tabs
              tabBarExtraContent={this.renderTabsExtra()}
              defaultActiveKey="1"
              onChange={this.callback}
            >
              <TabPane tab="经营指标" key="1">
                <PerformanceIndicators
                  push={push}
                  indicators={performanceIndicators}
                  location={location}
                  cycle={cycle}
                  incomeData={incomeData}
                  lastAddCusts={lastAddCusts}
                  serviceIndicators={serviceIndicators}
                />
              </TabPane>
              <TabPane tab="投顾绩效" key="2">
                <PerformanceIndicators
                  push={push}
                  indicators={performanceIndicators}
                  location={location}
                  cycle={cycle}
                  incomeData={incomeData}
                  lastAddCusts={lastAddCusts}
                  serviceIndicators={serviceIndicators}
                />
              </TabPane>
            </Tabs>
          </div>
          <div className={styles.viewPoint}>
            <Viewpoint dataSource={viewpoints} />
          </div>
        </div>
      </div>
    );
  }
}
