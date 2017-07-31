/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import PerformanceIndicators from '../../components/customerPool/PerformanceIndicators';
import ToBeDone from '../../components/customerPool/ToBeDone';
import { helper } from '../../utils';
// import Search from '../../components/customerPool/Search';
import styles from './home.less';

const effects = {
  allInfo: 'customerPool/getAllInfo',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  performanceIndicators: state.customerPool.performanceIndicators,
  custRange: state.customerPool.custRange,
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
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
    custRange: PropTypes.array,
  }

  static defaultProps = {
    performanceIndicators: {},
    custRange: [],
  }

  componentWillMount() {
    const { location: { query }, getAllInfo } = this.props;
    getAllInfo({
      request: {
        empId: helper.getEmpId(),
        cycle: '518004',
        cusId: '002322',
      },
      currentQuery: query,
    });
  }

  render() {
    const { performanceIndicators, custRange } = this.props;
    return (
      <div className={styles.customerPoolWrap}>
        {/* <Search />*/}
        <div className={styles.content}>
          <ToBeDone />
          <PerformanceIndicators
            indicators={performanceIndicators}
            customersData={custRange}
          />
        </div>
      </div>
    );
  }
}
