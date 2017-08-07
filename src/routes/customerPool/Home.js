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
// import { helper } from '../../utils';
import Search from '../../components/customerPool/Search';
import styles from './home.less';

const CUST_MANAGER = 1; // 客户经理
// const CUST_MANAGER_TEAM = 2; // 客户经理团队
const ORG = 3; // 组织机构
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const effects = {
  allInfo: 'customerPool/getAllInfo',
  performanceIndicators: 'customerPool/getPerformanceIndicators',
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
  empInfo: state.customerPool.empInfo, // 职位信息
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getPerformanceIndicators: fectchDataFunction(true, effects.performanceIndicators),
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
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    position: PropTypes.object,
    process: PropTypes.number,
    motTaskCount: PropTypes.string,
    empInfo: PropTypes.object,
  }

  static defaultProps = {
    performanceIndicators: EMPTY_OBJECT,
    custRange: EMPTY_LIST,
    cycle: EMPTY_LIST,
    collectCustRange: () => { },
    position: EMPTY_OBJECT,
    process: '',
    motTaskCount: '0',
    empInfo: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      cycle: '',
      orgId: '',
    };
  }

  componentWillMount() {
    const orgid = _.isEmpty(window.forReactPosition) ? 'ZZ001041' : window.forReactPosition.orgId;
    this.setState({
      fspOrgId: orgid,
      orgId: orgid, // 组织ID
    });
  }

  componentWillReceiveProps(nextProps) {
    const { position: prePosition, custRange: preCustRange, cycle: preCycle } = this.props;
    const { position: nextPosition, custRange: nextCustRange, cycle: nextCycle } = nextProps;
    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;
    if (preOrgId !== nextOrgId) {
      this.setState({
        orgId: nextOrgId,
      });
      this.getIndicators();
    }
    if (!_.isEqual(preCycle, nextCycle)) {
      this.setState({
        cycle: nextCycle[0].key,
      });
    }
    if (preCustRange !== nextCustRange) {
      this.handleGetAllInfo(nextCustRange);
    }
  }

  @autobind
  getIndicators() {
    const { getPerformanceIndicators, custRange } = this.props;
    const { orgId, cycle } = this.state;
    let custType = ORG;
    if (orgId === custRange[0].id) { // 判断客户范围类型
      custType = ORG;
    } else {
      custType = CUST_MANAGER;
    }
    getPerformanceIndicators({
      custTypes: custType, // 客户范围类型
      dateType: cycle, // 周期类型
      orgId, // 组织ID
    });
  }

  @autobind
  handleGetAllInfo(custRangeData) {
    const { getAllInfo, cycle } = this.props;
    const { orgId } = this.state;
    let custType = ORG;
    const orgsId = !_.isEmpty(custRangeData[0]) ? custRangeData[0].id : '';
    if (orgId === orgsId) { // 判断客户范围类型
      custType = ORG;
    } else {
      custType = CUST_MANAGER;
    }
    this.setState({
      cycle: _.isEmpty(cycle) ? '' : cycle[0].key,
    });
    getAllInfo({
      request: {
        custType, // 客户范围类型
        // dateType: '', // 周期类型
        orgId, // 组织ID
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

  @autobind
  createCustRange() {
    const { empInfo, custRange } = this.props;
    const { empPostnDTOList } = empInfo;
    const { fspOrgId } = this.state;
    let orgNewCustRange = [];
    const newCustRrange = [];
    if (_.isEmpty(custRange)) {
      return null;
    }
    if (fspOrgId === custRange[0].id) {
      return custRange;
    }
    orgNewCustRange = _.findIndex(custRange, item => item.id === fspOrgId);
    let newData;
    if (orgNewCustRange > -1) { // 总机构内
      newData = custRange[orgNewCustRange];
      newCustRrange.push(newData);
    } else { // 职位中去查找
      orgNewCustRange = _.findIndex(empPostnDTOList, item => item.orgId === fspOrgId);
      if (orgNewCustRange > -1) {
        const org = {
          id: empPostnDTOList[orgNewCustRange].orgId,
          name: empPostnDTOList[orgNewCustRange].orgName,
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
      custRange,
    } = this.props;
    if (_.isEmpty(custRange[0])) {
      // return null;
    }
    return (
      <div className={styles.customerPoolWrap}>
        <Search />
        <div className={styles.content}>
          <ToBeDone
            processData={process}
            motTaskCountData={motTaskCount}
          />
          <PerformanceIndicators
            indicators={performanceIndicators}
            custRange={this.createCustRange()}
            updateQueryState={this.updateQueryState}
            collectCustRange={collectCustRange}
            location={location}
            replace={replace}
            cycle={cycle}
          />
        </div>
      </div>
    );
  }
}
