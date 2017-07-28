/**
 * @description 历史对比页面
 * @author sunweibin
 * @fileOverview history/Home.js
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import IndicatorOverview from '../../components/history/IndicatorOverview';
import HisDivider from '../../components/history/HisDivider';
import ScatterAnalysis from '../../components/history/ScatterAnalysis';
import HistoryComparePolyChart from '../../components/history/HistoryComparePolyChart';
import HistoryCompareRankChart from '../../components/history/HistoryCompareRankChart';
import styles from './Home.less';

const effects = {
  allInfo: 'history/getAllInfo',
  queryContrastAnalyze: 'history/queryContrastAnalyze',
  getContrastData: 'history/getContrastData',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  historyCore: state.history.historyCore,
  crrData: state.history.currentRankingRecord,
  custRange: state.report.custRange,
  visibleBoards: state.report.visibleBoards,
  globalLoading: state.activity.global,
  contributionAnalysis: state.history.contributionAnalysis,
  reviewAnalysis: state.history.reviewAnalysis,
  contrastData: state.history.contrastData,
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  queryContrastAnalyze: fectchDataFunction(true, effects.queryContrastAnalyze),
  getContrastData: fectchDataFunction(true, effects.getContrastData),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class HistoryHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    contrastData: PropTypes.object.isRequired,
    getAllInfo: PropTypes.func.isRequired,
    custRange: PropTypes.arrayisRequired,
    visibleBoards: PropTypes.arrayisRequired,
    globalLoading: PropTypes.bool,
    queryContrastAnalyze: PropTypes.func.isRequired,
    getContrastData: PropTypes.func.isRequired,
    contributionAnalysis: PropTypes.object.isRequired,
    reviewAnalysis: PropTypes.object.isRequired,
    historyCore: PropTypes.array, // 概览
    crrData: PropTypes.object, // 强弱指示分析
  }

  static defaultProps = {
    globalLoading: false,
    custRange: [],
    visibleBoards: [],
    historyCore: [],
    crrData: {},
  }

  componentWillMount() {
    const {
      location: { query },
      getAllInfo,
      queryContrastAnalyze,
      getContrastData,
    } = this.props;
    getAllInfo({
      ...query,
    });

    queryContrastAnalyze({
      boardId: '3',
      type: 'cust',
      orgId: 'ZZ001041',
      localScope: '1',
      scope: '2',
      begin: '20170601',
      end: '20170630',
      cycleType: 'month',
      // coreIndicatorId: '',
      // contrastIndicatorId: '',
    });
    queryContrastAnalyze({
      boardId: '3',
      type: 'invest',
      orgId: 'ZZ001041',
      localScope: '1',
      scope: '2',
      begin: '20170601',
      end: '20170630',
      cycleType: 'month',
      // coreIndicatorId: '',
      // contrastIndicatorId: '',
    });
    // 暂时不写参数
    getContrastData();
  }

  render() {
    const {
      location,
      reviewAnalysis,
      contributionAnalysis,
      queryContrastAnalyze,
      custRange,
      historyCore,
      crrData,
      contrastData,
    } = this.props;

    return (
      <div className="pageHistory">
        <div className={styles.historyhd}>
          {/* 头部时间组织机构选择区域 */}
        </div>
        <div className={styles.historybd}>
          <div className={styles.analyticalCaption}>核心指标</div>
          <div className={styles.indicatorOverview}>
            {/* 指标概览区域 */}
            <IndicatorOverview
              overviewData={historyCore}
              indexData={crrData}
            />
          </div>
          <div className={styles.indicatorAnalyse}>
            <div className={styles.caption}>核心指标分析-总交易量</div>
            <div className={styles.polyArea}>
              <HistoryComparePolyChart data={contrastData} />
              <HistoryCompareRankChart />
            </div>
            <HisDivider />
            <div className={styles.scatterArea}>
              <ScatterAnalysis
                location={location}
                contributionAnalysisData={contributionAnalysis}
                reviewAnalysisData={reviewAnalysis}
                queryContrastAnalyze={queryContrastAnalyze}
                custRange={custRange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
