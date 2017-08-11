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
const effects = {
  allInfo: 'customerPool/getAllInfo',
  performanceIndicators: 'customerPool/getPerformanceIndicators',
  getHotPossibleWds: 'customerPool/getHotPossibleWds',
  getHotWds: 'customerPool/getHotWds',
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
  empInfo: state.app.empInfo, // 职位信息
  hotPossibleWdsList: state.customerPool.hotPossibleWdsList, // 联想的推荐热词列表
  hotWds: state.customerPool.hotWds, // 默认推荐词及热词推荐列表
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getPerformanceIndicators: fectchDataFunction(true, effects.performanceIndicators),
  getHotPossibleWds: fectchDataFunction(false, effects.getHotPossibleWds),
  getHotWds: fectchDataFunction(true, effects.getHotWds),
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
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    position: PropTypes.object,
    process: PropTypes.number,
    motTaskCount: PropTypes.number,
    empInfo: PropTypes.object,
    hotPossibleWdsList: PropTypes.array,
    hotWds: PropTypes.object,
  }

  static defaultProps = {
    performanceIndicators: EMPTY_OBJECT,
    custRange: EMPTY_LIST,
    cycle: EMPTY_LIST,
    collectCustRange: () => { },
    position: EMPTY_OBJECT,
    process: 0,
    motTaskCount: 0,
    empInfo: EMPTY_OBJECT,
    hotPossibleWdsList: EMPTY_LIST,
    hotWds: EMPTY_OBJECT,
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

  componentWillMount() {
    const orgid = _.isEmpty(window.forReactPosition) ? 'ZZ001041' : window.forReactPosition.orgId;
    const { custRange } = this.props;
    this.setState({
      fspOrgId: orgid,
      orgId: orgid, // 组织ID
    }, () => {
      if (custRange.length > 0) {
        this.handleGetAllInfo(custRange);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location: preLocation,
      position: prePosition, custRange: preCustRange, cycle: preCycle } = this.props;
    const { location: nextLocation,
      position: nextPosition, custRange: nextCustRange, cycle: nextCycle } = nextProps;
    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;
    if (preOrgId !== nextOrgId) {
      this.setState({
        fspOrgId: nextOrgId,
        createCustRange: this.handleCreateCustRange(nextOrgId, nextProps),
      }, this.getIndicators);
    }
    if (!_.isEqual(preCycle, nextCycle)) {
      this.setState({
        cycleSelect: nextCycle[0].key,
      });
    }
    if (!_.isEqual(preCustRange, nextCustRange) || preLocation !== nextLocation) {
      this.handleGetAllInfo(nextCustRange);
      this.setState({
        createCustRange: this.handleCreateCustRange(null, nextProps),
      });
    }
  }

  @autobind
  getIndicators() {
    const { getPerformanceIndicators, custRange } = this.props;
    const { fspOrgId, orgId, cycleSelect } = this.state;
    let custType = ORG;
    if (custRange.length < 1) {
      return null;
    }
    if (fspOrgId === custRange[0].id) { // 判断客户范围类型
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
  handleGetAllInfo(custRangeData) {
    const { getAllInfo, cycle, getHotWds } = this.props;
    const { fspOrgId } = this.state;
    let custType = ORG;
    const orgsId = custRangeData.length > 0 ? custRangeData[0].id : '';
    this.setState({
      createCustRange: this.handleCreateCustRange(fspOrgId, this.props),
    });
    if (fspOrgId === orgsId) { // 判断客户范围类型
      custType = ORG;
    } else {
      this.setState({
        expandAll: true,
      });
      custType = CUST_MANAGER;
    }
    this.setState({
      cycleSelect: cycle.length > 0 ? cycle[0].key : '',
    });
    getHotWds({
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

  @autobind
  handleCreateCustRange(orgId, nextProps) {
    const { empInfo, custRange } = nextProps;
    const { empPostnList } = empInfo;
    const { fspOrgId } = this.state;
    let newOrgId = fspOrgId;
    if (!_.isEmpty(orgId)) {
      newOrgId = orgId;
    }
    let orgNewCustRange = [];
    const newCustRrange = [];
    if (custRange.length < 1) {
      return null;
    }
    if (newOrgId === custRange[0].id) {
      return custRange;
    }
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
    const myCustomer = {
      id: '',
      name: '我的客户',
    };
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
    } = this.props;
    const { expandAll, cycleSelect, createCustRange, fspOrgId } = this.state;
    return (
      <div className={styles.customerPoolWrap}>
        <Search
          data={hotWds}
          queryHotPossibleWds={this.queryHotPossibleWds}
          queryHotWdsData={hotPossibleWdsList}
          push={push}
          orgId={fspOrgId}
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
