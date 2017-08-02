/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import PerformanceIndicators from '../../components/customerPool/PerformanceIndicators';
import ToBeDone from '../../components/customerPool/ToBeDone';
// import { helper } from '../../utils';
import Search from '../../components/customerPool/Search';
import styles from './home.less';

const effects = {
  allInfo: 'customerPool/getAllInfo',
  statisticalPeriod: 'customerPool/getStatisticalPeriod',
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
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getStatisticalPeriod: fectchDataFunction(true, effects.statisticalPeriod),
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
    getStatisticalPeriod: PropTypes.func.isRequired,
    performanceIndicators: PropTypes.object,
    collectCustRange: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    position: PropTypes.object,
    process: PropTypes.object,
  }

  static defaultProps = {
    performanceIndicators: {},
    custRange: [],
    cycle: [],
    collectCustRange: () => {},
    position: {},
    process: {},
  }

  componentWillMount() {
    const { getAllInfo, getStatisticalPeriod } = this.props;
    getStatisticalPeriod(); // 查询周期
    getAllInfo({
      request: {
        custTypes: '', // 客户范围类型
        dateType: '', // 周期类型
        orgId: 'ZZ001041', // 组织ID
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    const { position: prePosition } = this.props;
    const { position: nextPosition } = nextProps;
    if (prePosition !== nextPosition) {
      this.setState({
        orgId: '00232',
      });
      // this.getInfo();
    }
  }
  @autobind
  getInfo() {
    const { getAllInfo } = this.props;
    const { orgId, cycle } = this.state;
    // 整理数据
    const payload = {
      orgId,
      cycle,
    };
    getAllInfo({
      request: {
        ...payload,
      },
    });
  }

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(state) {
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    this.setState({
      ...state,
      showCharts: {},
      classifyScope: {},
      classifyOrder: {},
    },
    () => {
      this.getInfo();
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
    } = this.props;
    return (
      <div className={styles.customerPoolWrap}>
        <Search />
        <div className={styles.content}>
          <ToBeDone
            processData={process}
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
