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
    process: PropTypes.object,
    motTaskCount: PropTypes.string,
  }

  static defaultProps = {
    performanceIndicators: {},
    custRange: [],
    cycle: [],
    collectCustRange: () => { },
    position: {},
    process: {},
    motTaskCount: '0',
  }

  constructor(props) {
    super(props);
    this.state = {
      cycle: '',
      orgId: '',
    };
  }

  componentWillMount() {
    const { getAllInfo, custRange, cycle } = this.props;
    const orgid = _.isEmpty(window.forReactPosition) ? 'ZZ001041' : window.forReactPosition.orgId;
    let custType = ORG;
    const orgsId = !_.isEmpty(custRange[0]) ? custRange[0].id : '';
    if (orgid === orgsId) { // 判断客户范围类型
      custType = ORG;
    } else {
      custType = CUST_MANAGER;
    }
    this.setState({
      cycle: _.isEmpty(cycle) ? '' : cycle[0].key,
    });
    getAllInfo({
      request: {
        custTypes: custType, // 客户范围类型
        // dateType: '', // 周期类型
        orgId: orgid, // 组织ID
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    const { position: prePosition } = this.props;
    const { position: nextPosition } = nextProps;
    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;
    if (preOrgId !== nextOrgId) {
      this.setState({
        orgid: nextOrgId,
      });
      this.getIndicators();
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

  render() {
    const {
      performanceIndicators,
      custRange,
      location,
      replace,
      collectCustRange,
      process,
      cycle,
      motTaskCount,
    } = this.props;
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
            custRange={custRange}
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
