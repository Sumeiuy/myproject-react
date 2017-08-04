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
import _ from 'lodash';

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
  queryHistoryContrast: 'history/queryHistoryContrast',
  getContrastData: 'history/getContrastData',
  getIndicatorLib: 'history/getIndicatorLib',
  queryCurrentRankingRecord: 'history/queryCurrentRankingRecord',
  getRankData: 'history/getRankData',
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
  contributionAnalysis: state.history.contributionAnalysis, // 贡献分析
  reviewAnalysis: state.history.reviewAnalysis, // 入岗投顾
  historyContrastDic: state.history.historyContrastDic, // 字典数据
  contrastData: state.history.contrastData,
  createLoading: state.history.createLoading,
  deleteLoading: state.history.deleteLoading,
  updateLoading: state.history.updateLoading,
  operateData: state.history.operateData,
  message: state.history.message,
  indicatorLib: state.history.indicatorLib,
  queryCurrentRankingRecord: state.history.queryCurrentRankingRecord,
  rankData: state.history.rankData,
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  queryContrastAnalyze: fectchDataFunction(true, effects.queryContrastAnalyze),
  queryHistoryContrast: fectchDataFunction(true, effects.queryHistoryContrast),
  getContrastData: fectchDataFunction(true, effects.getContrastData),
  createHistoryBoard: fectchDataFunction(true, 'history/createHistoryBoard'),
  deleteHistoryBoard: fectchDataFunction(true, 'history/deleteHistoryBoard'),
  updateHistoryBoard: fectchDataFunction(true, 'history/updateHistoryBoard'),
  getIndicatorLib: fectchDataFunction(false, effects.getIndicatorLib),
  queryCurrentRankingRecord: fectchDataFunction(false, effects.queryCurrentRankingRecord),
  getRankData: fectchDataFunction(true, effects.getRankData),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

const EMPTY_LIST = [];

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
    indicatorLib: PropTypes.object.isRequired,
    getIndicatorLib: PropTypes.func.isRequired,
    historyContrastDic: PropTypes.object.isRequired,
    queryHistoryContrast: PropTypes.func.isRequired,
    queryCurrentRankingRecord: PropTypes.func.isRequired,
    getRankData: PropTypes.func.isRequired,
    rankData: PropTypes.object.isRequired,
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
      selectKeys: [],
    };
  }

  componentWillMount() {
    // 本页面初始化的时候，只能获取boardId,已经empId
    const {
      location: { query },
      getAllInfo,
      queryHistoryContrast,
      queryContrastAnalyze,
      getContrastData,
      getIndicatorLib,
      queryCurrentRankingRecord,
      getRankData,
    } = this.props;

    getAllInfo({
      ...query,
    });

    queryCurrentRankingRecord({
      begin: '20170701',
      boardId: '3',
      cycleType: 'month',
      end: '20170719',
      scope: '2',
      orgId: 'ZZ001041093',
      contrastBegin: '20170601',
      contrastEnd: '20170619',
      localScope: '2',
      isMultiple: '0',
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
    getIndicatorLib({
      orgId: 'ZZ001041',
      type: 'TYPE_TGYJ',
    });

    // 先写一个假参数
    queryHistoryContrast({
      boardId: '3',
    });
    // 参数需要动态变
    // 暂时先写死
    getContrastData({
      boardId: 3,
      scope: '1',
      coreIndicatorId: '',
      orgId: 'ZZ001041',
      begin: '20170705',
      end: '20170723',
      contrastBegin: '20160605',
      contrastEnd: '20160623',
      cycleType: 'month',
    });

    // 获取历史排名数据
    getRankData({
      indicatorId: 'tgInNum', // 指标ID
      begin: '20170701', // 本期开始日期
      cycleType: 'month', // 周期类型
      end: '20170719', // 本期结束日期
      scope: '3', // 查询层级
      orgId: 'ZZ001041093', // 机关ID
      contrastBegin: '20170601', // 上期开始日期
      contrastEnd: '20170619', // 上期结束日期
      localScope: '2', // 当前所在层级
      pageSize: 10, // 每页显示条数
      pageNum: 1, // 页码
      orderIndicatorId: 'currSignCustAset', // 排序指标ID
      orderType: 'desc', // 排序方式
      isMultiple: '1', // 此处写死“1”
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      createLoading: preCL,
      deleteLoading: preDL,
      updateLoading: prePL,
    } = this.props;
    const { push, operateData, createLoading, deleteLoading, updateLoading } = nextProps;
    if (preCL && !createLoading) {
      // 创建完成后，需要跳转到新建看板
      const { id, ownerOrgId, boardType } = operateData;
      this.setState({
        selectKeys: [],
      },
      () => {
        const { selectKeys } = this.state;
        console.warn('selectKeys+++++', selectKeys);
        push(`/history?boardId=${id}&orgId=${ownerOrgId}&boardType=${boardType}`);
      });
    }
    if (preDL && !deleteLoading) {
      const { location: { query: { boardType } } } = this.props;
      // 删除成功
      message.success('删除成功');
      if (boardType === 'TYPE_LSDB_JYYJ') {
        push('/history?boardId=4');
      } else if (boardType === 'TYPE_LSDB_TGJX') {
        push('/history?boardId=3');
      }
    }
    if (!updateLoading && prePL) {
      message.success('保存成功');
      const { id, ownerOrgId, boardType } = operateData;
      this.setState({
        selectKeys: [],
      },
      () => {
        push(`/history?boardId=${id}&orgId=${ownerOrgId}&boardType=${boardType}`);
      });
    }
  }

  @autobind
  getUserSummuryKeys(summury) {
    if (!_.isEmpty(summury)) {
      return summury.map(o => o.key);
    }
    return [];
  }
  // 从弹出层取出挑选的指标数组
  @autobind
  saveIndcatorToHome(array) {
    console.warn('history home', array);
    // 根据 array 发出请求
    this.setState({
      selectKeys: array,
    });
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
      historyContrastDic,
      contrastData,
      indicatorLib,
      rankData,
    } = this.props;
    console.warn('historyCore', historyCore);
    // 总量指标库
    const summuryCheckedKeys = this.getUserSummuryKeys(historyCore);
    const summuryLib = {
      type: 'summury',
      boardType: 'TYPE_TGJX',
      checkTreeArr: indicatorLib.summury,
      checkedKeys: summuryCheckedKeys,
    };

    const { cust = EMPTY_LIST, invest = EMPTY_LIST } = historyContrastDic;
    const { selectKeys } = this.state;
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
              selectKeys={selectKeys}
            />

            {/* 指标概览区域 */}
            <IndicatorOverview
              overviewData={historyCore}
              indexData={crrData}
              summuryLib={summuryLib}
              saveIndcatorToHome={this.saveIndcatorToHome}
            />
          </div>
          <div className={styles.indicatorAnalyse}>
            <div className={styles.caption}>核心指标分析-总交易量</div>
            <div className={styles.polyArea}>
              <HistoryComparePolyChart data={contrastData} />
              {/* 假定数据 */}
              {
                _.isEmpty(rankData)
                ?
                null
                :
                (
                  <HistoryCompareRankChart
                    level="1"
                    scope="2"
                    data={rankData}
                    boardType="TYPE_TGJX"
                  />
                )
              }
            </div>
            <HisDivider />
            <div className={styles.scatterArea}>
              {/* 散点图区域 */}
              <ScatterAnalysis
                location={location}
                contributionAnalysisData={contributionAnalysis}
                reviewAnalysisData={reviewAnalysis}
                queryContrastAnalyze={queryContrastAnalyze}
                custRange={custRange}
                cust={cust}
                invest={invest}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
