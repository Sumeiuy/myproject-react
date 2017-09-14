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
import { getDurationString } from '../../utils/helper';
import { optionsMap } from '../../config';
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
// 主服务经理id
const MAIN_MAGEGER_ID = 'msm';
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

  componentDidMount() {
    const {
      custRange,
    } = this.props;
    this.handleGetAllInfo(custRange);
  }

  componentWillReceiveProps(nextProps) {
    const {
      position: prePosition,
      // empInfo: { empInfo: prevEmpInfo = EMPTY_OBJECT },
      location: { query: prevQuery = EMPTY_OBJECT },
      // cycle: preCycle,
      // custRange: prevCustRange = EMPTY_LIST,
    } = this.props;

    const {
      position: nextPosition,
      cycle: nextCycle,
      custRange = EMPTY_LIST,
      location: { query = EMPTY_OBJECT },
      empInfo: { empInfo: nextEmpInfo = EMPTY_OBJECT, empRespList = EMPTY_LIST },
   } = nextProps;

    const { cycleSelect } = prevQuery;

    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;

    // FSP职责切换，position变化
    if (preOrgId !== nextOrgId) {
      this.setState({
        fspOrgId: nextOrgId,
        createCustRange: this.handleCreateCustRange(nextProps),
      }, () => {
        this.getIncomes();
        this.getIndicators();
      });
    }
    // 当url上没有cycleSelect时，默认选中第一个，本月
    if (!cycleSelect) {
      this.setState({
        cycleSelect: (nextCycle[0] || {}).key,
      });
    }

    // 问题出在这里，在第一次比较empInfo的时候，custRange有可能还没回来，再等第二次比较
    // empInfo，这时候empInfo已经相等，所以custRange有值也不走getAllInfo了
    if (!_.isEqual(prevQuery, query)
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
  getIncomes({ begin, end }) {
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
  createCustRange({ query, empInfo, custRange, empRespList }) {
    this.handleSetCustRange({
      empInfo,
      empRespList,
      query,
      custRange,
    });
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
    const {
      getAllInfo,
      // cycle,
      getHotWds,
      getHistoryWdsList,
      location: { query: { cycleSelect } },
    } = this.props;
    const { fspOrgId } = this.state;
    const { historyTime, customerPoolTimeSelect } = optionsMap;
    const currentSelect = _.find(historyTime, itemData =>
      itemData.name === _.find(customerPoolTimeSelect, item => item.key === (cycleSelect || '518003')).name) || {}; // 本月
    const nowDuration = getDurationString(currentSelect.key);
    const begin = nowDuration.begin;
    const end = nowDuration.end;
    let custType = ORG;
    const orgsId = custRangeData.length > 0 ? custRangeData[0].id : '';
    this.setState({
      createCustRange: this.handleCreateCustRange(this.props),
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
      cycleSelect,
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
          'tranPurRakeCopy',
          'totCrdtIntCopy',
          'totTranInt',
          'pIncomeAmt',
          'prdtOIncomeAmt',
          'oIncomeAmt',
        ],
        begin,
        end,
      },
    });

    // 重置
    this.isGetAllInfo = false;
  }

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(state) {
    const { replace, location: { pathname, query } } = this.props;
    const { begin, end } = state;
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    this.setState({
      ...state,
    }, () => {
      this.getIndicators();
      this.getIncomes({
        begin,
        end,
      });
      if (state.orgId) {
        replace({
          pathname,
          query: {
            ...query,
            orgId: state.orgId || state.fspOrgId,
          },
        });
      } else if (state.cycleSelect) {
        replace({
          pathname,
          query: {
            ...query,
            cycleSelect: state.cycleSelect,
          },
        });
      }
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
  handleCreateCustRange(props) {
    const {
      custRange,
      empInfo: {
        empInfo = EMPTY_OBJECT,
        empRespList = EMPTY_LIST,
      },
      position: { orgId: posOrgId },
    } = props;
    // 判断是否存在首页绩效指标查看权限
    const respIdOfPosition = _.find(empRespList, item => (item.respId === HTSC_RESPID));
    const myCustomer = {
      id: MAIN_MAGEGER_ID,
      name: '我的客户',
    };
    // 无‘HTSC 首页指标查询’职责的普通用户，取值 '我的客户'
    if (!respIdOfPosition) {
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
      incomeData,
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
            incomeData={incomeData}
          />
        </div>
      </div>
    );
  }
}
