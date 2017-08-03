/**
 * @description 历史对比页面
 * @author sunweibin
 * @fileOverview history/Home.js
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { message } from 'antd';

import IndicatorOverviewHeader from '../../components/history/IndicatorOverviewHeader';
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
  createLoading: state.history.createLoading,
  deleteLoading: state.history.deleteLoading,
  updateLoading: state.history.updateLoading,
  operateData: state.history.operateData,
  message: state.history.message,
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  queryContrastAnalyze: fectchDataFunction(true, effects.queryContrastAnalyze),
  getContrastData: fectchDataFunction(true, effects.getContrastData),
  createHistoryBoard: fectchDataFunction(true, 'history/createHistoryBoard'),
  deleteHistoryBoard: fectchDataFunction(true, 'history/deleteHistoryBoard'),
  updateHistoryBoard: fectchDataFunction(true, 'history/updateHistoryBoard'),
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
    custRange: PropTypes.array.isRequired,
    visibleBoards: PropTypes.array.isRequired,
    globalLoading: PropTypes.bool,
    queryContrastAnalyze: PropTypes.func.isRequired,
    getContrastData: PropTypes.func.isRequired,
    contributionAnalysis: PropTypes.object.isRequired,
    reviewAnalysis: PropTypes.object.isRequired,
    historyCore: PropTypes.array, // 概览
    crrData: PropTypes.object, // 强弱指示分析
    createHistoryBoard: PropTypes.func.isRequired, // 创建(另存为)
    deleteHistoryBoard: PropTypes.func.isRequired, // 删除
    updateHistoryBoard: PropTypes.func.isRequired, // 更新(保存)
    operateData: PropTypes.object,
    message: PropTypes.string,
    createLoading: PropTypes.bool,
    deleteLoading: PropTypes.bool,
    updateLoading: PropTypes.bool,
  }

  static defaultProps = {
    createLoading: false,
    deleteLoading: false,
    updateLoading: false,
    globalLoading: false,
    custRange: [],
    visibleBoards: [],
    historyCore: [],
    crrData: {},
    operateData: {},
    message: '',
  }


  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    // 本页面初始化的时候，只能获取boardId,已经empId
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

  componentWillReceiveProps(nextProps) {
    const { createLoading: preCL, deleteLoading: preDL, updateLoading: prePL } = this.props;
    const { push, operateData, createLoading, deleteLoading, updateLoading } = nextProps;
    if (preCL && !createLoading) {
      // 创建完成后，需要跳转到Edit
      const { id, ownerOrgId, boardType } = operateData;
      push(`/history?boardId=${id}&orgId=${ownerOrgId}&boardType=${boardType}`);
    }
    if (preDL && !deleteLoading) {
      // 删除成功
      message.success('删除成功');
    }
    if (!updateLoading && prePL) {
      message.success('保存成功');
      const { id } = operateData;
      push(`/history?boardId=${id}`);
    }
  }

  // 另存为新的历史对比看板
  @autobind
  createBoardConfirm(board) {
    this.props.createHistoryBoard(board);
  }

  // 确认删除历史对比的看板
  @autobind
  deleteBoardConfirm(board) {
    this.props.deleteHistoryBoard(board);
  }

  // 更新(保存)历史记录看板
  @autobind
  updateBoardConfirm(border) {
    this.props.updateHistoryBoard(border);
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
          <div className={styles.indicatorOverview}>
            {/* 核心指标头部区域---假定数据 */}
            <IndicatorOverviewHeader
              location={location}
              createBoardConfirm={this.createBoardConfirm}
              deleteBoardConfirm={this.deleteBoardConfirm}
              updateBoardConfirm={this.updateBoardConfirm}
              ownerOrgId={'ZZ001041'}
              orgId={'ZZ001041'}
              boardId={'830'}
            />

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
              {/* 假定数据 */}
              <HistoryCompareRankChart level="1" scope="2" data={[]} />
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
