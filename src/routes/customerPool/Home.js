/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import PerformanceIndicators from '../../components/customerPool/home/PerformanceIndicators';
import ToBeDone from '../../components/customerPool/home/ToBeDone';
import { helper } from '../../utils';
import Search from '../../components/customerPool/home/Search';
import styles from './home.less';

const CUST_MANAGER = '1'; // 客户经理
// const CUST_MANAGER_TEAM = 2; // 客户经理团队
const ORG = '3'; // 组织机构
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const HTSC_RESPID = '1-46IDNZI'; // 首页指标查询
const effects = {
  allInfo: 'customerPool/getAllInfo',
  performanceIndicators: 'customerPool/getPerformanceIndicators',
  getHotPossibleWds: 'customerPool/getHotPossibleWds',
  getHotWds: 'customerPool/getHotWds',
  getHistoryWdsList: 'customerPool/getHistoryWdsList',
  clearSearchHistoryList: 'customerPool/clearSearchHistoryList',
  saveSearchVal: 'customerPool/saveSearchVal',
  getIncomeData: 'customerPool/getIncomeData',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  performanceIndicators: state.customerPool.performanceIndicators, // 绩效指标
  custRange: state.customerPool.custRange, // 客户池用户范围
  cycle: state.customerPool.cycle,  // 统计周期
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
});

const mapDispatchToProps = {
  getAllInfo: fetchDataFunction(true, effects.allInfo),
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
    getAllInfo: PropTypes.func.isRequired,
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
  }

  constructor(props) {
    super(props);
    this.isGetAllInfo = true;
    this.state = {
      cycleSelect: '',
      orgId: '',
      fspOrgId: '',
      createCustRange: [],
      expandAll: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      position: prePosition,
      empInfo: { empInfo: prevEmpInfo = EMPTY_OBJECT },
      location: { query: prevQuery = EMPTY_OBJECT },
      cycle: preCycle,
      // custRange: prevCustRange = EMPTY_LIST,
    } = this.props;

    const {
      position: nextPosition,
      cycle: nextCycle,
      custRange = EMPTY_LIST,
      location: { query = EMPTY_OBJECT },
      empInfo: { empInfo: nextEmpInfo = EMPTY_OBJECT, empRespList = EMPTY_LIST },
   } = nextProps;

    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;

    // FSP职责切换，position变化
    if (preOrgId !== nextOrgId) {
      this.setState({
        fspOrgId: nextOrgId,
        createCustRange: this.handleCreateCustRange({
          orgId: nextOrgId,
          empInfo: nextEmpInfo,
          custRange,
        }),
      }, () => {
        this.getIncomes();
        this.getIndicators();
      });
    }
    if (preCycle !== nextCycle) {
      this.setState({
        cycleSelect: nextCycle[0].key,
      });
    }

    // 问题出在这里，在第一次比较empInfo的时候，custRange有可能还没回来，再等第二次比较
    // empInfo，这时候empInfo已经相等，所以custRange有值也不走getAllInfo了
    if (prevEmpInfo !== nextEmpInfo || query !== prevQuery
      || (!_.isEmpty(custRange) && this.isGetAllInfo)) {
      this.handleSetCustRange({
        empInfo: nextEmpInfo,
        empRespList,
        query,
        custRange,
      });
    }
  }

  @autobind
  getIndicators() {
    const { getPerformanceIndicators, custRange } = this.props;
    const { orgId, cycleSelect } = this.state;
    let custType = ORG;
    if (custRange.length < 1) {
      return null;
    }
    if (!_.isEmpty(orgId)) { // 判断客户范围类型
      custType = ORG;
    } else {
      custType = CUST_MANAGER;
    }
    getPerformanceIndicators({
      custType, // 客户范围类型
      dateType: cycleSelect, // 周期类型
      orgId, // 组织ID
    });
    return null;
  }

  @autobind
  getIncomes() {
    const { getIncomeData, custRange } = this.props;
    const { orgId, cycleSelect } = this.state;
    let custType = ORG;
    if (custRange.length < 1) {
      return null;
    }
    if (!_.isEmpty(orgId)) { // 判断客户范围类型
      custType = ORG;
    } else {
      custType = CUST_MANAGER;
    }
    getIncomeData({
      custType, // 客户范围类型
      dateType: cycleSelect, // 周期类型
      orgId, // 组织ID
      empId: helper.getEmpId(),
      fieldList: [
        'tranPurRakeCopy', 'totCrdtIntCopy', 'totTranInt', 'pIncomeAmt',
      ],
      begin: '20170901',
      end: '20170905',
    });
    return null;
  }

  @autobind
  handleSetCustRange(params) {
    const {
      empInfo,
      empRespList,
      query,
      custRange,
    } = params;
    const { occDivnNum = '' } = empInfo;
    const { orgId } = query;
    const occ = _.isEmpty(occDivnNum) ? '' : occDivnNum;// orgId取不到的情况下去用户信息中的
    const fspOrgid = _.isEmpty(window.forReactPosition) ? occ : window.forReactPosition.orgId;
    // url中存在orgid，则取url中的orgid，不然取fspOrgid
    const orgid = _.isEmpty(orgId) // window.forReactPosition
      ?
      fspOrgid
      : orgId;
    const respIdOfPosition = _.findIndex(empRespList, item => item.respId === HTSC_RESPID);
    this.setState({
      fspOrgId: respIdOfPosition < 0 ? '' : orgid,
      orgId: respIdOfPosition < 0 ? '' : orgid, // 组织ID
    }, () => {
      if (custRange.length > 0 && this.isGetAllInfo) {
        this.handleGetAllInfo(custRange);
      }
    });
  }

  @autobind
  handleGetAllInfo(custRangeData = EMPTY_LIST) {
    const { getAllInfo, cycle, getHotWds, getHistoryWdsList, empInfo, custRange } = this.props;
    const { fspOrgId } = this.state;
    let custType = ORG;
    const orgsId = custRangeData.length > 0 ? custRangeData[0].id : '';
    this.setState({
      createCustRange: this.handleCreateCustRange({
        empInfo,
        custRange,
        orgId: fspOrgId,
      }),
    });

    if (fspOrgId !== orgsId) {
      this.setState({
        expandAll: true,
      });
    }
    if (!_.isEmpty(fspOrgId)) { // 判断客户范围类型
      custType = ORG;
    } else {
      custType = CUST_MANAGER;
    }
    this.setState({
      cycleSelect: cycle.length > 0 ? cycle[0].key : '',
    });
    getHotWds({
      orgId: fspOrgId === '' ? null : fspOrgId, // 组织ID
      empNo: helper.getEmpId(), // 用户ID
    });
    getHistoryWdsList({
      orgId: fspOrgId === '' ? null : fspOrgId, // 组织ID
      empNo: helper.getEmpId(), // 用户ID
    });
    getAllInfo({
      request: {
        custType, // 客户范围类型
        orgId: fspOrgId, // 组织ID,
        empId: helper.getEmpId(),
        fieldList: [
          'tranPurRakeCopy', 'totCrdtIntCopy', 'totTranInt', 'pIncomeAmt',
        ],
        begin: '20170901',
        end: '20170905',
      },
    });

    // 重置
    this.isGetAllInfo = false;
  }

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(state) {
    const { replace, location: { pathname, query } } = this.props;
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    this.setState({
      ...state,
    }, () => {
      this.getIndicators();
      this.getIncomes();
      replace({
        pathname,
        query: {
          ...query,
          orgId: state.orgId || state.fspOrgId,
        },
      });
    });
  }

  // 获取联想数据
  @autobind
  queryHotPossibleWds(state) {
    const { location: { query },
      empInfo: { empInfo = EMPTY_OBJECT }, getHotPossibleWds } = this.props;
    const { occDivnNum = '' } = empInfo;
    const { orgId } = query;
    const occ = _.isEmpty(occDivnNum) ? '' : occDivnNum;// orgId取不到的情况下去用户信息中的
    const fspOrgid = _.isEmpty(window.forReactPosition) ? occ : window.forReactPosition.orgId;
    const orgid = _.isEmpty(orgId) // window.forReactPosition
      ?
      fspOrgid
      : orgId;
    const setData = {
      orgId: orgid, // 组织ID
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
   * @param {*} orgId 组织机构Id
   * @param {*} nextProps 最新的props
   */
  @autobind
  handleCreateCustRange(params) {
    const { empInfo, custRange, orgId } = params;
    const { empPostnList = EMPTY_LIST,
      empRespList = EMPTY_LIST } = empInfo; // 1-46IDNZI HTSC_RESPID
    let orgNewCustRange = [];
    const newCustRrange = [];
    const myCustomer = {
      id: '',
      name: '我的客户',
    };
    const respIdOfPosition = _.findIndex(empRespList, item => item.respId === HTSC_RESPID);
    if (respIdOfPosition < 0) {
      newCustRrange.push(myCustomer);
      return newCustRrange;
    }
    let newOrgId;
    if (!_.isEmpty(orgId)) {
      newOrgId = orgId;
    }
    if (custRange.length < 1) {
      return null;
    }
    if (newOrgId === custRange[0].id) {
      return custRange;
    }
    // 打开级联下拉框
    this.setState({
      expandAll: true,
    });
    orgNewCustRange = _.findIndex(custRange, item => item.id === newOrgId);
    let newData;
    if (orgNewCustRange > -1) {
      // 总机构内
      newData = custRange[orgNewCustRange];
      newCustRrange.push(newData);
    } else {
      // 职位中去查找
      // 找到符合的那一条职位
      orgNewCustRange = _.findIndex(empPostnList, item => item.orgId === newOrgId);
      if (orgNewCustRange > -1) {
        const org = {
          id: empPostnList[orgNewCustRange].orgId,
          name: empPostnList[orgNewCustRange].orgName,
        };
        newData = org;
        newCustRrange.push(newData);
      }
    }
    newCustRrange.push(myCustomer);
    return newCustRrange;
  }

  @autobind
  handleSaveSearchVal(obj) {
    const { saveSearchVal } = this.props;
    saveSearchVal(
      obj,
    );
  }

  render() {
    const {
      performanceIndicators,
      location,
      replace,
      collectCustRange,
      process,
      cycle,
      motTaskCount,
      hotWds,
      hotPossibleWdsList,
      push,
      historyWdsList,
      clearState,
      searchHistoryVal,
    } = this.props;
    const { expandAll, cycleSelect, createCustRange, fspOrgId } = this.state;
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
        <div className={styles.content}>
          <ToBeDone
            push={push}
            data={process}
            motTaskCountData={motTaskCount}
          />
          <PerformanceIndicators
            push={push}
            indicators={performanceIndicators}
            custRange={createCustRange}
            updateQueryState={this.updateQueryState}
            collectCustRange={collectCustRange}
            location={location}
            replace={replace}
            cycle={cycle}
            expandAll={expandAll}
            selectValue={cycleSelect}
          />
        </div>
      </div>
    );
  }
}
