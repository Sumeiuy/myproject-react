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
import PerformanceIndicators from '../../components/customerPool/PerformanceIndicators';
import ToBeDone from '../../components/customerPool/ToBeDone';
import { helper } from '../../utils';
import Search from '../../components/customerPool/Search';
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
};

const fectchDataFunction = (globalLoading, type) => query => ({
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
  empAllInfo: state.app.empAllInfo, // 职位信息
  hotPossibleWdsList: state.customerPool.hotPossibleWdsList, // 联想的推荐热词列表
  hotWds: state.customerPool.hotWds, // 默认推荐词及热词推荐列表
  historyWdsList: state.customerPool.historyWdsList, // 历史搜索
  clearState: state.customerPool.clearState, // 清除历史列表
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getPerformanceIndicators: fectchDataFunction(true, effects.performanceIndicators),
  getHotPossibleWds: fectchDataFunction(false, effects.getHotPossibleWds),
  getHotWds: fectchDataFunction(true, effects.getHotWds),
  getHistoryWdsList: fectchDataFunction(false, effects.getHistoryWdsList),
  clearSearchHistoryList: fectchDataFunction(false, effects.clearSearchHistoryList),
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
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    position: PropTypes.object,
    process: PropTypes.number,
    motTaskCount: PropTypes.number,
    empAllInfo: PropTypes.object,
    hotPossibleWdsList: PropTypes.array,
    hotWds: PropTypes.object,
    historyWdsList: PropTypes.array,
    clearState: PropTypes.object,
  }

  static defaultProps = {
    performanceIndicators: EMPTY_OBJECT,
    custRange: EMPTY_LIST,
    cycle: EMPTY_LIST,
    collectCustRange: () => { },
    position: EMPTY_OBJECT,
    process: 0,
    motTaskCount: 0,
    empAllInfo: EMPTY_OBJECT,
    hotPossibleWdsList: EMPTY_LIST,
    hotWds: EMPTY_OBJECT,
    historyWdsList: EMPTY_LIST,
    clearState: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      cycleSelect: '',
      orgId: '',
      fspOrgId: '',
      createCustRange: [],
      expandAll: false,
    };
  }

  componentDidMount() {
    const { custRange } = this.props;
    if (custRange.length > 0) {
      this.handleSetCustRange(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location: preLocation,
      position: prePosition,
      custRange: preCustRange, cycle: preCycle } = this.props;
    const { location: nextLocation,
      position: nextPosition,
      custRange: nextCustRange, cycle: nextCycle } = nextProps;
    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;
    if (preOrgId !== nextOrgId) {
      this.setState({
        fspOrgId: nextOrgId,
        createCustRange: this.handleCreateCustRange(nextOrgId, nextProps),
      }, this.getIndicators);
    }
    if (preCycle !== nextCycle) {
      this.setState({
        cycleSelect: nextCycle[0].key,
      });
    }
    if (preCustRange !== nextCustRange || preLocation !== nextLocation) {
      this.handleSetCustRange(nextProps);
      // this.setState({
      //   createCustRange: this.handleCreateCustRange(null, nextProps),
      // });
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
  handleSetCustRange(props) {
    const { location: { query }, custRange,
      empAllInfo: { empInfo = EMPTY_OBJECT, empRespList } } = props;
    const { occDivnNum = '' } = empInfo;
    const { orgId } = query;
    const occ = _.isEmpty(occDivnNum) ? '' : occDivnNum;// orgId取不到的情况下去用户信息中的
    const fspOrgid = _.isEmpty(window.forReactPosition) ? occ : window.forReactPosition.orgId;
    const orgid = _.isEmpty(orgId) // window.forReactPosition
      ?
      fspOrgid
      : orgId;
    const respIdOfPosition = _.findIndex(empRespList, item => item.respId === HTSC_RESPID);
    this.setState({
      fspOrgId: respIdOfPosition < 0 ? '' : orgid,
      orgId: respIdOfPosition < 0 ? '' : orgid, // 组织ID
    }, () => {
      if (custRange.length > 0) {
        this.handleGetAllInfo(custRange);
      }
    });
    return true;
  }

  @autobind
  handleGetAllInfo(custRangeData = EMPTY_LIST) {
    const { getAllInfo, cycle, getHotWds, getHistoryWdsList } = this.props;
    const { fspOrgId } = this.state;
    let custType = ORG;
    const orgsId = custRangeData.length > 0 ? custRangeData[0].id : '';
    this.setState({
      createCustRange: this.handleCreateCustRange(fspOrgId, this.props),
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
        // dateType: '', // 周期类型
        orgId: fspOrgId, // 组织ID
      },
    });
  }

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(state) {
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    this.setState({
      ...state,
    },
      () => {
        this.getIndicators();
      });
  }

  // 获取联想数据
  @autobind
  queryHotPossibleWds(state) {
    const { getHotPossibleWds } = this.props;
    const { fspOrgId } = this.state;
    const setData = {
      orgId: fspOrgId === '' ? null : fspOrgId, // 组织ID
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

  @autobind
  handleCreateCustRange(orgId, nextProps) {
    const { empAllInfo, custRange } = nextProps;
    const { empPostnList = EMPTY_LIST,
      empRespList = EMPTY_LIST } = empAllInfo; // 1-46IDNZI HTSC_RESPID
    const { fspOrgId } = this.state;
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
    let newOrgId = fspOrgId;
    if (!_.isEmpty(orgId)) {
      newOrgId = orgId;
    }
    if (custRange.length < 1) {
      return null;
    }
    if (newOrgId === custRange[0].id) {
      return custRange;
    }
    this.setState({
      expandAll: true,
    });
    orgNewCustRange = _.findIndex(custRange, item => item.id === newOrgId);
    let newData;
    if (orgNewCustRange > -1) { // 总机构内
      newData = custRange[orgNewCustRange];
      newCustRrange.push(newData);
    } else { // 职位中去查找
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
        />
        <div className={styles.content}>
          <ToBeDone
            processData={process}
            motTaskCountData={motTaskCount}
          />
          <PerformanceIndicators
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
